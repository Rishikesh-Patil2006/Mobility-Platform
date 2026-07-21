import { saveVehiclesToStorage, loadVehiclesFromStorage } from './vehicleStorageService';

export interface Vehicle {
  id: string;
  name: string;
  number: string;
  fuel: string;
  type: string;
  status: string;
  brand: string;
  model: string;
  ownerName?: string;
  regDate?: string;
  color?: string;
  year?: string;
  images?: string[];
  variant?: string;
  rcExpiry?: string;
  pucExpiry?: string;
  insuranceExpiry?: string;
}

export async function getVehicles(defaultVehicles: Vehicle[]): Promise<Vehicle[]> {
  return loadVehiclesFromStorage(defaultVehicles);
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  await saveVehiclesToStorage(vehicles);
}

export function validateVehicle(vehicle: Partial<Vehicle>, existingVehicles: Vehicle[]): { isValid: boolean; errors: { [key: string]: string } } {
  const errors: { [key: string]: string } = {};

  if (!vehicle.number || vehicle.number.trim() === '') {
    errors.number = 'Registration number is required.';
  } else {
    const reg = vehicle.number.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const isDuplicate = existingVehicles.some(v => v.id !== vehicle.id && v.number.toUpperCase().replace(/[^A-Z0-9]/g, '') === reg);
    if (isDuplicate) {
      errors.number = 'Vehicle with this registration number is already registered.';
    }
    
    // Indian license plate regex validation helper
    const regex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/i;
    if (!regex.test(vehicle.number.trim())) {
      errors.number = 'Invalid license plate format (e.g. MH-19-AB-1234).';
    }
  }

  if (!vehicle.brand || vehicle.brand.trim() === '') {
    errors.brand = 'Manufacturer/Brand is required.';
  }
  if (!vehicle.model || vehicle.model.trim() === '') {
    errors.model = 'Model is required.';
  }
  if (!vehicle.type) {
    errors.type = 'Vehicle category is required.';
  }
  if (!vehicle.fuel) {
    errors.fuel = 'Fuel type is required.';
  }
  if (!vehicle.year || vehicle.year.trim() === '') {
    errors.year = 'Manufacturing year is required.';
  } else {
    const currentYear = new Date().getFullYear();
    const num = parseInt(vehicle.year, 10);
    if (isNaN(num) || num < 1900 || num > currentYear) {
      errors.year = `Manufacturing year must be between 1900 and ${currentYear}.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
