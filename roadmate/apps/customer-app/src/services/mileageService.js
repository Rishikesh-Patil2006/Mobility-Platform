// roadmate/apps/customer-app/src/services/mileageService.js
import { getFuelLogs } from './fuelService';

/**
 * Calculates mileage metrics (distance travelled, km/L efficiency, and cost per km)
 * for a list of fuel entries by sorting them chronologically by odometer.
 * 
 * @param {Array} logs - List of raw fuel log records
 * @returns {Array} Enriched fuel logs with calculated metrics
 */
export const computeLogsMileage = (logs) => {
  if (!logs || logs.length === 0) return [];

  // Sort by odometer ascending to calculate differences sequentially
  const sorted = [...logs].sort((a, b) => a.odometer - b.odometer);

  const enriched = sorted.map((entry, index) => {
    let distance = 0;
    let mileage = 0;
    let costPerKm = 0;

    if (index > 0) {
      const prevEntry = sorted[index - 1];
      distance = Math.max(0, entry.odometer - prevEntry.odometer);

      if (distance > 0 && entry.quantity > 0) {
        mileage = parseFloat((distance / entry.quantity).toFixed(2));
        costPerKm = parseFloat((entry.cost / distance).toFixed(2));
      }
    }

    return {
      ...entry,
      distanceTravelled: distance,
      mileage,
      costPerKm
    };
  });

  // Return sorted desc (Latest First) for rendering UI
  return enriched.sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return b.odometer - a.odometer;
  });
};

/**
 * Retreives and enriches fuel logs with mileage calculations for a vehicle.
 * 
 * @param {string} vehicleId - Local vehicle ID
 * @returns {Promise<Array>} Enriched fuel logs list
 */
export const getEnrichedFuelLogs = async (vehicleId = null) => {
  const rawLogs = await getFuelLogs({ vehicleId });
  return computeLogsMileage(rawLogs);
};
