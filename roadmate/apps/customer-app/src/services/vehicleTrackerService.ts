// src/services/vehicleTrackerService.ts
import { getVehicleValuation } from './vehicleValueService';
import { getChallanSummary } from './challanService';
import { getVehicleInfo } from './vehicleInfoService';

export interface TrackerSummary {
  vehicleId: string;
  valuation: string;
  challansCount: number;
  expensesTotal: string;
  fuelEfficiency: string;
  rcStatus: string;
}

export const getVehicleTrackerSummary = async (
  vehicle: any
): Promise<TrackerSummary> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      if (!vehicle) {
        resolve({
          vehicleId: '',
          valuation: 'N/A',
          challansCount: 0,
          expensesTotal: '₹0',
          fuelEfficiency: 'N/A',
          rcStatus: 'Unknown'
        });
        return;
      }

      // Valuation estimate
      const val = await getVehicleValuation(vehicle, { odometer: '25000', condition: 'Good' });
      const valuation = val ? `₹${(val.estimatedValue / 100000).toFixed(2)}L` : 'N/A';

      // Challans count
      const chal = await getChallanSummary(vehicle.id);
      const challansCount = chal?.pendingCount || 0;

      // Mock expenses and efficiency based on category
      const isCar = vehicle.type === 'car';
      const expensesTotal = isCar ? '₹14,500' : '₹3,200';
      const fuelEfficiency = isCar 
        ? (vehicle.fuel === 'Electric' ? '180 Wh/km' : '15.4 km/L')
        : (vehicle.fuel === 'Electric' ? '25 Wh/km' : '45.0 km/L');

      // VAHAN Info status
      const info = await getVehicleInfo(vehicle.id);
      const rcStatus = info?.rcStatus || 'Active';

      resolve({
        vehicleId: vehicle.id,
        valuation,
        challansCount,
        expensesTotal,
        fuelEfficiency,
        rcStatus
      });
    }, 100);
  });
};
