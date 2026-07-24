export type VerificationStatusType = 'Pending Verification' | 'Verified' | 'Rejected' | 'Documents Expired' | 'APPROVED';

export interface VerificationHistory {
  status: VerificationStatusType;
  updatedAt: string;
  notes?: string;
  checkedBy?: string;
}

export const getVerificationStatusDetails = (status?: string) => {
  const normStatus = (status || '').toString().toLowerCase();

  if (normStatus.includes('verif') || normStatus.includes('approv')) {
    return {
      label: 'Verified Partner',
      description: 'Congratulations! Your business is verified and active on the RoadMate network.',
      badgeColor: '#F0FDF4',
      textColor: '#16A34A',
      borderColor: '#DCFCE7',
    };
  }

  if (normStatus.includes('reject')) {
    return {
      label: 'Rejected',
      description: 'Your verification failed due to discrepancy in uploaded documents. Please review and re-upload.',
      badgeColor: '#FEF2F2',
      textColor: '#DC2626',
      borderColor: '#FEE2E2',
    };
  }

  if (normStatus.includes('expir')) {
    return {
      label: 'Documents Expired',
      description: 'One or more of your legal business certificates have expired. Please re-upload updated licenses.',
      badgeColor: '#FEF2F2',
      textColor: '#DC2626',
      borderColor: '#FEE2E2',
    };
  }

  return {
    label: 'Pending Verification',
    description: 'Your application is under review. This process usually takes 24-48 business hours.',
    badgeColor: '#FFF7ED',
    textColor: '#D97706',
    borderColor: '#FFEDD5',
  };
};
