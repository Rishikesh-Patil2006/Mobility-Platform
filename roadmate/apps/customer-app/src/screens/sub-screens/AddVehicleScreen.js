// roadmate/apps/customer-app/src/screens/sub-screens/AddVehicleScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions, 
  Image 
} from 'react-native';
import { 
  ProgressStepper, 
  BrandDropdown, 
  ImageUploader,
  VehicleReviewCard,
  VehicleInfoLoader
} from '../../components/VehicleComponents';
import { fetchVehicleInfo, validateRegistration, parseVehicleResponse } from '../../services/vehicleInfoService';
import { validateVehicle } from '../../services/vehicleService';
import { getVehicleCategory } from '../../utils/vehicleUtils';

const { width } = Dimensions.get('window');

export default function AddVehicleScreen({ vehicles = [], vehicle, initialStep = 1, onBack, onSave }) {
  const isEditMode = !!vehicle;

  // Step state
  const [step, setStep] = useState(initialStep);

  // Form states
  const [category, setCategory] = useState('4 Wheeler'); // '2 Wheeler' | '4 Wheeler'
  const [number, setNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [fuel, setFuel] = useState('Petrol');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('2022');
  const [images, setImages] = useState([]);

  // API Fetch states
  const [fetchState, setFetchState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [vahanData, setVahanData] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [errors, setErrors] = useState({});

  // Confirmation state
  const [confirmed, setConfirmed] = useState(false);

  // Initialize values in Edit Mode
  useEffect(() => {
    if (vehicle) {
      setNumber(vehicle.number || '');
      setBrand(vehicle.brand || '');
      setModel(vehicle.model || '');
      setVariant(vehicle.variant || '');
      setFuel(vehicle.fuel || 'Petrol');
      setColor(vehicle.color || '');
      setYear(vehicle.year || '2022');
      setImages(vehicle.images || []);
      
      const mappedCategory = getVehicleCategory(vehicle.type);
      setCategory(mappedCategory);
      
      // Seed pre-existing VAHAN data if edit mode
      setVahanData({
        ownerName: vehicle.ownerName || 'Rushikesh Patil',
        regDate: vehicle.regDate || 'Apr 20, 2022',
        engineNumber: 'L15Z3******234',
        chassisNumber: 'MHHRH2G5********3456',
        rcStatus: vehicle.status || 'Active'
      });
      setFetchState('success');
    }
  }, [vehicle]);

  const currentYear = new Date().getFullYear();

  const isValidYear = (yStr) => {
    const num = parseInt(yStr, 10);
    return !isNaN(num) && num > 1900 && num <= currentYear;
  };

  const isStep2Valid = () => {
    return !!(number && brand && model.trim() && year && fuel);
  };

  const triggerVahanFetch = async () => {
    setFetchState('loading');
    setFetchError('');
    try {
      const response = await fetchVehicleInfo(number);
      const parsed = parseVehicleResponse(response);
      setVahanData(parsed);

      // Populate fetched vehicle information automatically
      if (parsed) {
        if (parsed.brand) {
          setBrand(parsed.brand);
        } else if (parsed.name) {
          const parts = parsed.name.split(' ');
          if (parts[0]) setBrand(parts[0]);
        }
        if (parsed.model) {
          setModel(parsed.model);
        } else if (parsed.name) {
          const parts = parsed.name.split(' ');
          if (parts.length > 1) setModel(parts.slice(1).join(' '));
        }
        if (parsed.fuelType) {
          setFuel(parsed.fuelType);
        }
        if (parsed.color) {
          setColor(parsed.color);
        }
        if (parsed.mfgYear) {
          setYear(parsed.mfgYear);
        }
        if (parsed.transmission) {
          setVariant(parsed.transmission);
        }
      }

      setFetchState('success');
    } catch (err) {
      console.error(err);
      setFetchError(err.message || 'Unable to Fetch Vehicle Information');
      setFetchState('error');
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!isStep2Valid()) return;
      
      const vehicleData = {
        id: vehicle?.id,
        number,
        brand,
        model,
        variant,
        fuel,
        color,
        year,
        type: category === '2 Wheeler' ? 'bike' : 'car'
      };

      const validation = validateVehicle(vehicleData, vehicles);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      setStep(3);
      triggerVahanFetch();
    } else if (step === 3) {
      if (fetchState === 'success') {
        setStep(4);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 1) {
      onBack();
    } else if (step === 3) {
      setStep(2);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSave = () => {
    if (!confirmed) return;

    onSave({
      id: isEditMode ? vehicle.id : Date.now().toString(),
      name: `${brand} ${model}`,
      number: number.toUpperCase(),
      fuel,
      type: category === '2 Wheeler' ? 'bike' : 'car',
      status: 'Active',
      brand,
      brandName: brand,
      model,
      variant,
      year,
      color,
      images,
      ownerName: vahanData ? vahanData.ownerName : 'Rushikesh Patil',
      regDate: vahanData ? vahanData.regDate : 'Apr 20, 2022',
      pucExpiry: vahanData ? vahanData.pucExpiry : 'Dec 31, 2026',
      rcExpiry: vahanData ? vahanData.rcExpiry : 'Lifetime',
      insuranceExpiry: vahanData ? vahanData.policyExpiry : 'Jun 25, 2026',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handlePrevStep} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{isEditMode ? 'Edit Vehicle' : 'Add Vehicle'}</Text>
            <Text style={styles.headerSubtitle}>
              {step === 1 && 'Step 1: Vehicle Category'}
              {step === 2 && 'Step 2: Specifications & Image'}
              {step === 3 && 'Step 3: Verification Fetch'}
              {step === 4 && 'Step 4: Review Details'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stepper display */}
      <ProgressStepper currentStep={step} />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* ── STEP 1: CATEGORY SELECTION ── */}
        {step === 1 && (
          <View style={styles.formCard}>
            <Text style={styles.cardSectionTitle}>Select Vehicle Category</Text>

            <View style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => setCategory('2 Wheeler')}
                style={[styles.categoryCard, category === '2 Wheeler' ? styles.categoryActive : null]}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>🏍️</Text>
                <Text style={styles.categoryLabel}>2 Wheeler</Text>
                <Text style={styles.categoryDesc}>Bikes, Scooters & Scooties</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCategory('4 Wheeler')}
                style={[styles.categoryCard, category === '4 Wheeler' ? styles.categoryActive : null]}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>🚗</Text>
                <Text style={styles.categoryLabel}>4 Wheeler</Text>
                <Text style={styles.categoryDesc}>Sedans, SUVs & Hatchbacks</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleNextStep}
              style={[styles.primaryBtn, styles.primaryBtnEnabled, { marginTop: 24 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Continue to Specs</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: VEHICLE DETAILS & PHOTO ── */}
        {step === 2 && (
          <View style={styles.formCard}>
            <Text style={styles.cardSectionTitle}>Vehicle Specifications</Text>

            {/* Registration Number */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Registration Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. MH19AB1234"
                placeholderTextColor="#94A3B8"
                value={number}
                onChangeText={(text) => {
                  setNumber(text);
                  if (errors.number) setErrors(prev => ({ ...prev, number: '' }));
                }}
                autoCapitalize="characters"
              />
              {errors.number ? (
                <Text style={styles.errorText}>{errors.number}</Text>
              ) : number.length > 3 && !validateRegistration(number) ? (
                <Text style={styles.errorText}>Invalid registration format. Use e.g. MH19AB1234</Text>
              ) : null}
            </View>

            {/* Brand Dropdown */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Manufacturer/Brand *</Text>
              <BrandDropdown selectedValue={brand} onValueChange={setBrand} />
            </View>

            {/* Model */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Model Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Swift, City, Activa"
                placeholderTextColor="#94A3B8"
                value={model}
                onChangeText={setModel}
              />
            </View>

            {/* Variant */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Variant (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. VXI, ZXI, STD"
                placeholderTextColor="#94A3B8"
                value={variant}
                onChangeText={setVariant}
              />
            </View>

            {/* Fuel Selector */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Fuel Type *</Text>
              <View style={styles.fuelGrid}>
                {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((f) => {
                  const active = fuel === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setFuel(f)}
                      style={[styles.fuelButton, active ? styles.fuelButtonActive : null]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.fuelText, active ? styles.fuelTextActive : null]}>{f}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Color */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Color (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Midnight Black, Silver"
                placeholderTextColor="#94A3B8"
                value={color}
                onChangeText={setColor}
              />
            </View>

            {/* Manufacturing Year */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Manufacturing Year *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2022"
                placeholderTextColor="#94A3B8"
                value={year}
                onChangeText={(text) => {
                  setYear(text);
                  if (errors.year) setErrors(prev => ({ ...prev, year: '' }));
                }}
                keyboardType="number-pad"
                maxLength={4}
              />
              {errors.year ? (
                <Text style={styles.errorText}>{errors.year}</Text>
              ) : year.length === 4 && !isValidYear(year) ? (
                <Text style={styles.errorText}>Year cannot exceed {currentYear}</Text>
              ) : null}
            </View>

            {/* Upload Vehicle Photo */}
            <Text style={[styles.label, { marginTop: 12 }]}>Upload Vehicle Photo (Optional)</Text>
            <ImageUploader images={images} onChange={setImages} />

            {/* Next Step Action */}
            <TouchableOpacity
              disabled={!isStep2Valid()}
              onPress={handleNextStep}
              style={[
                styles.primaryBtn,
                isStep2Valid() ? styles.primaryBtnEnabled : styles.primaryBtnDisabled,
                { marginTop: 24 }
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Verify Vehicle Registration</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 3: FETCH VEHICLE INFO ── */}
        {step === 3 && (
          <View style={styles.formCard}>
            <Text style={styles.cardSectionTitle}>VAHAN Verification Status</Text>

            {fetchState === 'loading' && (
              <View style={styles.statusBox}>
                <VehicleInfoLoader text="Fetching Vehicle details from National VAHAN Registry..." />
              </View>
            )}

            {fetchState === 'success' && (
              <View style={styles.statusBox}>
                <Text style={styles.successEmoji}>✅</Text>
                <Text style={styles.successHeading}>Retrieved Successfully</Text>
                <Text style={styles.statusSub}>Vehicle Information Retrieved Successfully</Text>
                
                {vahanData && (
                  <View style={styles.vahanSummary}>
                    <Text style={styles.summaryOwner}>Owner: {vahanData.ownerName}</Text>
                    <Text style={styles.summaryReg}>Reg Date: {vahanData.regDate}</Text>
                    <Text style={styles.summaryStatus}>RC Status: {vahanData.rcStatus}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setStep(4)}
                  style={[styles.primaryBtn, styles.primaryBtnEnabled, { marginTop: 20 }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Proceed to Review</Text>
                </TouchableOpacity>
              </View>
            )}

            {fetchState === 'error' && (
              <View style={styles.statusBox}>
                <Text style={styles.errorEmoji}>❌</Text>
                <Text style={styles.errorHeading}>Verification Failed</Text>
                <Text style={styles.statusSub}>{fetchError || 'Unable to Fetch Vehicle Information'}</Text>

                <View style={styles.errorActions}>
                  <TouchableOpacity
                    onPress={triggerVahanFetch}
                    style={[styles.primaryBtn, styles.primaryBtnEnabled, { flex: 1 }]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryBtnText}>Retry Fetch</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    style={styles.backDetailsBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.backDetailsText}>Edit Specs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── STEP 4: REVIEW & CONFIRM ── */}
        {step === 4 && (
          <View style={styles.formCard}>
            <Text style={styles.cardSectionTitle}>Verify & Confirm Registration</Text>

            <VehicleReviewCard
              brand={brand}
              model={model}
              number={number}
              type={category === '2 Wheeler' ? 'bike' : 'car'}
              fuel={fuel}
              year={year}
              color={color}
              images={images}
              vahanData={vahanData}
              variant={variant}
            />

            {/* Checkbox confirmation */}
            <TouchableOpacity 
              onPress={() => setConfirmed(!confirmed)}
              style={styles.checkboxRow}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, confirmed ? styles.checkboxChecked : null]}>
                {confirmed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>I confirm that all entered details and uploaded specifications are correct.</Text>
            </TouchableOpacity>

            <View style={styles.finalActions}>
              <TouchableOpacity
                onPress={() => setStep(2)}
                style={styles.editFormBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.editFormText}>Edit Specs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!confirmed}
                onPress={handleSave}
                style={[
                  styles.primaryBtn,
                  confirmed ? styles.primaryBtnEnabled : styles.primaryBtnDisabled,
                  { flex: 2, marginTop: 0 }
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>{isEditMode ? 'Confirm & Update' : 'Register & Add Vehicle'}</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(219, 234, 254, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  categoryActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  categoryDesc: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
  inputBox: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
  fuelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fuelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  fuelButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  fuelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  fuelTextActive: {
    color: 'white',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 6,
    fontWeight: '600',
  },
  primaryBtn: {
    width: '100%',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
  },
  primaryBtnEnabled: {
    backgroundColor: '#2563EB',
  },
  primaryBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '750',
  },
  statusBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  successHeading: {
    fontSize: 18,
    fontWeight: '850',
    color: '#16A34A',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorHeading: {
    fontSize: 18,
    fontWeight: '850',
    color: '#EF4444',
  },
  statusSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '650',
    marginTop: 6,
    textAlign: 'center',
  },
  vahanSummary: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginTop: 20,
    gap: 6,
  },
  summaryOwner: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '700',
  },
  summaryReg: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '650',
  },
  summaryStatus: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '800',
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 24,
  },
  backDetailsBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  backDetailsText: {
    color: '#475569',
    fontWeight: '750',
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 20,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  checkMark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 16,
  },
  finalActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  editFormBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  editFormText: {
    color: '#475569',
    fontWeight: '750',
    fontSize: 14,
  },
});
