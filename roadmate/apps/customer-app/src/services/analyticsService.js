// roadmate/apps/customer-app/src/services/analyticsService.js
import { getEnrichedFuelLogs } from './mileageService';

/**
 * Computes general fuel overview — 6 dashboard metrics.
 *
 * @param {string} [vehicleId]
 * @returns {Promise<Object>} General fuel summary
 */
export const getFuelSummary = async (vehicleId = null) => {
  const logs = await getEnrichedFuelLogs(vehicleId);
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  let totalCost = 0, totalFuel = 0;
  let costThisMonth = 0, fuelThisMonth = 0;
  let totalDistance = 0;

  const mileageLogs = logs.filter(l => l.mileage > 0);

  const avgMileage = mileageLogs.length > 0
    ? parseFloat((mileageLogs.reduce((s, l) => s + l.mileage, 0) / mileageLogs.length).toFixed(2))
    : 0;

  const avgCostPerKm = mileageLogs.length > 0
    ? parseFloat((mileageLogs.reduce((s, l) => s + (l.costPerKm || 0), 0) / mileageLogs.length).toFixed(2))
    : 0;

  logs.forEach(l => {
    totalCost  += l.cost || 0;
    totalFuel  += l.quantity || 0;
    totalDistance += l.distanceTravelled || 0;
    if ((l.date || '').startsWith(currentMonthPrefix)) {
      costThisMonth += l.cost || 0;
      fuelThisMonth += l.quantity || 0;
    }
  });

  return {
    totalCost,
    totalFuelFilled: parseFloat(totalFuel.toFixed(2)),
    avgMileage,
    avgCostPerKm,
    totalDistance: Math.round(totalDistance),
    costThisMonth,
    fuelThisMonth: parseFloat(fuelThisMonth.toFixed(2)),
    lastEntry: logs.length > 0 ? logs[0] : null,
    logCount: logs.length
  };
};

/**
 * Computes per-vehicle fuel summary stats.
 *
 * @param {Array} vehiclesList
 * @returns {Promise<Object>} Map of vehicleId → summary
 */
export const getVehicleFuelSummaries = async (vehiclesList) => {
  const summaries = {};

  for (const v of vehiclesList) {
    const logs = await getEnrichedFuelLogs(v.id);
    const mileageLogs = logs.filter(l => l.mileage > 0);

    let totalCost = 0, totalFilled = 0;
    logs.forEach(l => {
      totalCost   += l.cost || 0;
      totalFilled += l.quantity || 0;
    });

    const avgMileage = mileageLogs.length > 0
      ? parseFloat((mileageLogs.reduce((s, l) => s + l.mileage, 0) / mileageLogs.length).toFixed(2))
      : 0;

    const highestMileage = mileageLogs.length > 0
      ? Math.max(...mileageLogs.map(l => l.mileage)) : 0;
    const lowestMileage = mileageLogs.length > 0
      ? Math.min(...mileageLogs.map(l => l.mileage)) : 0;

    summaries[v.id] = {
      avgMileage,
      highestMileage,
      lowestMileage: lowestMileage === Infinity ? 0 : lowestMileage,
      lastRefuel:    logs.length > 0 ? logs[0] : null,
      totalFuelCost: totalCost,
      totalFuelFilled: parseFloat(totalFilled.toFixed(2)),
      logCount: logs.length
    };
  }

  return summaries;
};

/**
 * Computes monthly/annual fuel trends including vehicle-wise mileage.
 *
 * @param {string} [vehicleId]
 * @returns {Promise<Object>} Analytics dataset
 */
export const getFuelAnalytics = async (vehicleId = null) => {
  const logs = await getEnrichedFuelLogs(vehicleId);
  const now = new Date();
  const currentYearStr = String(now.getFullYear());
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const monthlyCost        = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };
  const monthlyConsumption = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };

  // Last 6 months for bar chart
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: monthNames[d.getMonth()],
      cost: 0,
      quantity: 0
    });
  }

  let yearlyCost = 0;

  logs.forEach(l => {
    const d = new Date(l.date);
    const mName = monthNames[d.getMonth()];
    if ((l.date || '').startsWith(currentYearStr)) yearlyCost += l.cost || 0;
    monthlyCost[mName]        += l.cost || 0;
    monthlyConsumption[mName] += l.quantity || 0;

    const bucket = last6Months.find(m => (l.date || '').startsWith(m.key));
    if (bucket) {
      bucket.cost     += l.cost || 0;
      bucket.quantity += l.quantity || 0;
    }
  });

  const mileageLogs = logs.filter(l => l.mileage > 0);
  const avgMileage = mileageLogs.length > 0
    ? parseFloat((mileageLogs.reduce((s, l) => s + l.mileage, 0) / mileageLogs.length).toFixed(2))
    : 0;
  const costPerKm = mileageLogs.length > 0
    ? parseFloat((mileageLogs.reduce((s, l) => s + (l.costPerKm || 0), 0) / mileageLogs.length).toFixed(2))
    : 0;

  // Vehicle-wise mileage groups
  const vehicleGroups = {};
  logs.forEach(l => {
    if (!vehicleGroups[l.vehicleId]) {
      vehicleGroups[l.vehicleId] = { vehicleName: l.vehicleName, mileageLogs: [], totalCost: 0, totalFuel: 0 };
    }
    if (l.mileage > 0) vehicleGroups[l.vehicleId].mileageLogs.push(l);
    vehicleGroups[l.vehicleId].totalCost += l.cost || 0;
    vehicleGroups[l.vehicleId].totalFuel += l.quantity || 0;
  });

  const vehicleWiseMileage = Object.entries(vehicleGroups).map(([vId, g]) => ({
    vehicleId: vId,
    vehicleName: g.vehicleName,
    avgMileage: g.mileageLogs.length > 0
      ? parseFloat((g.mileageLogs.reduce((s, l) => s + l.mileage, 0) / g.mileageLogs.length).toFixed(2))
      : 0,
    totalCost: g.totalCost,
    totalFuel: parseFloat(g.totalFuel.toFixed(2))
  }));

  return {
    monthlyCost,
    monthlyConsumption,
    last6Months,
    avgMileage,
    costPerKm,
    yearlyCost,
    vehicleWiseMileage
  };
};
