<?php

namespace App\Services\Merkle;

use RuntimeException;

/**
 * Deterministic SHA-256 Merkle Tree.
 *
 * Determinism rules (Merkle version 1):
 *  - Leaves   : certificate PDF SHA-256 hex digests (64-char hex).
 *  - Ordering : leaves sorted lexicographically ascending (byte order).
 *  - Hashing  : sha256( concat(leftHex, rightHex) ) lowercase hex.
 *  - Odd node : node is paired with itself (promote/copy).
 *  - Encoding : lowercase hex throughout.
 *
 * The same input + rules always yields the same root, so historical proofs
 * remain reproducible. Merkle version is stored with each anchor.
 */
class MerkleTreeService
{
    public const VERSION = 1;
    public const ALGORITHM = 'SHA-256';

    private function hashPair(string $left, string $right): string
    {
        // Always concatenate in ascending order so hashing is order-agnostic
        // (direction is not part of the proof).
        if (strcmp($left, $right) <= 0) {
            return hash('sha256', $left.$right);
        }

        return hash('sha256', $right.$left);
    }

    /**
     * Build the tree and return sorted leaves + root + a map for proofs.
     *
     * @param string[] $hashes
     * @return array{root: string, leaves: string[], version: int}
     */
    public function buildTree(array $hashes): array
    {
        $hashes = array_values(array_filter($hashes, fn ($h) => is_string($h) && preg_match('/^[0-9a-f]{64}$/i', $h)));

        if (empty($hashes)) {
            throw new RuntimeException('Cannot build a Merkle tree from zero valid hashes.');
        }

        sort($hashes, SORT_STRING); // deterministic ordering
        $leaves = $hashes;

        $level = $leaves;
        while (count($level) > 1) {
            $next = [];
            $count = count($level);
            for ($i = 0; $i < $count; $i += 2) {
                $left = $level[$i];
                $right = $level[$i + 1] ?? $left; // odd-leaf: pair with itself
                $next[] = $this->hashPair($left, $right);
            }
            $level = $next;
        }

        return [
            'root' => $level[0],
            'leaves' => $leaves,
            'version' => self::VERSION,
        ];
    }

    /**
     * Build the full tree levels (internal helper).
     */
    private function buildLevels(array $leaves): array
    {
        $levels = [$leaves];
        $level = $leaves;
        while (count($level) > 1) {
            $next = [];
            $count = count($level);
            for ($i = 0; $i < $count; $i += 2) {
                $left = $level[$i];
                $right = $level[$i + 1] ?? $left;
                $next[] = $this->hashPair($left, $right);
            }
            $levels[] = $next;
            $level = $next;
        }

        return $levels;
    }

    /**
     * Generate a Merkle proof for a leaf against the sorted leaves.
     *
     * @param string[] $sortedLeaves
     * @return string[] list of sibling hashes from bottom to top
     */
    public function generateProof(array $sortedLeaves, string $leaf): array
    {
        $index = array_search($leaf, $sortedLeaves, true);
        if ($index === false) {
            throw new RuntimeException('Leaf not found in the Merkle tree.');
        }

        $levels = $this->buildLevels($sortedLeaves);
        $proof = [];
        $position = $index;

        for ($levelIndex = 0; $levelIndex < count($levels) - 1; $levelIndex++) {
            $level = $levels[$levelIndex];
            $siblingIndex = ($position % 2 === 0) ? $position + 1 : $position - 1;
            $proof[] = $siblingIndex < count($level) ? $level[$siblingIndex] : $level[$position]; // odd-leaf self-pair
            $position = intdiv($position, 2);
        }

        return $proof;
    }

    /**
     * Reconstruct the root from a leaf + proof and compare.
     *
     * @param string[] $proof
     */
    public function verifyProof(string $merkleRoot, string $leaf, array $proof): bool
    {
        $current = $leaf;

        foreach ($proof as $sibling) {
            // Deterministic concatenation order: left child then right child.
            $left = strcmp($current, $sibling) <= 0 ? $current : $sibling;
            $right = $left === $current ? $sibling : $current;
            $current = $this->hashPair($left, $right);
        }

        return hash_equals(strtolower($merkleRoot), strtolower($current));
    }

    /**
     * Verify a full Merkle proof. (alias used by verification service)
     *
     * @param string[] $proof
     */
    public function verify(string $merkleRoot, string $leaf, array $proof): bool
    {
        return $this->verifyProof($merkleRoot, $leaf, $proof);
    }
}
