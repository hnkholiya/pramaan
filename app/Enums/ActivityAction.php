<?php

namespace App\Enums;

enum ActivityAction: string
{
    case OrganizationCreated = 'organization_created';
    case OrganizationUpdated = 'organization_updated';
    case TemplateCreated = 'template_created';
    case TemplateUpdated = 'template_updated';
    case TemplateDeleted = 'template_deleted';
    case TemplateVersionCreated = 'template_version_created';
    case BatchCreated = 'batch_created';
    case BatchFileUploaded = 'batch_file_uploaded';
    case BatchValidated = 'batch_validated';
    case BatchFieldMapped = 'batch_field_mapped';
    case QuoteCreated = 'quote_created';
    case PaymentCreated = 'payment_created';
    case PaymentVerified = 'payment_verified';
    case PaymentFailed = 'payment_failed';
    case BatchMarkedPaid = 'batch_marked_paid';
    case CertificateCreated = 'certificate_created';
    case CertificateIssued = 'certificate_issued';
    case MerkleTreeCreated = 'merkle_tree_created';
    case MerkleRootCreated = 'merkle_root_created';
    case BlockchainSubmitted = 'blockchain_submitted';
    case BlockchainConfirmed = 'blockchain_confirmed';
    case BlockchainFailed = 'blockchain_failed';
    case CertificateVerified = 'certificate_verified';
    case CertificateDownloaded = 'certificate_downloaded';
    case UserRegistered = 'user_registered';
    case UserLoggedIn = 'user_logged_in';

    public function label(): string
    {
        return str_replace('_', ' ', ucfirst($this->value));
    }
}
