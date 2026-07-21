// roadmate/apps/customer-app/src/services/documentService.ts
import { DocumentItem } from '../utils/vehicleHubUtils';

const mockDocumentsDatabase: DocumentItem[] = [
  // Vehicle 1 - Honda City (MH 12 PQ 3456)
  {
    id: 'doc-rc-1',
    key: 'rc',
    vehicleId: '1',
    vehicleName: 'Honda City i-VTEC',
    vehicleNumber: 'MH 12 PQ 3456',
    label: 'RC Book',
    type: 'rc',
    number: 'MH 12 PQ 3456',
    expiry: '2037-03-15',
    regDate: '2022-03-15',
    ownerName: 'Rushikesh Patil',
    manufacturer: 'Honda',
    model: 'City ZX i-VTEC',
    status: 'Active',
    fileUri: 'RC_MH12PQ3456.pdf'
  },
  {
    id: 'doc-ins-1',
    key: 'ins',
    vehicleId: '1',
    vehicleName: 'Honda City i-VTEC',
    vehicleNumber: 'MH 12 PQ 3456',
    label: 'Insurance',
    type: 'insurance',
    number: 'POL-99283711',
    expiry: '2026-08-15',
    provider: 'HDFC ERGO General Insurance',
    coverageType: 'Comprehensive Zero-Dep',
    premium: '₹8,450 / year',
    status: 'Active',
    fileUri: 'Policy_HDFCERGO_9928.pdf'
  },
  {
    id: 'doc-puc-1',
    key: 'puc',
    vehicleId: '1',
    vehicleName: 'Honda City i-VTEC',
    vehicleNumber: 'MH 12 PQ 3456',
    label: 'PUC',
    type: 'puc',
    number: 'MH12-PUC-2024-88',
    expiry: '2026-08-10',
    issueDate: '2024-02-10',
    status: 'Active',
    fileUri: 'PUC_MH12PUC202488.pdf'
  },

  // Vehicle 2 - Royal Enfield Classic 350 (MH 14 AB 9876)
  {
    id: 'doc-rc-2',
    key: 'rc',
    vehicleId: '2',
    vehicleName: 'Royal Enfield Classic 350',
    vehicleNumber: 'MH 14 AB 9876',
    label: 'RC Book',
    type: 'rc',
    number: 'MH 14 AB 9876',
    expiry: '2036-05-20',
    regDate: '2021-05-20',
    ownerName: 'Rushikesh Patil',
    manufacturer: 'Royal Enfield',
    model: 'Classic 350 Dark Stealth',
    status: 'Active',
    fileUri: 'RC_MH14AB9876.pdf'
  },
  {
    id: 'doc-ins-2',
    key: 'ins',
    vehicleId: '2',
    vehicleName: 'Royal Enfield Classic 350',
    vehicleNumber: 'MH 14 AB 9876',
    label: 'Insurance',
    type: 'insurance',
    number: 'ICICI-LOM-773412',
    expiry: '2026-07-21', // Expires Tomorrow / Soon
    provider: 'ICICI Lombard GIC',
    coverageType: 'Bumper to Bumper 1-Yr',
    premium: '₹3,200 / year',
    status: 'Expiring Soon',
    fileUri: 'Policy_ICICILombard.pdf'
  },
  {
    id: 'doc-puc-2',
    key: 'puc',
    vehicleId: '2',
    vehicleName: 'Royal Enfield Classic 350',
    vehicleNumber: 'MH 14 AB 9876',
    label: 'PUC',
    type: 'puc',
    number: 'MH14-PUC-2024-12',
    expiry: '2026-07-20', // Expires Today
    issueDate: '2024-01-20',
    status: 'Expiring',
    fileUri: 'PUC_MH14PUC.pdf'
  },

  // Vehicle 3 - Activa 6G (MH 12 DL 1122)
  {
    id: 'doc-rc-3',
    key: 'rc',
    vehicleId: '3',
    vehicleName: 'Activa 6G',
    vehicleNumber: 'MH 12 DL 1122',
    label: 'RC Book',
    type: 'rc',
    number: 'MH 12 DL 1122',
    expiry: '2038-11-10',
    regDate: '2023-11-10',
    ownerName: 'Rushikesh Patil',
    manufacturer: 'Honda',
    model: 'Activa 6G Deluxe',
    status: 'Active',
    fileUri: 'RC_MH12DL1122.pdf'
  },
  {
    id: 'doc-ins-3',
    key: 'ins',
    vehicleId: '3',
    vehicleName: 'Activa 6G',
    vehicleNumber: 'MH 12 DL 1122',
    label: 'Insurance',
    type: 'insurance',
    number: 'BAJAJ-ALLI-443190',
    expiry: '2026-11-10',
    provider: 'Bajaj Allianz General Insurance',
    coverageType: 'Third Party Liability',
    premium: '₹1,850 / year',
    status: 'Active',
    fileUri: 'Policy_BajajAllianz.pdf'
  },
  {
    id: 'doc-puc-3',
    key: 'puc',
    vehicleId: '3',
    vehicleName: 'Activa 6G',
    vehicleNumber: 'MH 12 DL 1122',
    label: 'PUC',
    type: 'puc',
    number: 'MH12-PUC-2023-99',
    expiry: '2026-06-15', // Expired
    issueDate: '2023-12-15',
    status: 'Expired',
    fileUri: 'PUC_MH12DL1122.pdf'
  }
];

export async function getVehicleDocuments(vehicleId?: string): Promise<DocumentItem[]> {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 200));
  if (vehicleId) {
    return mockDocumentsDatabase.filter(d => d.vehicleId === vehicleId);
  }
  return [...mockDocumentsDatabase];
}

export async function getDocumentById(docId: string): Promise<DocumentItem | null> {
  await new Promise(res => setTimeout(res, 150));
  return mockDocumentsDatabase.find(d => d.id === docId || d.key === docId) || null;
}

export function addMockDocumentsForVehicle(vehicle: any): void {
  const vehicleName = vehicle.name || `${vehicle.brand} ${vehicle.model}`;
  const regNo = vehicle.number ? vehicle.number.toUpperCase() : '';
  
  // Push RC Document
  mockDocumentsDatabase.push({
    id: `doc-rc-${vehicle.id}`,
    key: 'rc',
    vehicleId: vehicle.id,
    vehicleName,
    vehicleNumber: regNo,
    label: 'RC Book',
    type: 'rc',
    number: regNo,
    expiry: vehicle.rcExpiry || '2037-04-20',
    regDate: vehicle.regDate || '2022-04-20',
    ownerName: vehicle.ownerName || 'Rushikesh Patil',
    manufacturer: vehicle.brand,
    model: vehicle.model,
    status: 'Active',
    fileUri: `RC_${regNo.replace(/[^A-Z0-9]/g, '')}.pdf`
  });

  // Push Insurance Document
  mockDocumentsDatabase.push({
    id: `doc-ins-${vehicle.id}`,
    key: 'ins',
    vehicleId: vehicle.id,
    vehicleName,
    vehicleNumber: regNo,
    label: 'Insurance',
    type: 'insurance',
    number: `POL-${Math.floor(10000000 + Math.random() * 90000000)}`,
    expiry: vehicle.insuranceExpiry || '2026-06-25',
    provider: 'Bajaj Allianz General Insurance',
    coverageType: 'Comprehensive',
    premium: '₹7,500 / year',
    status: 'Active',
    fileUri: `Policy_BajajAllianz_${vehicle.id}.pdf`
  });

  // Push PUC Document
  mockDocumentsDatabase.push({
    id: `doc-puc-${vehicle.id}`,
    key: 'puc',
    vehicleId: vehicle.id,
    vehicleName,
    vehicleNumber: regNo,
    label: 'PUC',
    type: 'puc',
    number: `${regNo.substring(0, 4)}-PUC-2024-${Math.floor(10 + Math.random() * 90)}`,
    expiry: vehicle.pucExpiry || '2026-12-31',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    fileUri: `PUC_${regNo.replace(/[^A-Z0-9]/g, '')}.pdf`
  });
}

export function deleteMockDocumentsForVehicle(vehicleId: string): void {
  let i = mockDocumentsDatabase.length;
  while (i--) {
    if (mockDocumentsDatabase[i].vehicleId === vehicleId) {
      mockDocumentsDatabase.splice(i, 1);
    }
  }
}

export function updateMockDocumentsForVehicle(vehicle: any): void {
  const vehicleName = vehicle.name || `${vehicle.brand} ${vehicle.model}`;
  const regNo = vehicle.number ? vehicle.number.toUpperCase() : '';
  
  mockDocumentsDatabase.forEach(d => {
    if (d.vehicleId === vehicle.id) {
      d.vehicleName = vehicleName;
      d.vehicleNumber = regNo;
      if (d.type === 'rc') {
        d.number = regNo;
        d.expiry = vehicle.rcExpiry || d.expiry;
        d.regDate = vehicle.regDate || d.regDate;
      } else if (d.type === 'insurance') {
        d.expiry = vehicle.insuranceExpiry || d.expiry;
      } else if (d.type === 'puc') {
        d.expiry = vehicle.pucExpiry || d.expiry;
      }
    }
  });
}
