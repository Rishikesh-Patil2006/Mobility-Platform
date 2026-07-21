// src/screens/sub-screens/VehicleValuationScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { 
  VehicleSummaryCard, 
  FactorCard, 
  ConditionSelector, 
  EstimateButton,
  DepreciationChart,
  MarketInsightCard,
  ComparisonCard,
  ActionCard
} from '../../components/ValuationComponents';
import { getVehicleValuation } from '../../services/vehicleValueService';
import { getMarketInsights } from '../../services/marketPriceService';
import { getSimilarComparisons } from '../../services/comparisonService';
import { VehicleFilterDropdown, VehicleValueCard, VehiclePriceCard, VehicleTrendCard } from '../../components/VehicleComponents';
import { filterVehicles } from '../../utils/vehicleUtils';

export default function VehicleValuationScreen({ vehicles = [], initialVehicleId, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');
  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  // Select active vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId || (vehicles[0]?.id || '1'));
  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Sync selected index when filter updates
  useEffect(() => {
    if (filteredVehicles.length > 0) {
      const exists = filteredVehicles.some(v => v.id === selectedVehicleId);
      if (!exists) {
        setSelectedVehicleId(filteredVehicles[0].id);
      }
    }
  }, [selectedFilter, filteredVehicles]);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Form states
  const [odometer, setOdometer] = useState('24500');
  const [condition, setCondition] = useState('Good');
  const [accidentHistory, setAccidentHistory] = useState('No'); // Yes | No
  const [prevOwners, setPrevOwners] = useState('0'); // 0 | 1 | 2 | 3+
  const [serviceHistory, setServiceHistory] = useState('Complete'); // Complete | Partial | Unknown
  
  // Advanced condition details
  const [tyreCondition, setTyreCondition] = useState('Good'); // Excellent | Good | Average | Needs Replacement
  const [batteryHealth, setBatteryHealth] = useState('Good'); // Excellent | Good | Weak
  const [exteriorCondition, setExteriorCondition] = useState('Minor Scratches'); // Scratch-free | Minor Scratches | Dented | Needs Painting
  const [interiorCondition, setInteriorCondition] = useState('Clean'); // Clean | Average | Damaged

  // Results states
  const [result, setResult] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [comparisons, setComparisons] = useState([]);

  // Sync state if initial vehicle changes
  useEffect(() => {
    if (initialVehicleId) {
      setSelectedVehicleId(initialVehicleId);
    }
  }, [initialVehicleId]);

  // Recalculate valuation when vehicle selector or inputs change
  const handleCalculateValuation = async () => {
    if (!activeVehicle) {
      Alert.alert("Error", "No vehicle selected.");
      return;
    }

    setLoading(true);
    try {
      const inputs = {
        odometer,
        condition,
        accidentHistory,
        prevOwners,
        serviceHistory,
        tyreCondition,
        batteryHealth,
        exteriorCondition,
        interiorCondition
      };

      const valRes = await getVehicleValuation(activeVehicle, inputs);
      const marketRes = await getMarketInsights(activeVehicle, valRes.estimatedValue);
      const compRes = await getSimilarComparisons(activeVehicle.id);

      setResult(valRes);
      setMarketData(marketRes);
      setComparisons(compRes);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to compute vehicle valuation.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial calculation when vehicle changes
  useEffect(() => {
    if (activeVehicle) {
      handleCalculateValuation();
    }
  }, [selectedVehicleId]);

  const handleAction = (type) => {
    Alert.alert(
      "Smart Valuation",
      `The "${type}" action is Coming Soon in next updates!`,
      [{ text: "OK" }]
    );
  };

  const isTwoWheeler = activeVehicle?.type === 'scooty' || activeVehicle?.type === 'bike';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Value</Text>
        </View>
        <VehicleFilterDropdown selectedOption={selectedFilter} onSelectOption={setSelectedFilter} vehicles={vehicles} darkTheme={false} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Vehicle Selection Chips */}
        {vehicles.length > 0 && (
          <View style={styles.vehicleSelectorRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {filteredVehicles.map((v) => {
                const isActive = v.id === selectedVehicleId;
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => setSelectedVehicleId(v.id)}
                    style={[styles.vehicleChip, isActive ? styles.vehicleChipActive : null]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.vehicleChipText, isActive ? styles.vehicleChipTextActive : null]}>
                      {v.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Selected Vehicle details card */}
        <VehicleSummaryCard vehicle={activeVehicle} />

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loaderText}>Processing valuation algorithms...</Text>
          </View>
        )}

        {/* Estimation Result Card & Refresh Button */}
        {!loading && result && (
          <View style={{ marginBottom: 16 }}>
            <VehicleValueCard 
              value={result.formattedValue}
              age={result.age}
              date={result.lastUpdated}
            />
            <VehiclePriceCard 
              lowestPrice={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.lowestPrice)}
              highestPrice={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.highestPrice)}
            />
            
            {/* Refresh Valuation Placeholder Button */}
            <TouchableOpacity 
              style={styles.refreshValuationBtn} 
              onPress={handleCalculateValuation}
              activeOpacity={0.8}
            >
              <Text style={styles.refreshValuationText}>🔄 Refresh Valuation</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Valuation input fields (Condition & Parameters) */}
        <View style={styles.formContainer}>
          <Text style={styles.formSectionHeading}>Valuation Parameters</Text>
          
          {/* Current Odometer input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Odometer Reading (km)</Text>
            <TextInput
              style={styles.textInput}
              value={odometer}
              onChangeText={setOdometer}
              placeholder="e.g. 24500"
              keyboardType="numeric"
            />
          </View>

          {/* Condition Selector */}
          <ConditionSelector selected={condition} onSelect={setCondition} />

          <EstimateButton onPress={handleCalculateValuation} />
        </View>

        {/* Value Factors list */}
        {!loading && result && (
          <View style={styles.factorsSection}>
            <Text style={styles.factorsHeading}>Factors Affecting Value</Text>
            {result.factors?.map((f, i) => (
              <FactorCard 
                key={i}
                title={f.title} 
                value={f.value} 
                impact={f.impact} 
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  body: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  vehicleSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  labelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    textTransform: 'uppercase',
  },
  chipScroll: {
    gap: 8,
  },
  vehicleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
    marginRight: 8,
  },
  vehicleChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  vehicleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  vehicleChipTextActive: {
    color: '#2563EB',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  refreshValuationBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  refreshValuationText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  formSectionHeading: {
    fontSize: 12,
    fontWeight: '850',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  buttonToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#2563EB',
  },
  pillsScroll: {
    gap: 6,
  },
  pillBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginRight: 6,
  },
  pillBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  pillBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  pillBtnTextActive: {
    color: '#2563EB',
  },
  factorsSection: {
    marginBottom: 20,
  },
  factorsHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  priceHistoryCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
  },
  priceHistoryHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  priceTimeline: {
    paddingLeft: 4,
  },
  priceTimelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeftColumn: {
    alignItems: 'center',
  },
  timelinePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#EFF6FF',
    marginTop: 4,
  },
  timelineVerticalLine: {
    width: 2,
    backgroundColor: '#E2E8F0',
    flex: 1,
    marginVertical: 4,
  },
  timelineRightColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  priceLabelText: {
    fontSize: 12,
    fontWeight: '850',
    color: '#1E293B',
  },
  priceDateText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '750',
    marginTop: 2,
  },
  priceValText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2563EB',
    marginTop: 4,
  },
  loaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '750',
    marginTop: 12,
  },
});
