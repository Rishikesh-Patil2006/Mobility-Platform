export const getVerificationStatusDetails = (status) => {
  const normStatus = (status || '').toString().toLowerCase();

  if (normStatus.includes('verif') || normStatus.includes('approv')) {
    return {
      label: 'Verified Partner',
      description: 'Congratulations! Your business is verified and active on the RoadMate network.',
      badgeColor: '#F0FDF4', // light green
      textColor: '#16A34A', // dark green
      borderColor: '#DCFCE7',
    };
  }

  if (normStatus.includes('reject')) {
    return {
      label: 'Rejected',
      description: 'Your verification failed due to discrepancy in uploaded documents. Please review and re-upload.',
      badgeColor: '#FEF2F2', // light red
      textColor: '#DC2626', // dark red
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

  // Default: Pending Verification
  return {
    label: 'Pending Verification',
    description: 'Your application is under review. This process usually takes 24-48 business hours.',
    badgeColor: '#FFF7ED', // light orange
    textColor: '#D97706', // dark orange
    borderColor: '#FFEDD5',
  };
};
