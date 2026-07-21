export interface VahanVehicleInfo {
  id: string;
  name: string;
  number: string;
  ownerName: string;
  regDate: string;
  vehicleClass: string;
  vehicleCategory: string;
  engineNumber: string;
  chassisNumber: string;
  fuelType: string;
  color: string;
  seatingCapacity: string;
  insuranceCompany: string;
  policyExpiry: string;
  rcExpiry: string;
  pucExpiry: string;
  transmission: string;
  mfgYear: string;
  age: string;
  rcStatus: string;
  insuranceStatus: string;
  pucStatus: string;
  overallHealth: string;
  healthScore: number;
  registrationAuthority?: string;
}

// Mock VAHAN Database representing active vehicles synced in the system
const mockVahanDb: { [key: string]: VahanVehicleInfo } = {
  '1': {
    id: '1',
    name: 'Honda City',
    number: 'MH-19-AB-1234',
    ownerName: 'Rushikesh Patil',
    regDate: 'Apr 20, 2022',
    vehicleClass: 'Motor Car (LMV)',
    vehicleCategory: 'Passenger Car',
    engineNumber: 'L15Z3******234',
    chassisNumber: 'MHHRH2G5********3456',
    fuelType: 'Petrol',
    color: 'Golden Brown',
    seatingCapacity: '5 Seats',
    insuranceCompany: 'Bajaj Allianz General',
    policyExpiry: 'Jul 25, 2026',
    rcExpiry: 'Apr 20, 2037',
    pucExpiry: 'Dec 31, 2025',
    transmission: 'Manual',
    mfgYear: '2022',
    age: '4 Years, 3 Months',
    rcStatus: 'Active',
    insuranceStatus: 'Valid',
    pucStatus: 'Valid',
    overallHealth: 'Excellent',
    healthScore: 92,
    registrationAuthority: 'Jalgaon RTO, MH',
  },
  '2': {
    id: '2',
    name: 'Activa 6G',
    number: 'MH-19-CD-5678',
    ownerName: 'Rushikesh Patil',
    regDate: 'Mar 10, 2021',
    vehicleClass: 'Scooter (MCWG)',
    vehicleCategory: 'Two Wheeler',
    engineNumber: 'JF50E8******456',
    chassisNumber: 'ME4JF503********3456',
    fuelType: 'Petrol',
    color: 'Matte Blue',
    seatingCapacity: '2 Seats',
    insuranceCompany: 'HDFC ERGO General',
    policyExpiry: 'Nov 30, 2026',
    rcExpiry: 'Mar 10, 2036',
    pucExpiry: 'Jan 10, 2025',
    transmission: 'Automatic (CVT)',
    mfgYear: '2021',
    age: '5 Years, 4 Months',
    rcStatus: 'Active',
    insuranceStatus: 'Valid',
    pucStatus: 'Expired',
    overallHealth: 'Needs Attention',
    healthScore: 70,
    registrationAuthority: 'Jalgaon RTO, MH',
  },
  '3': {
    id: '3',
    name: 'Hyundai Creta EV',
    number: 'MH-19-EF-9012',
    ownerName: 'Rushikesh Patil',
    regDate: 'Jun 15, 2023',
    vehicleClass: 'Motor Car (EV)',
    vehicleCategory: 'SUV Passenger',
    engineNumber: 'EVHCN******456',
    chassisNumber: 'MALE2BKA********3456',
    fuelType: 'Electric',
    color: 'Atlas White',
    seatingCapacity: '5 Seats',
    insuranceCompany: 'Tata AIG General',
    policyExpiry: 'Mar 15, 2027',
    rcExpiry: 'Jun 15, 2038',
    pucExpiry: 'Feb 28, 2026',
    transmission: 'Automatic',
    mfgYear: '2023',
    age: '3 Years, 1 Month',
    rcStatus: 'Active',
    insuranceStatus: 'Valid',
    pucStatus: 'Valid',
    overallHealth: 'Excellent',
    healthScore: 98,
    registrationAuthority: 'Jalgaon RTO, MH',
  }
};

/**
 * Retrieves detailed VAHAN specifications for a vehicle by registered ID or registration number.
 * Prepared for future integration with national VAHAN APIs.
 */
export const getVehicleInfo = async (vehicleId: string): Promise<VahanVehicleInfo | null> => {
  // Simulate network delay for API readiness
  return new Promise((resolve) => {
    setTimeout(() => {
      // Allow retrieval by ID or registration plate
      const record = mockVahanDb[vehicleId] || Object.values(mockVahanDb).find(v => v.number === vehicleId);
      resolve(record || null);
    }, 150);
  });
};

/**
 * Validates registration formatting for Indian license plates.
 */
export const validateRegistration = (registrationNumber: string): boolean => {
  if (!registrationNumber) return false;
  const regex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/i;
  return regex.test(registrationNumber.trim());
};

/**
 * Simulates fetching vehicle information from VAHAN database.
 */
export const fetchVehicleInfo = async (registrationNumber: string): Promise<VahanVehicleInfo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reg = registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (reg.includes('FAIL')) {
        reject(new Error('VAHAN database connection timed out.'));
        return;
      }
      
      const found = Object.values(mockVahanDb).find(
        v => v.number.replace(/[^A-Z0-9]/g, '') === reg
      );

      if (found) {
        resolve(found);
      } else {
        // Return a mock fallback vehicle specification
        resolve({
          id: 'temp-' + Date.now(),
          name: 'Maruti Swift',
          number: registrationNumber.toUpperCase(),
          ownerName: 'Rushikesh Patil',
          regDate: 'Jun 12, 2020',
          vehicleClass: 'Motor Car (LMV)',
          vehicleCategory: 'Passenger Car',
          engineNumber: 'K12M1******123',
          chassisNumber: 'MBHGD1G5********1234',
          fuelType: 'Petrol',
          color: 'Midnight Blue',
          seatingCapacity: '5 Seats',
          insuranceCompany: 'SBI General Insurance',
          policyExpiry: 'Dec 10, 2026',
          rcExpiry: 'Jun 12, 2035',
          pucExpiry: 'Oct 15, 2025',
          transmission: 'Manual',
          mfgYear: '2020',
          age: '6 Years',
          rcStatus: 'Active',
          insuranceStatus: 'Valid',
          pucStatus: 'Valid',
          overallHealth: 'Good',
          healthScore: 85,
          registrationAuthority: 'Jalgaon RTO, MH',
        });
      }
    }, 1500);
  });
};

/**
 * Parses raw vehicle specs response into formatted state objects.
 */
export const parseVehicleResponse = (response: any): any => {
  if (!response) return null;
  return {
    id: response.id,
    name: response.name || `${response.manufacturer || ''} ${response.model || ''}`.trim() || 'Custom Vehicle',
    number: response.number ? response.number.toUpperCase() : '',
    ownerName: response.ownerName || 'Rushikesh Patil',
    regDate: response.regDate || response.registrationDate || 'Apr 20, 2022',
    vehicleClass: response.vehicleClass || 'Motor Car (LMV)',
    vehicleCategory: response.vehicleCategory || 'Passenger Car',
    engineNumber: response.engineNumber || 'L15Z3******234',
    chassisNumber: response.chassisNumber || 'MHHRH2G5********3456',
    fuelType: response.fuelType || 'Petrol',
    color: response.color || 'White',
    seatingCapacity: response.seatingCapacity || '5 Seats',
    insuranceCompany: response.insuranceCompany || 'Bajaj Allianz General',
    policyExpiry: response.policyExpiry || 'Jul 25, 2026',
    rcExpiry: response.rcExpiry || 'Apr 20, 2037',
    pucExpiry: response.pucExpiry || 'Dec 31, 2025',
    transmission: response.transmission || 'Manual',
    mfgYear: response.mfgYear || response.year || '2022',
    age: response.age || '4 Years',
    rcStatus: response.rcStatus || 'Active',
    insuranceStatus: response.insuranceStatus || 'Valid',
    pucStatus: response.pucStatus || 'Valid',
    overallHealth: response.overallHealth || 'Excellent',
    healthScore: response.healthScore || 90,
    registrationAuthority: response.registrationAuthority || 'Jalgaon RTO, MH',
  };
};
