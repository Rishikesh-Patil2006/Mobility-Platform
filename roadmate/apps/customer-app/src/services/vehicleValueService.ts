// roadmate/apps/customer-app/src/services/vehicleValueService.ts

export interface ValuationInputs {
  odometer?: string | number;
  condition?: string;
  accidentHistory?: string;
  prevOwners?: string;
  serviceHistory?: string;
  tyreCondition?: string;
  batteryHealth?: string;
  exteriorCondition?: string;
  interiorCondition?: string;
}

export interface ValuationFactor {
  title: string;
  value: string;
  impact: string;
}

export interface ValuationResult {
  estimatedValue: number;
  formattedValue: string;
  lowestPrice: number;
  highestPrice: number;
  age: number;
  condition: string;
  lastUpdated: string;
  factors: ValuationFactor[];
}

/**
 * Calculates mock vehicle valuation based on age, odometer reading, and condition parameters.
 */
export async function getVehicleValuation(
  vehicle: any,
  inputs: ValuationInputs = {}
): Promise<ValuationResult> {
  if (!vehicle) {
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()}`;
    return {
      estimatedValue: 0,
      formattedValue: '₹0',
      lowestPrice: 0,
      highestPrice: 0,
      age: 0,
      condition: 'N/A',
      lastUpdated: formattedDate,
      factors: []
    };
  }

  const isTwoWheeler = vehicle.type === 'scooty' || vehicle.type === 'bike';
  const odometerNum = parseInt(String(inputs.odometer || '24500'), 10) || 24500;
  const condition = inputs.condition || 'Good';

  // Base price based on brand/model or default category
  let basePrice = isTwoWheeler ? 95000 : 780000;
  const nameLower = (vehicle.name || '').toLowerCase();
  const brandLower = (vehicle.brand || '').toLowerCase();
  const modelLower = (vehicle.model || '').toLowerCase();

  if (nameLower.includes('city') || modelLower.includes('city')) basePrice = 1100000;
  if (nameLower.includes('creta') || modelLower.includes('creta')) basePrice = 1950000;
  if (nameLower.includes('xuv') || modelLower.includes('xuv')) basePrice = 2100000;
  if (nameLower.includes('innova') || modelLower.includes('innova')) basePrice = 2600000;
  if (nameLower.includes('activa') || modelLower.includes('activa')) basePrice = 85000;
  if (nameLower.includes('ather') || modelLower.includes('ather')) basePrice = 145000;

  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(String(vehicle.year || '2022'), 10) || 2022;
  const ageYears = Math.max(1, currentYear - vehicleYear);

  // Depreciation rate per year
  const depRate = isTwoWheeler ? 9000 : 85000;
  let baseline = Math.max(isTwoWheeler ? 25000 : 150000, basePrice - (ageYears * depRate));

  // Odometer reading impact
  const odoRate = isTwoWheeler ? 0.6 : 2.5;
  const odoDeduction = odometerNum * odoRate;

  // Condition adjustment
  let condAdjustment = 0;
  if (condition === 'Excellent') condAdjustment = isTwoWheeler ? 5000 : 40000;
  if (condition === 'Average') condAdjustment = isTwoWheeler ? -4000 : -40000;
  if (condition === 'Needs Repair') condAdjustment = isTwoWheeler ? -12000 : -110000;

  let finalVal = baseline - odoDeduction + condAdjustment;
  finalVal = Math.max(isTwoWheeler ? 18000 : 90000, Math.round(finalVal));

  const margin = isTwoWheeler ? 6000 : 45000;
  const lowestPrice = Math.max(isTwoWheeler ? 15000 : 80000, finalVal - margin);
  const highestPrice = finalVal + margin;

  const formattedVal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(finalVal);

  const now = new Date();
  const lastUpdated = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()}`;

  const factors: ValuationFactor[] = [
    {
      title: 'Vehicle Age & Model Year',
      value: `${ageYears} ${ageYears === 1 ? 'Year' : 'Years'} (${vehicleYear})`,
      impact: `-${ageYears * (isTwoWheeler ? 8 : 10)}%`
    },
    {
      title: 'Odometer Mileage',
      value: `${odometerNum.toLocaleString()} km`,
      impact: odometerNum > 30000 ? 'High Depreciation' : 'Moderate Wear'
    },
    {
      title: 'Overall Condition State',
      value: condition,
      impact: condition === 'Excellent' ? '+5% Bonus' : condition === 'Needs Repair' ? '-15% Deduction' : 'Standard'
    }
  ];

  return {
    estimatedValue: finalVal,
    formattedValue: formattedVal,
    lowestPrice,
    highestPrice,
    age: ageYears,
    condition,
    lastUpdated,
    factors
  };
}
