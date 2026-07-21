// roadmate/apps/customer-app/src/services/expenseService.js

// ── EXPENSE CATEGORY REGISTRY ──
// Future categories can be added here without any UI changes.
export const EXPENSE_CATEGORIES = {
  'Fuel':                  { icon: '⛽', title: 'Fuel',                  color: '#EF4444' },
  'Service & Maintenance': { icon: '🔧', title: 'Service & Maintenance',  color: '#3B82F6' },
  'Insurance':             { icon: '🛡️', title: 'Insurance',              color: '#10B981' },
  'PUC':                   { icon: '🍃', title: 'PUC',                    color: '#22C55E' },
  'Repairs':               { icon: '⚙️', title: 'Repairs',                color: '#F59E0B' },
  'Accessories':           { icon: '🛍️', title: 'Accessories',            color: '#8B5CF6' },
  'Parking':               { icon: '🅿️', title: 'Parking',               color: '#6B7280' },
  'Toll':                  { icon: '🛣️', title: 'Toll',                   color: '#06B6D4' },
  'Penalty / Challan':     { icon: '🚔', title: 'Penalty / Challan',      color: '#DC2626' },
  'Other':                 { icon: '📝', title: 'Other',                  color: '#EC4899' },
};

// ── MOCK EXPENSE DATABASE ──
let localExpenses = [
  // ── Vehicle 1: Honda City (4 Wheeler) ──
  {
    id: 'exp-101',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Fuel',
    amount: 3500,
    date: '2026-07-18',
    vendor: 'HP Fuel Pump, Jalgaon',
    description: 'Full tank petrol top-up.',
    status: 'Paid',
    linkedModule: 'Fuel Tracker',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-102',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Service & Maintenance',
    amount: 8200,
    date: '2026-05-10',
    vendor: 'Authorized Honda Service Center',
    description: 'Scheduled 50,000 km maintenance — engine oil flush, filter replacement.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-103',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Toll',
    amount: 240,
    date: '2026-07-15',
    vendor: 'Highway Toll Plaza, NH6',
    description: 'Round trip highway toll payment.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-104',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Parking',
    amount: 100,
    date: '2026-07-19',
    vendor: 'Jalgaon Market Plaza Parking',
    description: 'Weekend parking charge.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-105',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Insurance',
    amount: 12500,
    date: '2026-03-01',
    vendor: 'HDFC ERGO General Insurance',
    description: 'Comprehensive zero-dep insurance renewal for FY 2026-27.',
    status: 'Paid',
    linkedModule: 'Vehicle Hub',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-106',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Penalty / Challan',
    amount: 1000,
    date: '2026-06-12',
    vendor: 'Maharashtra Traffic Police',
    description: 'Speed limit violation on NH6.',
    status: 'Paid',
    linkedModule: 'Challans',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-107',
    vehicleId: '1',
    vehicleName: 'Honda City',
    category: 'Fuel',
    amount: 4200,
    date: '2026-06-20',
    vendor: 'BPCL Pump, NH6 Junction',
    description: 'Highway journey refuel.',
    status: 'Paid',
    linkedModule: 'Fuel Tracker',
    source: 'Auto-linked',
    billImage: null
  },

  // ── Vehicle 2: Activa 6G (2 Wheeler) ──
  {
    id: 'exp-201',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    category: 'Fuel',
    amount: 450,
    date: '2026-07-19',
    vendor: 'Indian Oil Station, Jalgaon',
    description: 'Weekly scooter refuel.',
    status: 'Paid',
    linkedModule: 'Fuel Tracker',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-202',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    category: 'PUC',
    amount: 80,
    date: '2026-01-10',
    vendor: 'RTO Authorized PUC Station',
    description: 'PUC renewal validity check.',
    status: 'Paid',
    linkedModule: 'Vehicle Hub',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-203',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    category: 'Repairs',
    amount: 1200,
    date: '2026-04-15',
    vendor: 'National Auto Garage',
    description: 'Brake pads replacement and belt tightening.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-204',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    category: 'Fuel',
    amount: 500,
    date: '2026-06-30',
    vendor: 'HP Pump, Station Road',
    description: 'Monthly top-up.',
    status: 'Paid',
    linkedModule: 'Fuel Tracker',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-205',
    vehicleId: '2',
    vehicleName: 'Activa 6G',
    category: 'Accessories',
    amount: 850,
    date: '2026-05-22',
    vendor: 'Speed Zone Accessories',
    description: 'New rear view mirrors and handlebar grips.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },

  // ── Vehicle 3: Hyundai Creta EV (4 Wheeler) ──
  {
    id: 'exp-301',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    category: 'Service & Maintenance',
    amount: 3500,
    date: '2026-06-20',
    vendor: 'Hyundai EV Care Plaza',
    description: 'Battery health assessment and diagnostics scan.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-302',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    category: 'Accessories',
    amount: 4500,
    date: '2026-06-16',
    vendor: 'Car Decor Jalgaon',
    description: 'Premium floor mats and phone holder mount.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-303',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    category: 'Toll',
    amount: 180,
    date: '2026-07-10',
    vendor: 'Highway Toll Plaza, NH6',
    description: 'One-way toll charge.',
    status: 'Paid',
    linkedModule: null,
    source: 'Manual',
    billImage: null
  },
  {
    id: 'exp-304',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    category: 'Fuel',
    amount: 256,
    date: '2026-07-10',
    vendor: 'Fortum Charge Drive, Highway',
    description: 'EV quick charge during trip.',
    status: 'Paid',
    linkedModule: 'Fuel Tracker',
    source: 'Auto-linked',
    billImage: null
  },
  {
    id: 'exp-305',
    vehicleId: '3',
    vehicleName: 'Hyundai Creta EV',
    category: 'Insurance',
    amount: 18000,
    date: '2026-02-15',
    vendor: 'Bajaj Allianz EV Cover',
    description: 'EV insurance with zero-dep and roadside assistance.',
    status: 'Paid',
    linkedModule: 'Vehicle Hub',
    source: 'Auto-linked',
    billImage: null
  },
];

// ── CRUD OPERATIONS ──

/**
 * Returns filtered, searched, and sorted expense records.
 * Supports vehicleId, vehicleIds[], category, search, sort query params.
 *
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export const getExpenses = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...localExpenses];

      // Filter by single vehicle
      if (params.vehicleId) {
        filtered = filtered.filter(e => e.vehicleId === params.vehicleId);
      }

      // Filter by multiple vehicles (array)
      if (params.vehicleIds && params.vehicleIds.length > 0) {
        const idSet = new Set(params.vehicleIds);
        filtered = filtered.filter(e => idSet.has(e.vehicleId));
      }

      // Filter by category
      if (params.category && params.category !== 'All Expenses') {
        filtered = filtered.filter(e => e.category === params.category);
      }

      // Search query
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(e =>
          (e.vehicleName || '').toLowerCase().includes(q) ||
          (e.vendor || '').toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q)
        );
      }

      // Sort ordering
      if (params.sort === 'Oldest First') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      resolve(filtered);
    }, 120);
  });
};

/**
 * Retrieves a single expense record by ID.
 */
export const getExpenseById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localExpenses.find(e => e.id === id) || null);
    }, 80);
  });
};

/**
 * Inserts a new expense record.
 */
export const addExpense = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecord = {
        id: 'exp-' + Date.now().toString(36).toUpperCase(),
        status: 'Paid',
        source: 'Manual',
        linkedModule: null,
        billImage: null,
        ...data,
        amount: parseFloat(data.amount) || 0,
      };
      localExpenses.push(newRecord);
      resolve(newRecord);
    }, 150);
  });
};

/**
 * Auto-adds an expense record from another module (Fuel Tracker, Challans, etc.).
 * Prevents duplicate entries by checking for existing linkedModule + vehicleId + date + amount match.
 *
 * @param {Object} data - { vehicleId, vehicleName, category, amount, date, vendor, description, linkedModule, source }
 * @returns {Promise<Object>} Created or existing expense record
 */
export const autoAddExpenseFromModule = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dedup check: same module + vehicleId + date + amount
      const exists = localExpenses.find(e =>
        e.linkedModule === data.linkedModule &&
        e.vehicleId === data.vehicleId &&
        e.date === data.date &&
        e.amount === parseFloat(data.amount)
      );

      if (exists) {
        resolve(exists);
        return;
      }

      const newRecord = {
        id: 'exp-' + Date.now().toString(36).toUpperCase(),
        status: 'Paid',
        source: 'Auto-linked',
        billImage: null,
        ...data,
        amount: parseFloat(data.amount) || 0,
      };
      localExpenses.push(newRecord);
      resolve(newRecord);
    }, 100);
  });
};

/**
 * Updates an existing expense record.
 */
export const updateExpense = async (id, updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = localExpenses.findIndex(e => e.id === id);
      if (index !== -1) {
        localExpenses[index] = {
          ...localExpenses[index],
          ...updatedData,
          amount: parseFloat(updatedData.amount) || localExpenses[index].amount
        };
        resolve(localExpenses[index]);
      } else {
        resolve(null);
      }
    }, 150);
  });
};

/**
 * Deletes an expense record.
 */
export const deleteExpense = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const before = localExpenses.length;
      localExpenses = localExpenses.filter(e => e.id !== id);
      resolve(localExpenses.length < before);
    }, 120);
  });
};
