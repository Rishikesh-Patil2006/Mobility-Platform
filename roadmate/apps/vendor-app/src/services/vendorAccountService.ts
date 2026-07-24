export interface AccountDetails {
  email: string;
  mobile: string;
  twoStepEnabled: boolean;
}

let mockAccountStore: AccountDetails = {
  email: 'partner.garage@roadmate.app',
  mobile: '+91 98765 43210',
  twoStepEnabled: false,
};

export const fetchAccountDetails = async (): Promise<AccountDetails> => {
  return mockAccountStore;
};

export const changePassword = async (
  oldPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> => {
  if (!oldPass || !newPass) return { success: false, error: 'All password fields are required.' };
  if (newPass.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
  return { success: true };
};

export const updateAccountEmail = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  if (!email || !email.includes('@')) return { success: false, error: 'Valid email address required.' };
  mockAccountStore.email = email;
  return { success: true };
};

export const updateAccountMobile = async (
  mobile: string
): Promise<{ success: boolean; error?: string }> => {
  if (!mobile || mobile.length < 10) return { success: false, error: 'Valid mobile number required.' };
  mockAccountStore.mobile = mobile;
  return { success: true };
};

export const toggleTwoFactor = async (): Promise<boolean> => {
  mockAccountStore.twoStepEnabled = !mockAccountStore.twoStepEnabled;
  return mockAccountStore.twoStepEnabled;
};

export const deleteVendorAccount = async (): Promise<boolean> => {
  return true;
};
