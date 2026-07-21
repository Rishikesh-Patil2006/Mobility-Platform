// roadmate/apps/customer-app/src/services/vehicleHubService.ts
import { getVehicleDocuments } from './documentService';
import { calculateExpiryStatus } from '../utils/vehicleHubUtils';

export interface VehicleHubSummary {
  totalDocs: number;
  validDocs: number;
  expiringDocs: number;
  expiredDocs: number;
  complianceScore: number; // percentage e.g. 85%
  urgentItems: Array<{
    id: string;
    label: string;
    vehicleName: string;
    status: string;
  }>;
}

export async function getVehicleHubSummary(vehicleId?: string): Promise<VehicleHubSummary> {
  const docs = await getVehicleDocuments(vehicleId);
  
  let valid = 0;
  let expiring = 0;
  let expired = 0;
  const urgent: VehicleHubSummary['urgentItems'] = [];

  docs.forEach(doc => {
    const status = calculateExpiryStatus(doc.expiry);
    if (status.daysLeft < 0) {
      expired++;
      urgent.push({
        id: doc.id,
        label: doc.label,
        vehicleName: doc.vehicleName || 'Vehicle',
        status: status.label
      });
    } else if (status.daysLeft <= 30) {
      expiring++;
      urgent.push({
        id: doc.id,
        label: doc.label,
        vehicleName: doc.vehicleName || 'Vehicle',
        status: status.label
      });
    } else {
      valid++;
    }
  });

  const total = docs.length;
  const complianceScore = total > 0 ? Math.round((valid / total) * 100) : 100;

  return {
    totalDocs: total,
    validDocs: valid,
    expiringDocs: expiring,
    expiredDocs: expired,
    complianceScore,
    urgentItems: urgent
  };
}
