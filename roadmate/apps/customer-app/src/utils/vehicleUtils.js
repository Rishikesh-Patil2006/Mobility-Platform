// roadmate/apps/customer-app/src/utils/vehicleUtils.js

/**
 * Returns consistent styling colors for fuel types matching Roadmate's palette.
 * 
 * @param {string} fuelType - Fuel identifier (Petrol, Diesel, CNG, EV, Hybrid)
 * @returns {Object} { text, bg, border } colors
 */
export const getFuelBadgeColor = (fuelType) => {
  const f = (fuelType || '').trim().toLowerCase();
  switch (f) {
    case 'petrol':
      return { text: '#D97706', bg: '#FEF3C7', border: '#FDE68A' }; // Orange/Yellow
    case 'diesel':
      return { text: '#4B5563', bg: '#F3F4F6', border: '#E5E7EB' }; // Dark Grey
    case 'cng':
      return { text: '#059669', bg: '#ECFDF5', border: '#A7F3D0' }; // Emerald Green
    case 'electric':
    case 'ev':
      return { text: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }; // Blue
    case 'hybrid':
      return { text: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' }; // Purple
    default:
      return { text: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' }; // Slate Slate
  }
};

/**
 * Maps vehicle type strings (car, bike, scooty, ev) to category categories (2 Wheeler, 4 Wheeler).
 * 
 * @param {string} vehicleType - Type string
 * @returns {string} '2 Wheeler' | '4 Wheeler'
 */
export const getVehicleCategory = (vehicleType) => {
  const t = (vehicleType || '').trim().toLowerCase();
  if (t === 'bike' || t === 'scooty') {
    return '2 Wheeler';
  }
  return '4 Wheeler';
};

/**
 * Filters a vehicle list based on the global dropdown selection.
 * 
 * @param {Array} vehicles - List of vehicles
 * @param {string} filterOption - 'All Vehicles' | '2 Wheelers' | '4 Wheelers'
 * @returns {Array} Filtered list
 * 
 * Maps both '2 Wheeler'/'4 Wheeler' and '2 Wheelers'/'4 Wheelers' format safely.
 */
export const filterVehicles = (vehicles, filterOption) => {
  if (!vehicles) return [];
  const cleanOption = (filterOption || '').trim();
  if (!cleanOption || cleanOption === 'All Vehicles') return vehicles;

  if (cleanOption === '2 Wheelers' || cleanOption === '2 Wheeler' || cleanOption === 'All 2 Wheelers') {
    return vehicles.filter(v => getVehicleCategory(v.type) === '2 Wheeler');
  }

  if (cleanOption === '4 Wheelers' || cleanOption === '4 Wheeler' || cleanOption === 'All 4 Wheelers') {
    return vehicles.filter(v => getVehicleCategory(v.type) === '4 Wheeler');
  }

  // Match by individual vehicle ID, registration number, or name
  const matched = vehicles.filter(v => 
    v.id === cleanOption || 
    (v.number && v.number.toLowerCase() === cleanOption.toLowerCase()) ||
    (v.number && v.number.replace(/[-\s]/g, '').toLowerCase() === cleanOption.replace(/[-\s]/g, '').toLowerCase()) ||
    (v.name && v.name.toLowerCase() === cleanOption.toLowerCase())
  );

  return matched.length > 0 ? matched : vehicles;
};

/**
 * Groups vehicles by category.
 */
export const groupVehicles = (vehicles) => {
  if (!vehicles) return { twoWheeler: [], fourWheeler: [] };
  return {
    twoWheeler: vehicles.filter(v => getVehicleCategory(v.type) === '2 Wheeler'),
    fourWheeler: vehicles.filter(v => getVehicleCategory(v.type) === '4 Wheeler')
  };
};

export const groupVehicleType = groupVehicles;

export const getFuelBadge = getFuelBadgeColor;

/**
 * Sorts vehicles by name or ID.
 */
export const sortVehicles = (vehicles, sortBy = 'name') => {
  if (!vehicles) return [];
  const sorted = [...vehicles];
  if (sortBy === 'name') {
    return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }
  return sorted.sort((a, b) => String(a.id).localeCompare(String(b.id)));
};

/**
 * Helper to calculate mock vehicle valuation.
 */
export const calculateVehicleValue = (vehicle, odometer = 25000, condition = 'Good') => {
  if (!vehicle) return { estimatedValue: 0, minRange: 0, maxRange: 0 };
  
  const isTwo = getVehicleCategory(vehicle.type) === '2 Wheeler';
  const odoNum = parseInt(odometer) || 0;
  
  let basePrice = isTwo ? 95000 : 780000;
  if (vehicle.name?.toLowerCase().includes('city')) basePrice = 1100000;
  if (vehicle.name?.toLowerCase().includes('creta')) basePrice = 1950000;
  if (vehicle.name?.toLowerCase().includes('xuv700')) basePrice = 2100000;
  if (vehicle.name?.toLowerCase().includes('innova')) basePrice = 2600000;

  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(vehicle.year) || 2022;
  const ageYears = Math.max(1, currentYear - vehicleYear);
  
  // Base depreciation
  const depRate = isTwo ? 9000 : 85000;
  let baseline = Math.max(isTwo ? 20000 : 120000, basePrice - (ageYears * depRate));
  
  // Odometer impact
  const odoRate = isTwo ? 0.7 : 2.8;
  const odoDeduction = odoNum * odoRate;
  
  // Condition impact
  let condAdjustment = 0;
  if (condition === 'Excellent') condAdjustment = isTwo ? 4000 : 35000;
  if (condition === 'Average') condAdjustment = isTwo ? -5000 : -45000;
  if (condition === 'Needs Repair') condAdjustment = isTwo ? -12000 : -120000;
  
  let finalVal = baseline - odoDeduction + condAdjustment;
  finalVal = Math.max(isTwo ? 15000 : 80000, Math.round(finalVal));
  
  const margin = isTwo ? 5000 : 40000;
  return {
    estimatedValue: finalVal,
    minRange: Math.max(isTwo ? 12000 : 70000, finalVal - margin),
    maxRange: finalVal + margin,
    age: ageYears
  };
};
