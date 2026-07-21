// roadmate/apps/customer-app/src/services/comparisonService.js

// Mock database of similar market vehicle transactions/listings
const mockComparisonDb = {
  // Cars (Default / Sedan)
  '1': [
    {
      id: 'comp-101',
      name: 'Honda City V MT',
      year: 2021,
      mileage: '38,000 km',
      owners: '1st Owner',
      price: '₹7,25,000',
      healthScore: '88%'
    },
    {
      id: 'comp-102',
      name: 'Hyundai Verna SX',
      year: 2022,
      mileage: '28,000 km',
      owners: '1st Owner',
      price: '₹8,10,000',
      healthScore: '91%'
    },
    {
      id: 'comp-103',
      name: 'Maruti Ciaz Alpha',
      year: 2022,
      mileage: '45,000 km',
      owners: '2nd Owner',
      price: '₹6,80,000',
      healthScore: '85%'
    }
  ],
  // Scooters / Bikes
  '2': [
    {
      id: 'comp-201',
      name: 'TVS Jupiter ZX',
      year: 2021,
      mileage: '22,000 km',
      owners: '1st Owner',
      price: '₹58,000',
      healthScore: '84%'
    },
    {
      id: 'comp-202',
      name: 'Activa 5G DLX',
      year: 2020,
      mileage: '31,000 km',
      owners: '1st Owner',
      price: '₹48,000',
      healthScore: '80%'
    },
    {
      id: 'comp-203',
      name: 'Activa 6G Premium',
      year: 2022,
      mileage: '12,000 km',
      owners: '1st Owner',
      price: '₹68,000',
      healthScore: '92%'
    }
  ],
  // EVs / Premium SUVs
  '3': [
    {
      id: 'comp-301',
      name: 'Tata Nexon EV Max',
      year: 2023,
      mileage: '18,000 km',
      owners: '1st Owner',
      price: '₹14,50,000',
      healthScore: '95%'
    },
    {
      id: 'comp-302',
      name: 'MG ZS EV Exclusive',
      year: 2023,
      mileage: '24,000 km',
      owners: '1st Owner',
      price: '₹16,80,000',
      healthScore: '93%'
    },
    {
      id: 'comp-303',
      name: 'BYD Atto 3 EV',
      year: 2023,
      mileage: '15,000 km',
      owners: '1st Owner',
      price: '₹24,00,000',
      healthScore: '97%'
    }
  ]
};

/**
 * Retrieves lists of similar vehicle listings/transactions in the regional market.
 * Prepared for future comparison engine API integration.
 * 
 * @param {string} vehicleId - Local vehicle ID
 * @returns {Promise<Array>} List of comparison cards
 */
export const getSimilarComparisons = async (vehicleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockComparisonDb[vehicleId] || mockComparisonDb['1']);
    }, 150);
  });
};
