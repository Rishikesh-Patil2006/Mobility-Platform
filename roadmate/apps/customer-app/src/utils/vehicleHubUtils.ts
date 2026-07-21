// roadmate/apps/customer-app/src/utils/vehicleHubUtils.ts
import { filterVehicles } from './vehicleUtils';

export interface ExpiryStatusResult {
  label: 'Valid' | 'Expires in 20 Days' | 'Expires Tomorrow' | 'Expired' | string;
  color: string;
  bg: string;
  border: string;
  daysLeft: number;
}

export interface DocumentItem {
  id: string;
  key: string;
  vehicleId: string;
  vehicleName?: string;
  vehicleNumber?: string;
  label: string; // 'RC Book' | 'Insurance' | 'PUC'
  type: 'rc' | 'insurance' | 'puc' | 'dl' | 'driving-license';
  number: string;
  expiry: string;
  issueDate?: string;
  regDate?: string;
  ownerName?: string;
  provider?: string;
  coverageType?: string;
  premium?: string;
  model?: string;
  manufacturer?: string;
  status?: string;
  fileUri?: string;
}

/**
 * Calculates human-readable expiry status and UI theme tokens based on target expiry date.
 */
export function calculateExpiryStatus(expiryDateStr: string): ExpiryStatusResult {
  if (!expiryDateStr) {
    return {
      label: 'Valid',
      color: '#10B981',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      daysLeft: 999
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      label: 'Expired',
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA',
      daysLeft
    };
  }

  if (daysLeft === 0 || daysLeft === 1) {
    return {
      label: 'Expires Tomorrow',
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      daysLeft
    };
  }

  if (daysLeft <= 30) {
    return {
      label: `Expires in ${daysLeft} Days`,
      color: '#F59E0B',
      bg: '#FEF3C7',
      border: '#FDE68A',
      daysLeft
    };
  }

  return {
    label: 'Valid',
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    daysLeft
  };
}

/**
 * Filters documents by vehicle type dropdown ('All Vehicles', '2 Wheelers', '4 Wheelers')
 * and search query across vehicle names, reg numbers, and doc labels.
 * Strictly excludes Driving License (DL) records.
 */
export function filterVehicleDocuments(
  documents: DocumentItem[] = [],
  vehicles: any[] = [],
  filterOption: string = 'All Vehicles',
  searchQuery: string = ''
): DocumentItem[] {
  // 1. Filter out DL documents completely
  let list = documents.filter(d => d.type !== 'dl' && d.key !== 'dl' && !d.label?.toLowerCase().includes('driving license'));

  // 2. Filter vehicles according to 2-wheeler / 4-wheeler category dropdown
  const allowedVehicles = filterVehicles(vehicles, filterOption);
  const allowedVehicleIds = new Set(allowedVehicles.map(v => v.id));

  list = list.filter(d => allowedVehicleIds.has(d.vehicleId));

  // 3. Search query filter across doc label, vehicle name, reg number, or doc number
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(d => {
      const matchedVeh = vehicles.find(v => v.id === d.vehicleId);
      const vName = (matchedVeh ? `${matchedVeh.brand || matchedVeh.name} ${matchedVeh.model}` : d.vehicleName || '').toLowerCase();
      const vReg = (matchedVeh ? matchedVeh.number : d.vehicleNumber || '').toLowerCase();
      const label = (d.label || '').toLowerCase();
      const docNo = (d.number || '').toLowerCase();

      return vName.includes(q) || vReg.includes(q) || label.includes(q) || docNo.includes(q);
    });
  }

  return list;
}

/**
 * Sorts documents by urgency (expired/expiring first) or document title.
 */
export function sortDocuments(documents: DocumentItem[], sortBy: 'urgency' | 'name' = 'urgency'): DocumentItem[] {
  return [...documents].sort((a, b) => {
    if (sortBy === 'urgency') {
      const daysA = calculateExpiryStatus(a.expiry).daysLeft;
      const daysB = calculateExpiryStatus(b.expiry).daysLeft;
      return daysA - daysB;
    }
    return a.label.localeCompare(b.label);
  });
}

/**
 * Groups documents by document type or vehicle.
 */
export function groupDocuments(documents: DocumentItem[]) {
  return documents.reduce((acc, doc) => {
    const key = doc.type || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);
}
