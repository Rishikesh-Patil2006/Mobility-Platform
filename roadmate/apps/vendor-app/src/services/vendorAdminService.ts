export type ModerationStatus = 'APPROVED' | 'PENDING' | 'SUSPENDED' | 'REJECTED';

export interface AdminModerationState {
  moderationStatus: ModerationStatus;
  verificationStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  documentVerification: {
    shopLicense: 'VERIFIED' | 'PENDING' | 'REJECTED';
    gstCertificate: 'VERIFIED' | 'PENDING' | 'REJECTED';
  };
  suspensionNotice: string | null;
  adminNotes: string | null;
  lastAuditedDate: string;
}

const mockAdminStore: AdminModerationState = {
  moderationStatus: 'APPROVED',
  verificationStatus: 'APPROVED',
  documentVerification: {
    shopLicense: 'VERIFIED',
    gstCertificate: 'VERIFIED',
  },
  suspensionNotice: null,
  adminNotes: 'Vendor verified and approved for full customer platform visibility.',
  lastAuditedDate: '2026-07-20',
};

export const fetchAdminModerationStatus = async (
  vendorId?: string
): Promise<AdminModerationState> => {
  return mockAdminStore;
};

export const submitDocumentForAdminReview = async (
  docType: 'shopLicense' | 'gstCertificate',
  fileUri: string
): Promise<AdminModerationState> => {
  mockAdminStore.documentVerification[docType] = 'PENDING';
  mockAdminStore.verificationStatus = 'PENDING';
  mockAdminStore.adminNotes = `Document ${docType} submitted for admin audit.`;
  return mockAdminStore;
};

export const requestReverification = async (vendorId: string): Promise<boolean> => {
  mockAdminStore.moderationStatus = 'PENDING';
  mockAdminStore.adminNotes = 'Re-verification request submitted to Admin Moderation team.';
  return true;
};
