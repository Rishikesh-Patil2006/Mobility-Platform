// roadmate/apps/customer-app/src/services/drivingLicenseService.ts

export interface DrivingLicense {
  id: string;
  holderName: string;
  relationship: 'Self' | 'Father' | 'Mother' | 'Brother' | 'Sister' | 'Spouse' | 'Other';
  licenseNumber: string;
  licenseType: string;  // MC, LMV, HMV, etc.
  issueDate: string;    // YYYY-MM-DD
  expiryDate: string;   // YYYY-MM-DD
  dob?: string;         // Date of Birth
  address?: string;
  vehicleClasses?: string[];
  photo?: string | null; // base64 or URL
  notes?: string;
}

// Mock in-memory database
let localLicenses: DrivingLicense[] = [
  {
    id: 'dl-001',
    holderName: 'Rushikesh Patil',
    relationship: 'Self',
    licenseNumber: 'MH1920220012345',
    licenseType: 'LMV',
    issueDate: '2022-09-12',
    expiryDate: '2040-09-11',
    dob: '1998-09-12',
    address: 'Jalgaon, Maharashtra - 425001',
    vehicleClasses: ['MC', 'LMV'],
    photo: null,
    notes: 'Primary driving license'
  },
  {
    id: 'dl-002',
    holderName: 'Suresh Patil',
    relationship: 'Father',
    licenseNumber: 'MH1919950004321',
    licenseType: 'LMV',
    issueDate: '1995-06-15',
    expiryDate: '2026-08-10',
    dob: '1962-03-20',
    address: 'Jalgaon, Maharashtra - 425001',
    vehicleClasses: ['MC', 'LMV', 'HMV'],
    photo: null,
    notes: 'Expires soon — renewal required'
  },
  {
    id: 'dl-003',
    holderName: 'Sunita Patil',
    relationship: 'Mother',
    licenseNumber: 'MH1920080007654',
    licenseType: 'LMV',
    issueDate: '2008-04-22',
    expiryDate: '2028-04-21',
    dob: '1967-07-14',
    address: 'Jalgaon, Maharashtra - 425001',
    vehicleClasses: ['MC', 'LMV'],
    photo: null,
    notes: ''
  },
  {
    id: 'dl-004',
    holderName: 'Rahul Patil',
    relationship: 'Brother',
    licenseNumber: 'MH1920210016789',
    licenseType: 'LMV',
    issueDate: '2021-11-05',
    expiryDate: '2039-11-04',
    dob: '2001-05-18',
    address: 'Pune, Maharashtra - 411001',
    vehicleClasses: ['MC', 'LMV'],
    photo: null,
    notes: ''
  },
  {
    id: 'dl-005',
    holderName: 'Priya Patil',
    relationship: 'Sister',
    licenseNumber: 'MH1920230019876',
    licenseType: 'LMV',
    issueDate: '2023-03-18',
    expiryDate: '2025-07-25',
    dob: '2003-08-25',
    address: 'Jalgaon, Maharashtra - 425001',
    vehicleClasses: ['MC', 'LMV'],
    photo: null,
    notes: 'Expired — renewal pending'
  }
];

/**
 * Returns all driving licenses, optionally filtered.
 */
export const getLicenses = async (): Promise<DrivingLicense[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([...localLicenses]), 100);
  });
};

/**
 * Returns a single license by ID.
 */
export const getLicenseById = async (id: string): Promise<DrivingLicense | null> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(localLicenses.find(l => l.id === id) || null), 80);
  });
};

/**
 * Adds a new driving license.
 */
export const addLicense = async (data: Omit<DrivingLicense, 'id'>): Promise<DrivingLicense> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newRecord: DrivingLicense = {
        id: 'dl-' + Date.now().toString(36).toUpperCase(),
        ...data
      };
      localLicenses.push(newRecord);
      resolve(newRecord);
    }, 150);
  });
};

/**
 * Updates an existing driving license.
 */
export const updateLicense = async (id: string, data: Partial<DrivingLicense>): Promise<DrivingLicense | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const idx = localLicenses.findIndex(l => l.id === id);
      if (idx !== -1) {
        localLicenses[idx] = { ...localLicenses[idx], ...data };
        resolve(localLicenses[idx]);
      } else {
        resolve(null);
      }
    }, 150);
  });
};

/**
 * Deletes a driving license.
 */
export const deleteLicense = async (id: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const before = localLicenses.length;
      localLicenses = localLicenses.filter(l => l.id !== id);
      resolve(localLicenses.length < before);
    }, 120);
  });
};
