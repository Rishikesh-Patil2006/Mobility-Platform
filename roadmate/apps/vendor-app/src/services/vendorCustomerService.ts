import { CustomerHistoryProfile, mockCustomerDirectory } from './vendorCustomerHistoryService';

export const getCustomerProfileById = async (id: string): Promise<CustomerHistoryProfile | undefined> => {
  return mockCustomerDirectory.find((c) => c.id === id);
};

export const searchCustomerProfiles = async (query: string): Promise<CustomerHistoryProfile[]> => {
  const q = query.toLowerCase();
  return mockCustomerDirectory.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.vehicles.some((v) => v.toLowerCase().includes(q))
  );
};
