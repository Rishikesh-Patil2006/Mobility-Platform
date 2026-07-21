// roadmate/apps/customer-app/src/utils/licenseUtils.ts

export interface LicenseExpiryResult {
  status: 'Valid' | 'Expiring Soon' | 'Expires Tomorrow' | 'Expired';
  daysLeft: number;
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Calculates the expiry status of a driving license.
 *
 * @param expiryDate - ISO date string (YYYY-MM-DD)
 * @returns LicenseExpiryResult with status, daysLeft, label, color tokens
 */
export const calculateLicenseExpiry = (expiryDate: string): LicenseExpiryResult => {
  if (!expiryDate) {
    return { status: 'Expired', daysLeft: -1, label: 'No expiry date', color: '#EF4444', bgColor: '#FEE2E2' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffMs   = expiry.getTime() - today.getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status:  'Expired',
      daysLeft,
      label:   `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago`,
      color:   '#EF4444',
      bgColor: '#FEE2E2'
    };
  }
  if (daysLeft === 0) {
    return {
      status:  'Expires Tomorrow',
      daysLeft: 0,
      label:   'Expires today!',
      color:   '#DC2626',
      bgColor: '#FEF2F2'
    };
  }
  if (daysLeft === 1) {
    return {
      status:  'Expires Tomorrow',
      daysLeft: 1,
      label:   'Expires tomorrow',
      color:   '#DC2626',
      bgColor: '#FEF2F2'
    };
  }
  if (daysLeft <= 30) {
    return {
      status:  'Expiring Soon',
      daysLeft,
      label:   `Expires in ${daysLeft} days`,
      color:   '#D97706',
      bgColor: '#FEF3C7'
    };
  }
  if (daysLeft <= 90) {
    return {
      status:  'Expiring Soon',
      daysLeft,
      label:   `Expires in ${daysLeft} days`,
      color:   '#F59E0B',
      bgColor: '#FFFBEB'
    };
  }
  return {
    status:  'Valid',
    daysLeft,
    label:   `Valid · ${daysLeft} days left`,
    color:   '#10B981',
    bgColor: '#ECFDF5'
  };
};

/**
 * Filters a list of driving licenses by status and search text.
 *
 * @param licenses - Full license array
 * @param filter   - 'All' | 'Active' | 'Expiring Soon' | 'Expired'
 * @param search   - Free text (matches holderName, relationship, licenseNumber)
 */
export const filterDrivingLicenses = (
  licenses: any[],
  filter: string = 'All',
  search: string = ''
): any[] => {
  let result = [...licenses];

  if (filter && filter !== 'All Licenses') {
    result = result.filter(l => {
      const expiry = calculateLicenseExpiry(l.expiryDate);
      if (filter === 'Active')        return expiry.status === 'Valid';
      if (filter === 'Expiring Soon') return expiry.status === 'Expiring Soon' || expiry.status === 'Expires Tomorrow';
      if (filter === 'Expired')       return expiry.status === 'Expired';
      return true;
    });
  }

  if (search && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    result = result.filter(l =>
      (l.holderName || '').toLowerCase().includes(q) ||
      (l.relationship || '').toLowerCase().includes(q) ||
      (l.licenseNumber || '').toLowerCase().includes(q)
    );
  }

  return result;
};

/**
 * Groups a list of licenses by relationship type.
 *
 * @param licenses
 * @returns Object keyed by relationship label
 */
export const groupFamilyLicenses = (licenses: any[]): Record<string, any[]> => {
  const groups: Record<string, any[]> = {};
  licenses.forEach(l => {
    const key = l.relationship || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(l);
  });
  return groups;
};

/**
 * Formats a date string to a readable form.
 *
 * @param dateStr - YYYY-MM-DD
 * @returns e.g. "12 Sep 2040"
 */
export const formatLicenseDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};
