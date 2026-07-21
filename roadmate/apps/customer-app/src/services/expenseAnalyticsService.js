// roadmate/apps/customer-app/src/services/expenseAnalyticsService.js
import { getExpenses } from './expenseService';

/**
 * Computes general sum metrics for expenses (Total, Monthly, Annual).
 * Also includes per-category breakdowns for dashboard summary cards.
 *
 * @param {string} [vehicleId] - Optional vehicle filter
 * @returns {Promise<Object>} Summary metrics
 */
export const getExpenseSummary = async (vehicleId = null) => {
  const expenses = await getExpenses({ vehicleId });
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYearPrefix = String(now.getFullYear());

  let total = 0, thisMonth = 0, thisYear = 0;
  let fuelTotal = 0, maintenanceTotal = 0, penaltyTotal = 0, insuranceTotal = 0;

  expenses.forEach(e => {
    total += e.amount;
    if (e.date.startsWith(currentMonthPrefix)) thisMonth += e.amount;
    if (e.date.startsWith(currentYearPrefix))  thisYear  += e.amount;

    // Category buckets for dashboard cards
    if (e.category === 'Fuel') fuelTotal += e.amount;
    if (e.category === 'Service & Maintenance' || e.category === 'Repairs') maintenanceTotal += e.amount;
    if (e.category === 'Penalty / Challan') penaltyTotal += e.amount;
    if (e.category === 'Insurance') insuranceTotal += e.amount;
  });

  return {
    total,
    thisMonth,
    thisYear,
    fuelTotal,
    maintenanceTotal,
    penaltyTotal,
    insuranceTotal,
    count: expenses.length
  };
};

/**
 * Computes expense distribution sums by category (for analytics/charts).
 *
 * @param {string} [vehicleId]
 * @returns {Promise<Object>} Map of category → total amount
 */
export const getCategoryBreakdown = async (vehicleId = null) => {
  const expenses = await getExpenses({ vehicleId });
  const totals = {};

  expenses.forEach(e => {
    if (!totals[e.category]) totals[e.category] = 0;
    totals[e.category] += e.amount;
  });

  return totals;
};

/**
 * Computes monthly expense totals over the last 6 months (for trend chart).
 *
 * @param {string} [vehicleId]
 * @returns {Promise<Array>} [{label, total, key}]
 */
export const getMonthlyExpenseTrend = async (vehicleId = null) => {
  const expenses = await getExpenses({ vehicleId });
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${monthNames[d.getMonth()]}`,
      total: 0
    });
  }

  expenses.forEach(e => {
    const prefix = (e.date || '').substring(0, 7);
    const bucket = months.find(m => m.key === prefix);
    if (bucket) bucket.total += e.amount || 0;
  });

  return months;
};

/**
 * Computes vehicle-wise expense summary (lifetime + monthly + count).
 *
 * @param {Array} vehiclesList
 * @returns {Promise<Object>} Map of vehicleId → summary
 */
export const getVehicleSummaries = async (vehiclesList) => {
  const summaries = {};
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  for (const v of vehiclesList) {
    const expenses = await getExpenses({ vehicleId: v.id });

    let lifetime = 0, monthly = 0;

    expenses.forEach(e => {
      lifetime += e.amount;
      if (e.date.startsWith(currentMonthPrefix)) monthly += e.amount;
    });

    const lastExpense = expenses.length > 0 ? expenses[0] : null;

    summaries[v.id] = {
      lifetime,
      monthly,
      count: expenses.length,
      lastExpense: lastExpense ? {
        amount: lastExpense.amount,
        date: lastExpense.date,
        category: lastExpense.category,
        vendor: lastExpense.vendor
      } : null
    };
  }

  return summaries;
};

/**
 * Computes vehicle-wise expense array (for analytics tab).
 *
 * @param {Array} vehiclesList
 * @returns {Promise<Array>} [{ vehicleId, vehicleName, total, count }]
 */
export const getVehicleWiseExpenses = async (vehiclesList) => {
  const result = [];

  for (const v of vehiclesList) {
    const expenses = await getExpenses({ vehicleId: v.id });
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    result.push({
      vehicleId: v.id,
      vehicleName: v.name || v.vehicleName || v.model || `Vehicle ${v.id}`,
      total,
      count: expenses.length
    });
  }

  return result;
};

/**
 * Computes fuel vs. non-fuel expense split (for analytics comparison).
 *
 * @param {string} [vehicleId]
 * @returns {Promise<Object>} { fuel, maintenance, penalty, insurance, other, total }
 */
export const getFuelVsMaintenance = async (vehicleId = null) => {
  const expenses = await getExpenses({ vehicleId });

  let fuel = 0, maintenance = 0, penalty = 0, insurance = 0, other = 0;

  expenses.forEach(e => {
    switch (e.category) {
      case 'Fuel':                  fuel        += e.amount; break;
      case 'Service & Maintenance':
      case 'Repairs':               maintenance += e.amount; break;
      case 'Penalty / Challan':     penalty     += e.amount; break;
      case 'Insurance':             insurance   += e.amount; break;
      default:                      other       += e.amount; break;
    }
  });

  const total = fuel + maintenance + penalty + insurance + other;
  return { fuel, maintenance, penalty, insurance, other, total };
};
