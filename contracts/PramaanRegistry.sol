// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PramaanRegistry
 * @notice Minimal on-chain registry for PRAMAAN certificate Merkle roots.
 *
 * PRAMAAN anchors ONE Merkle root per certificate batch. The application
 * database holds the detailed certificate data; the chain stores only the
 * integrity anchor (root + timestamp). No recipient data is ever stored.
 *
 * Deployment target: Arbitrum Sepolia testnet (chain id 421614) initially,
 * then Arbitrum mainnet.
 *
 * ABI selector note (matches the Laravel ArbitrumBlockchainProvider):
 *   anchor(bytes32)        -> 0xeecdf927
 *   anchoredRoots(bytes32) -> 0xce993b8c
 */
contract PramaanRegistry {
    struct Anchor {
        bytes32 merkleRoot;
        uint256 anchoredAt;
        uint256 blockNumber;
        bool exists;
    }

    address public immutable owner;

    mapping(bytes32 => Anchor) public anchors;
    bytes32[] public allRoots;

    event RootAnchored(bytes32 indexed merkleRoot, uint256 indexed blockNumber, uint256 anchoredAt);
    event RootRevoked(bytes32 indexed merkleRoot);

    modifier onlyOwner() {
        require(msg.sender == owner, "PRAMAAN: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Anchor a Merkle root for a certificate batch.
     */
    function anchor(bytes32 merkleRoot) external onlyOwner {
        require(!anchors[merkleRoot].exists, "PRAMAAN: root already anchored");

        anchors[merkleRoot] = Anchor({
            merkleRoot: merkleRoot,
            anchoredAt: block.timestamp,
            blockNumber: block.number,
            exists: true
        });
        allRoots.push(merkleRoot);

        emit RootAnchored(merkleRoot, block.number, block.timestamp);
    }

    /**
     * @notice Check whether a root is anchored on-chain.
     */
    function anchoredRoots(bytes32 merkleRoot) external view returns (bool) {
        return anchors[merkleRoot].exists;
    }

    /**
     * @notice Retrieve anchor info for a root.
     */
    function getAnchor(bytes32 merkleRoot)
        external
        view
        returns (bytes32, uint256 anchoredAt, uint256 blockNumber, bool exists)
    {
        Anchor storage a = anchors[merkleRoot];
        return (a.merkleRoot, a.anchoredAt, a.blockNumber, a.exists);
    }

    /**
     * @notice Total number of anchored roots.
     */
    function rootCount() external view returns (uint256) {
        return allRoots.length;
    }
}
