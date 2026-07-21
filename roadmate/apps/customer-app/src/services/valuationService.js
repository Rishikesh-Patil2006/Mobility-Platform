// roadmate/apps/customer-app/src/services/valuationService.js

/**
 * Calculates a dynamic vehicle valuation based on physical condition, usage, and market parameters.
 * Prepared for future integration with pricing API endpoints.
 * 
 * @param {Object} vehicle - The vehicle object from local state/prop
 * @param {Object} inputs - Form inputs (odometer, condition, accidentHistory, etc.)
 * @returns {Promise<Object>} Formatted valuation results and factor details
 */
export const calculateValuation = async (vehicle, inputs) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!vehicle) {
        resolve(null);
        return;
      }

      const isTwoWheeler = vehicle.type === 'scooty' || vehicle.type === 'bike';
      const odoNum = parseInt(inputs.odometer) || 0;
      const currentYear = new Date().getFullYear();
      const vehicleYear = vehicle.year || 2022;
      const ageYears = Math.max(1, currentYear - vehicleYear);

      // 1. Establish baseline value based on brand/type
      let basePrice = 650000; // default passenger car base
      if (isTwoWheeler) {
        basePrice = 85000; // default scooter/bike base
      } else if (vehicle.number?.includes('AB') || vehicle.name?.includes('City')) {
        basePrice = 900000; // Honda City base
      } else if (vehicle.number?.includes('EF') || vehicle.name?.includes('Creta')) {
        basePrice = 1800000; // Creta EV base
      }

      // Age depreciation curve
      const ageRate = isTwoWheeler ? 8000 : 75000;
      let baseline = Math.max(isTwoWheeler ? 25000 : 150000, basePrice - (ageYears * ageRate));

      // 2. Odometer usage deduction
      const odoRate = isTwoWheeler ? 0.6 : 2.5;
      const odoDeduction = odoNum * odoRate;

      // 3. Overall Condition Adjustments
      let conditionAdjustment = 0;
      switch (inputs.condition) {
        case 'Excellent':
          conditionAdjustment = isTwoWheeler ? 3000 : 25000;
          break;
        case 'Good':
          conditionAdjustment = 0;
          break;
        case 'Average':
          conditionAdjustment = isTwoWheeler ? -4000 : -45000;
          break;
        case 'Needs Repair':
          conditionAdjustment = isTwoWheeler ? -9000 : -110000;
          break;
      }

      // 4. Accident history
      const accidentDeduction = inputs.accidentHistory === 'Yes' ? (isTwoWheeler ? -15000 : -140000) : 0;

      // 5. Ownership count deduction
      let ownerAdjustment = 0;
      switch (inputs.prevOwners) {
        case '0': // First Owner
          ownerAdjustment = isTwoWheeler ? 1500 : 15000; // first owner premium
          break;
        case '1': // Second Owner
          ownerAdjustment = 0;
          break;
        case '2':
          ownerAdjustment = isTwoWheeler ? -3000 : -35000;
          break;
        default: // '3+'
          ownerAdjustment = isTwoWheeler ? -8000 : -85000;
          break;
      }

      // 6. Service history
      let serviceAdjustment = 0;
      switch (inputs.serviceHistory) {
        case 'Complete':
          serviceAdjustment = isTwoWheeler ? 2500 : 25000;
          break;
        case 'Partial':
          serviceAdjustment = isTwoWheeler ? -1500 : -15000;
          break;
        case 'Unknown':
          serviceAdjustment = isTwoWheeler ? -4000 : -45000;
          break;
      }

      // 7. Tyre Condition
      let tyreAdjustment = 0;
      switch (inputs.tyreCondition) {
        case 'Excellent':
          tyreAdjustment = isTwoWheeler ? 1200 : 10000;
          break;
        case 'Good':
          tyreAdjustment = 0;
          break;
        case 'Average':
          tyreAdjustment = isTwoWheeler ? -1200 : -12000;
          break;
        case 'Needs Replacement':
          tyreAdjustment = isTwoWheeler ? -3500 : -35000;
          break;
      }

      // 8. Battery Health
      let batteryAdjustment = 0;
      switch (inputs.batteryHealth) {
        case 'Excellent':
          batteryAdjustment = isTwoWheeler ? 600 : 5000;
          break;
        case 'Good':
          batteryAdjustment = 0;
          break;
        case 'Weak':
          batteryAdjustment = isTwoWheeler ? -1000 : -10000;
          break;
      }

      // 9. Exterior Condition
      let exteriorAdjustment = 0;
      switch (inputs.exteriorCondition) {
        case 'Scratch-free':
          exteriorAdjustment = isTwoWheeler ? 1000 : 12000;
          break;
        case 'Minor Scratches':
          exteriorAdjustment = 0;
          break;
        case 'Dented':
          exteriorAdjustment = isTwoWheeler ? -2000 : -25000;
          break;
        case 'Needs Painting':
          exteriorAdjustment = isTwoWheeler ? -5000 : -55000;
          break;
      }

      // 10. Interior Condition (Cars only)
      let interiorAdjustment = 0;
      if (!isTwoWheeler) {
        switch (inputs.interiorCondition) {
          case 'Clean':
            interiorAdjustment = 8000;
            break;
          case 'Average':
            interiorAdjustment = 0;
            break;
          case 'Damaged':
            interiorAdjustment = -30000;
            break;
        }
      }

      // Final Estimated Value Compile
      let finalValuation = baseline - odoDeduction + conditionAdjustment + accidentDeduction + 
                           ownerAdjustment + serviceAdjustment + tyreAdjustment + batteryAdjustment + 
                           exteriorAdjustment + interiorAdjustment;

      // Floor value limits
      finalValuation = Math.max(isTwoWheeler ? 12000 : 75000, Math.round(finalValuation));

      // Value Ranges
      const margin = isTwoWheeler ? 4000 : 35000;
      const valMin = Math.max(isTwoWheeler ? 10000 : 60000, finalValuation - margin);
      const valMax = finalValuation + margin;

      const formattedVal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(finalValuation);

      const formattedRange = `₹${(valMin / 100000).toFixed(2)}L – ₹${(valMax / 100000).toFixed(2)}L`;

      // Confidence score calculation logic
      let score = 95;
      if (odoNum > 70000) score -= 10;
      if (inputs.serviceHistory === 'Partial') score -= 5;
      if (inputs.serviceHistory === 'Unknown') score -= 12;
      if (inputs.accidentHistory === 'Yes') score -= 15;
      if (inputs.condition === 'Average') score -= 5;
      if (inputs.condition === 'Needs Repair') score -= 10;
      score = Math.max(60, score);

      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      resolve({
        estimatedValue: finalValuation,
        formattedValue: formattedVal,
        range: formattedRange,
        confidence: `${score}%`,
        lastUpdated: today,
        factors: [
          { title: 'Vehicle Age', value: `${ageYears} year(s) old`, impact: ageYears <= 3 ? 'Positive' : 'Moderate' },
          { title: 'Kilometers Driven', value: `${inputs.odometer} km`, impact: odoNum < 35000 ? 'Positive' : 'Moderate' },
          { title: 'Overall Condition', value: inputs.condition, impact: ['Excellent', 'Good'].includes(inputs.condition) ? 'Positive' : 'Moderate' },
          { title: 'Accident Status', value: inputs.accidentHistory === 'Yes' ? 'Reported' : 'Clean Record', impact: inputs.accidentHistory === 'Yes' ? 'Moderate' : 'Positive' },
          { title: 'Service History', value: inputs.serviceHistory, impact: inputs.serviceHistory === 'Complete' ? 'Positive' : 'Moderate' },
          { title: 'Previous Owners', value: inputs.prevOwners === '0' ? 'First Owner' : `${inputs.prevOwners} Previous`, impact: inputs.prevOwners === '0' ? 'Positive' : 'Moderate' },
        ]
      });
    }, 150);
  });
};
