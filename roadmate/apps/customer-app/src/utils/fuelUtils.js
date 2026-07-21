// roadmate/apps/customer-app/src/utils/fuelUtils.js

import { getVehicleCategory } from './vehicleUtils';

/**
 * Filters fuel log entries by vehicle category, fuel type, and free-text search.
 *
 * @param {Array}  logs               - Full fuel log array
 * @param {Array}  vehicles           - Full vehicle list (for category mapping)
 * @param {string} vehicleCatFilter   - 'All Vehicles' | '2 Wheelers' | '4 Wheelers' | vehicleId
 * @param {string} fuelTypeFilter     - null | 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
 * @param {string} searchQuery        - Free text search
 * @returns {Array} Filtered logs
 */
export const filterFuelEntries = (
  logs,
  vehicles = [],
  vehicleCatFilter = 'All Vehicles',
  fuelTypeFilter = null,
  searchQuery = ''
) => {
  if (!logs || logs.length === 0) return [];
  let result = [...logs];

  // 1. Vehicle category or individual vehicle filter
  if (vehicleCatFilter && vehicleCatFilter !== 'All Vehicles') {
    if (vehicleCatFilter === '2 Wheelers' || vehicleCatFilter === '4 Wheelers') {
      const targetCat = vehicleCatFilter.startsWith('2') ? '2 Wheeler' : '4 Wheeler';
      const matchingIds = new Set(
        vehicles
          .filter(v => getVehicleCategory(v.type) === targetCat)
          .map(v => v.id)
      );
      result = result.filter(l => matchingIds.has(l.vehicleId));
    } else {
      // Individual vehicleId selected
      result = result.filter(l => l.vehicleId === vehicleCatFilter);
    }
  }

  // 2. Fuel type filter
  if (fuelTypeFilter && fuelTypeFilter !== 'All Types') {
    result = result.filter(l => l.fuelType === fuelTypeFilter);
  }

  // 3. Free-text search
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(l =>
      (l.vehicleName || '').toLowerCase().includes(q) ||
      (l.station || '').toLowerCase().includes(q) ||
      (l.date || '').includes(q) ||
      (l.fuelType || '').toLowerCase().includes(q)
    );
  }

  return result;
};

/**
 * Calculates mileage (km/L or km/kWh) from consecutive odometer readings.
 *
 * @param {number} prevOdometer - Previous odometer reading in km
 * @param {number} currOdometer - Current odometer reading in km
 * @param {number} quantity     - Fuel quantity in litres or kWh
 * @returns {number} Mileage (km/L or km/kWh), 0 if insufficient data
 */
export const calculateMileage = (prevOdometer, currOdometer, quantity) => {
  if (!prevOdometer || !currOdometer || !quantity || quantity <= 0) return 0;
  const distance = currOdometer - prevOdometer;
  if (distance <= 0) return 0;
  return parseFloat((distance / quantity).toFixed(2));
};

/**
 * Calculates cost per km.
 *
 * @param {number} cost     - Total fuel cost in INR
 * @param {number} distance - Distance travelled in km
 * @returns {number} Cost per km in INR
 */
export const calculateCostPerKM = (cost, distance) => {
  if (!cost || !distance || distance <= 0) return 0;
  return parseFloat((cost / distance).toFixed(2));
};

/**
 * Groups fuel logs by calendar month returning monthly cost totals.
 * Returns last 6 months sorted oldest → newest.
 *
 * @param {Array} logs
 * @returns {Array} [{month: 'Jan 2026', total: 5000, quantity: 80}, ...]
 */
export const calculateMonthlyFuelCost = (logs = []) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${monthNames[d.getMonth()]}`,
      total: 0,
      quantity: 0
    });
  }

  logs.forEach(l => {
    const prefix = l.date ? l.date.substring(0, 7) : '';
    const bucket = months.find(m => m.key === prefix);
    if (bucket) {
      bucket.total += l.cost || 0;
      bucket.quantity += l.quantity || 0;
    }
  });

  return months;
};

/**
 * Calculates vehicle-wise mileage summary from enriched fuel logs.
 *
 * @param {Array} enrichedLogs - Logs with computed mileage field
 * @param {Array} vehicles     - Vehicle list
 * @returns {Array} [{ vehicleId, vehicleName, avgMileage, totalFuel, totalCost }]
 */
export const getVehicleWiseMileage = (enrichedLogs = [], vehicles = []) => {
  const groups = {};

  enrichedLogs.forEach(l => {
    if (!groups[l.vehicleId]) {
      groups[l.vehicleId] = {
        vehicleId: l.vehicleId,
        vehicleName: l.vehicleName || '',
        logs: [],
        totalFuel: 0,
        totalCost: 0
      };
    }
    groups[l.vehicleId].logs.push(l);
    groups[l.vehicleId].totalFuel += l.quantity || 0;
    groups[l.vehicleId].totalCost += l.cost || 0;
  });

  return Object.values(groups).map(g => {
    const mileageLogs = g.logs.filter(l => l.mileage > 0);
    const avgMileage = mileageLogs.length > 0
      ? parseFloat((mileageLogs.reduce((s, l) => s + l.mileage, 0) / mileageLogs.length).toFixed(2))
      : 0;
    return {
      vehicleId: g.vehicleId,
      vehicleName: g.vehicleName,
      avgMileage,
      totalFuel: parseFloat(g.totalFuel.toFixed(2)),
      totalCost: g.totalCost,
      logCount: g.logs.length
    };
  });
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
