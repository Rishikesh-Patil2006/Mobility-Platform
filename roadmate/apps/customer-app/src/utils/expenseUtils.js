// roadmate/apps/customer-app/src/utils/expenseUtils.js

import { getVehicleCategory } from './vehicleUtils';

/**
 * Filters expense records by vehicle category, expense category, and free-text search.
 * Dual-filter: vehicle type (2W/4W) + expense category work together.
 *
 * @param {Array}  expenses            - Full expenses array
 * @param {Array}  vehicles            - Full vehicle list (for category mapping)
 * @param {string} vehicleCatFilter    - 'All Vehicles' | '2 Wheelers' | '4 Wheelers'
 * @param {string} categoryFilter      - null | 'Fuel' | 'Service & Maintenance' | etc.
 * @param {string} searchQuery         - Free text search
 * @returns {Array} Filtered expenses
 */
export const filterExpenses = (
  expenses,
  vehicles = [],
  vehicleCatFilter = 'All Vehicles',
  categoryFilter = null,
  searchQuery = ''
) => {
  if (!expenses || expenses.length === 0) return [];
  let result = [...expenses];

  // 1. Vehicle category filter
  if (vehicleCatFilter && vehicleCatFilter !== 'All Vehicles') {
    const targetCat = vehicleCatFilter.startsWith('2') ? '2 Wheeler' : '4 Wheeler';
    const matchingIds = new Set(
      vehicles
        .filter(v => getVehicleCategory(v.type) === targetCat)
        .map(v => v.id)
    );
    result = result.filter(e => matchingIds.has(e.vehicleId));
  }

  // 2. Expense category filter
  if (categoryFilter && categoryFilter !== 'All Expenses') {
    result = result.filter(e => e.category === categoryFilter);
  }

  // 3. Free-text search
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(e =>
      (e.vehicleName || '').toLowerCase().includes(q) ||
      (e.vendor || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.date || '').includes(q)
    );
  }

  return result;
};

/**
 * Groups expenses by calendar month returning monthly totals.
 * Returns last 6 months sorted oldest → newest.
 *
 * @param {Array} expenses
 * @returns {Array} [{month: 'Jan 2026', total: 5000}, ...]
 */
export const calculateMonthlyExpense = (expenses = []) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const months = [];

  // Build last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      total: 0
    });
  }

  expenses.forEach(e => {
    const prefix = e.date ? e.date.substring(0, 7) : '';
    const bucket = months.find(m => m.key === prefix);
    if (bucket) bucket.total += e.amount || 0;
  });

  return months;
};

/**
 * Groups expenses by vehicleId returning per-vehicle totals.
 *
 * @param {Array} expenses
 * @returns {Object} { [vehicleId]: { total, count, vehicleName } }
 */
export const groupVehicleExpenses = (expenses = []) => {
  const groups = {};
  expenses.forEach(e => {
    if (!groups[e.vehicleId]) {
      groups[e.vehicleId] = { total: 0, count: 0, vehicleName: e.vehicleName || '' };
    }
    groups[e.vehicleId].total += e.amount || 0;
    groups[e.vehicleId].count += 1;
  });
  return groups;
};

/**
 * Returns expense category color tokens matching Roadmate palette.
 *
 * @param {string} category
 * @returns {{ color: string, bg: string, icon: string }}
 */
export const getExpenseCategoryColor = (category) => {
  const map = {
    'Fuel':                 { color: '#EF4444', bg: '#FEF2F2', icon: '⛽' },
    'Service & Maintenance':{ color: '#3B82F6', bg: '#EFF6FF', icon: '🔧' },
    'Insurance':            { color: '#10B981', bg: '#ECFDF5', icon: '🛡️' },
    'PUC':                  { color: '#22C55E', bg: '#F0FDF4', icon: '🍃' },
    'Repairs':              { color: '#F59E0B', bg: '#FFFBEB', icon: '⚙️' },
    'Accessories':          { color: '#8B5CF6', bg: '#F5F3FF', icon: '🛍️' },
    'Parking':              { color: '#6B7280', bg: '#F9FAFB', icon: '🅿️' },
    'Toll':                 { color: '#06B6D4', bg: '#ECFEFF', icon: '🛣️' },
    'Penalty / Challan':    { color: '#DC2626', bg: '#FEE2E2', icon: '🚔' },
    'Other':                { color: '#EC4899', bg: '#FDF2F8', icon: '📝' },
  };
  return map[category] || map['Other'];
};

/**
 * Computes category breakdown totals from an expenses array.
 * Useful for building pie/bar charts without async service calls.
 *
 * @param {Array} expenses
 * @returns {Object} { [category]: total }
 */
export const getCategoryTotals = (expenses = []) => {
  const totals = {};
  expenses.forEach(e => {
    if (!totals[e.category]) totals[e.category] = 0;
    totals[e.category] += e.amount || 0;
  });
  return totals;
};

/**
 * Formats a number as Indian currency (₹).
 *
 * @param {number} val
 * @returns {string}
 */
export const formatINR = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);
