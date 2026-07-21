// roadmate/apps/customer-app/src/services/marketPriceService.js

/**
 * Retrieves market price insights and depreciation timelines for a vehicle.
 * Prepared for future API database integration.
 * 
 * @param {Object} vehicle - Local vehicle object
 * @param {number} currentEstimatedValue - Calculated current value
 * @returns {Promise<Object>} Market details and depreciation breakdown
 */
export const getMarketInsights = async (vehicle, currentEstimatedValue) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!vehicle) {
        resolve(null);
        return;
      }

      const isTwoWheeler = vehicle.type === 'scooty' || vehicle.type === 'bike';
      const vehicleYear = vehicle.year || 2022;
      const ageYears = Math.max(1, new Date().getFullYear() - vehicleYear);

      // Define purchase prices
      let purchasePrice = 1250000; // Honda City default
      let demand = 'High';
      let trend = 'Stable';

      if (isTwoWheeler) {
        purchasePrice = 88000; // Activa 6G default
        demand = 'Very High';
        trend = 'Stable';
      } else if (vehicle.number?.includes('EF') || vehicle.name?.includes('Creta')) {
        purchasePrice = 2200000; // Creta EV default
        demand = 'Extremely High';
        trend = 'Upward';
      }

      const currentVal = currentEstimatedValue || (purchasePrice * 0.6);
      const totalDep = Math.max(0, purchasePrice - currentVal);
      const annualDep = Math.round(totalDep / ageYears);
      const depPercent = Math.round((totalDep / purchasePrice) * 100);

      // Formatting helper
      const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(val);
      };

      // Generate a depreciation timeline (Years 0 to 5)
      const timeline = [];
      const deprecationFactors = [1.0, 0.85, 0.72, 0.60, 0.50, 0.42];
      
      for (let i = 0; i <= 5; i++) {
        const val = Math.round(purchasePrice * deprecationFactors[i]);
        timeline.push({
          year: vehicleYear + i,
          age: `${i} Yr`,
          value: val,
          formatted: formatCurrency(val),
          label: i === 0 ? 'Purchased' : `${i} Yr`
        });
      }

      resolve({
        purchasePrice,
        formattedPurchasePrice: formatCurrency(purchasePrice),
        currentValue: currentVal,
        formattedCurrentValue: formatCurrency(currentVal),
        totalDepreciation: totalDep,
        formattedTotalDepreciation: formatCurrency(totalDep),
        depreciationPercentage: `${depPercent}%`,
        annualDepreciation: annualDep,
        formattedAnnualDepreciation: formatCurrency(annualDep),
        
        // Market insights
        avgPrice: currentVal - (isTwoWheeler ? 2500 : 15000),
        formattedAvgPrice: formatCurrency(currentVal - (isTwoWheeler ? 2500 : 15000)),
        highestPrice: currentVal + (isTwoWheeler ? 6000 : 45000),
        formattedHighestPrice: formatCurrency(currentVal + (isTwoWheeler ? 6000 : 45000)),
        lowestPrice: currentVal - (isTwoWheeler ? 10000 : 80000),
        formattedLowestPrice: formatCurrency(currentVal - (isTwoWheeler ? 10000 : 80000)),
        demandLevel: demand,
        priceTrend: trend,
        
        // Price history timeline
        priceHistory: [
          { label: 'Purchase Price', value: formatCurrency(purchasePrice), date: `Year ${vehicleYear}` },
          { label: 'Current Value', value: formatCurrency(currentVal), date: 'Today' },
          { label: 'Expected Next Year', value: formatCurrency(currentVal * 0.91), date: `Year ${new Date().getFullYear() + 1}` },
        ],
        timeline
      });
    }, 150);
  });
};
