// roadmate/apps/customer-app/src/services/fuelService.js
import { autoAddExpenseFromModule } from './expenseService';

// In-memory mock database of fuel logs
let localFuelLogs = [
  {
    id: 'fuel-101',
    vehicleId: '1',
    vehicleName: 'Honda City',
    date: '2026-07-02',
    odometer: 24000,
    quantity: 35,
    cost: 3500,
    pricePerLitre: 100,
    station: 'Nayara Fuel Station, Jalgaon',
    fuelType: 'Petrol',
    notes: 'Initial trip log.'
  },
  {
    id: 'fuel-102',
    vehicleId: '1',
    vehicleName: 'Honda City',
    date: '2026-07-10',
    odometer: 24520,
    quantity: 40,
    cost: 4000,
    pricePerLitre: 100,
    station: 'HP Fuel Pump, Court Road',
    fuelType: 'Petrol',
    notes: 'Highway journey refuel.'
  },
  {
    id: 'fuel-103',
    vehicleId: '1',
    vehicleName: 'Honda City',
    date: '2026-07-18',
    odometer: 25100,
    quantity: 42,
    cost: 4200,
    pricePerLitre: 100,
    station: 'BPCL Pump, NH6 Junction',
    fuelType: 'Petrol',
    notes: 'Full tank top up.'
  },
  {
    id: 'fuel-201',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    date: '2026-06-28',
    odometer: 12000,
    quantity: 4.8,
    cost: 480,
    pricePerLitre: 100,
    station: 'Indian Oil, MIDC Road',
    fuelType: 'Petrol',
    notes: 'Weekly local commute check.'
  },
  {
    id: 'fuel-202',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    date: '2026-07-05',
    odometer: 12210,
    quantity: 5.0,
    cost: 500,
    pricePerLitre: 100,
    station: 'HP Pump, Station Road',
    fuelType: 'Petrol',
    notes: 'Clean run refuel.'
  },
  {
    id: 'fuel-203',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    date: '2026-07-19',
    odometer: 12415,
    quantity: 4.8,
    cost: 480,
    pricePerLitre: 100,
    station: 'Indian Oil, MIDC Road',
    fuelType: 'Petrol',
    notes: 'Smooth ride refuel.'
  },
  {
    id: 'fuel-301',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    date: '2026-06-30',
    odometer: 8000,
    quantity: 30,
    cost: 240,
    pricePerLitre: 8,
    station: 'Tata Power EV Fast Charger',
    fuelType: 'Electric',
    notes: 'Initial charger sync.'
  },
  {
    id: 'fuel-302',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    date: '2026-07-10',
    odometer: 8240,
    quantity: 32,
    cost: 256,
    pricePerLitre: 8,
    station: 'Fortum Charge Drive, Highway',
    fuelType: 'Electric',
    notes: 'Quick charge during trip.'
  }
];

/**
 * Returns filtered, searched, and sorted fuel log records.
 *
 * @param {Object} params - vehicleId, fuelType, search, sort
 * @returns {Promise<Array>}
 */
export const getFuelLogs = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...localFuelLogs];

      if (params.vehicleId) {
        filtered = filtered.filter(f => f.vehicleId === params.vehicleId);
      }
      if (params.fuelType && params.fuelType !== 'All Types') {
        filtered = filtered.filter(f => f.fuelType === params.fuelType);
      }
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(f =>
          (f.vehicleName || '').toLowerCase().includes(q) ||
          (f.station || '').toLowerCase().includes(q) ||
          (f.date || '').includes(q)
        );
      }
      if (params.sort === 'Oldest First') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        filtered.sort((a, b) => {
          const diff = new Date(b.date) - new Date(a.date);
          return diff !== 0 ? diff : b.odometer - a.odometer;
        });
      }
      resolve(filtered);
    }, 120);
  });
};

/**
 * Retrieves a single fuel log by ID.
 */
export const getFuelLogById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localFuelLogs.find(f => f.id === id) || null);
    }, 80);
  });
};

/**
 * Adds a new fuel entry and auto-creates a matching Expense Tracker record.
 *
 * @param {Object} data
 * @returns {Promise<Object>} Created fuel log
 */
export const addFuelLog = async (data) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const newRecord = {
        id: 'fuel-' + Date.now().toString(36).toUpperCase(),
        ...data,
        odometer:      parseInt(data.odometer)      || 0,
        quantity:      parseFloat(data.quantity)     || 0,
        cost:          parseFloat(data.cost)         || 0,
        pricePerLitre: parseFloat(data.pricePerLitre)|| 0
      };
      localFuelLogs.push(newRecord);

      // ── Auto-link to Expense Tracker ──
      try {
        await autoAddExpenseFromModule({
          vehicleId:   newRecord.vehicleId,
          vehicleName: newRecord.vehicleName,
          category:    'Fuel',
          amount:      newRecord.cost,
          date:        newRecord.date,
          vendor:      newRecord.station,
          description: `Fuel top-up: ${newRecord.quantity}L ${newRecord.fuelType} @ ₹${newRecord.pricePerLitre}/L. ${newRecord.notes || ''}`.trim(),
          linkedModule: 'Fuel Tracker',
          source:       'Auto-linked',
          fuelLogId:    newRecord.id
        });
      } catch (err) {
        // Non-fatal — fuel log is created regardless
        console.warn('Could not auto-add fuel expense:', err);
      }

      resolve(newRecord);
    }, 150);
  });
};

/**
 * Updates an existing fuel entry.
 */
export const updateFuelLog = async (id, updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = localFuelLogs.findIndex(f => f.id === id);
      if (index !== -1) {
        localFuelLogs[index] = {
          ...localFuelLogs[index],
          ...updatedData,
          odometer:      parseInt(updatedData.odometer)       || localFuelLogs[index].odometer,
          quantity:      parseFloat(updatedData.quantity)      || localFuelLogs[index].quantity,
          cost:          parseFloat(updatedData.cost)          || localFuelLogs[index].cost,
          pricePerLitre: parseFloat(updatedData.pricePerLitre) || localFuelLogs[index].pricePerLitre
        };
        resolve(localFuelLogs[index]);
      } else {
        resolve(null);
      }
    }, 150);
  });
};

/**
 * Deletes a fuel entry.
 */
export const deleteFuelLog = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const before = localFuelLogs.length;
      localFuelLogs = localFuelLogs.filter(f => f.id !== id);
      resolve(localFuelLogs.length < before);
    }, 120);
  });
};
