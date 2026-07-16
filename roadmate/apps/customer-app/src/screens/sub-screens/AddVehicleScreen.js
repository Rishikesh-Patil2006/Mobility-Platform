import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Data maps matching the Figma UI logic
const brands = {
  car: ['Honda', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Toyota', 'Kia', 'MG', 'Volkswagen'],
  bike: ['Hero', 'Honda', 'Bajaj', 'Royal Enfield', 'TVS', 'Yamaha', 'KTM'],
  scooty: ['Honda', 'TVS', 'Hero', 'Yamaha', 'Suzuki'],
  ev: ['Tata', 'Hyundai', 'MG', 'Ola', 'Ather', 'Bounce'],
};

const fuels = {
  car: ['Petrol', 'Diesel', 'CNG', 'Electric'],
  bike: ['Petrol'],
  scooty: ['Petrol'],
  ev: ['Electric'],
};

const vehicleTypes = [
  { id: 'car', label: 'Car', emoji: '🚗' },
  { id: 'bike', label: 'Bike', emoji: '🏍️' },
  { id: 'scooty', label: 'Scooty', emoji: '🛵' },
  { id: 'ev', label: 'EV', emoji: '⚡' },
];

const docEntries = [
  {
    key: 'puc',
    label: 'PUC Certificate',
    emoji: '🟢',
    connectLabel: 'Connect Parivahan',
    color: '#22C55E',
    bg: '#F0FDF4',
    fields: ['PUC Number', 'Issue Date', 'Expiry Date', 'Testing Center'],
  },
  {
    key: 'rc',
    label: 'RC Book',
    emoji: '🔵',
    connectLabel: 'Connect DigiLocker',
    color: '#2563EB',
    bg: '#EFF6FF',
    fields: ['Registration No.', 'Registration Date', 'Validity', 'RTO Office'],
  },
  {
    key: 'driving-license',
    label: 'Driving License',
    emoji: '🟣',
    connectLabel: 'Connect DigiLocker',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    fields: ['License Number', 'Issue Date', 'Expiry Date', 'Vehicle Class'],
  },
  {
    key: 'insurance',
    label: 'Insurance Policy',
    emoji: '🟡',
    connectLabel: 'Verify via IIB',
    color: '#F59E0B',
    bg: '#FFFBEB',
    fields: ['Policy Number', 'Insurance Company', 'Policy Type', 'Expiry Date'],
  },
];

// Document Accordion Card Component
function DocCard({ entry, onConnected }) {
  const [expanded, setExpanded] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [manual, setManual] = useState(false);
  const [fieldsState, setFieldsState] = useState({});

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      onConnected(entry.key);
    }, 1500);
  };

  const handleSaveManual = () => {
    setConnected(true);
    onConnected(entry.key);
  };

  return (
    <View style={[styles.docCard, connected ? { borderColor: entry.color + '40' } : null]}>
      {/* Header Row */}
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)} 
        style={styles.docHeader}
        activeOpacity={0.7}
      >
        <View style={[styles.docIconCircle, { backgroundColor: entry.bg }]}>
          <Text style={styles.docEmoji}>{entry.emoji}</Text>
        </View>
        <View style={styles.docTitleBlock}>
          <Text style={styles.docTitle}>{entry.label}</Text>
          <Text style={[styles.docStatus, { color: connected ? entry.color : '#EF4444' }]}>
            {connected ? '✓ Connected' : 'Required — tap to add'}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Expanded Accordion Body */}
      {expanded && (
        <View style={styles.docBody}>
          {connected ? (
            <View style={styles.successRow}>
              <Text style={[styles.successCheckText, { color: entry.color }]}>✓ Connected successfully</Text>
            </View>
          ) : (
            <View style={styles.connectPanel}>
              {!manual ? (
                <View>
                  <TouchableOpacity 
                    onPress={handleConnect} 
                    disabled={connecting}
                    style={[styles.connectButton, { backgroundColor: entry.color }]}
                    activeOpacity={0.85}
                  >
                    {connecting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.connectButtonText}>{entry.connectLabel}</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity 
                    onPress={() => setManual(true)} 
                    style={styles.manualToggle}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.manualToggleText}>Enter Details Manually</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.manualForm}>
                  {entry.fields.map((f) => (
                    <View key={f} style={styles.fieldBox}>
                      <Text style={styles.fieldLabel}>{f}</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder={`e.g. Enter ${f}`}
                        placeholderTextColor="#9CA3AF"
                        value={fieldsState[f] || ''}
                        onChangeText={(text) => setFieldsState(prev => ({ ...prev, [f]: text }))}
                      />
                    </View>
                  ))}
                  <View style={styles.formActions}>
                    <TouchableOpacity onPress={() => setManual(false)} style={styles.formCancel} activeOpacity={0.7}>
                      <Text style={styles.formCancelText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveManual} style={[styles.formSave, { backgroundColor: entry.color }]} activeOpacity={0.8}>
                      <Text style={styles.formSaveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function AddVehicleScreen({ onBack, onSave }) {
  const [number, setNumber] = useState('');
  const [type, setType] = useState('car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [fuel, setFuel] = useState('Petrol');
  const [connectedDocs, setConnectedDocs] = useState(new Set());
  
  // Custom dropdown toggle states
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const handleDocConnected = (key) => {
    setConnectedDocs((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const allDocsConnected = docEntries.every((d) => connectedDocs.has(d.key));
  const isValid = number.trim().length > 3 && brand && model.trim() && allDocsConnected;

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      id: Date.now().toString(),
      name: `${brand} ${model}`,
      number: number.toUpperCase(),
      fuel,
      type,
      status: 'Active',
      brand,
      model,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Add Vehicle</Text>
            <Text style={styles.headerSubtitle}>Register your vehicle & documents</Text>
          </View>
        </View>
      </View>

      {/* Dynamic Preview Strip */}
      <View style={styles.previewStrip}>
        <View style={styles.previewIconBox}>
          <Text style={styles.previewEmoji}>
            {type === 'car' ? '🚗' : type === 'ev' ? '⚡' : type === 'scooty' ? '🛵' : '🏍️'}
          </Text>
        </View>
        <View>
          <Text style={styles.previewName}>{brand && model ? `${brand} ${model}` : 'Your Vehicle'}</Text>
          <Text style={styles.previewNumber}>{number.toUpperCase() || 'Registration Number'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* ── VEHICLE INFO CARD ── */}
        <View style={styles.formCard}>
          <Text style={styles.cardSectionTitle}>Vehicle Details</Text>

          {/* Registration Number */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Vehicle Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. MH-19-AB-1234"
              placeholderTextColor="#9CA3AF"
              value={number}
              onChangeText={setNumber}
              autoCapitalize="characters"
            />
          </View>

          {/* Vehicle Type Grid Selector */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <View style={styles.typeGrid}>
              {vehicleTypes.map((t) => {
                const active = type === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setType(t.id);
                      setBrand('');
                      setFuel(fuels[t.id][0]);
                    }}
                    style={[styles.typeButton, active ? styles.typeButtonActive : null]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.typeEmoji}>{t.emoji}</Text>
                    <Text style={[styles.typeText, active ? styles.typeTextActive : null]}>{t.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Custom Brand Dropdown Box */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Brand *</Text>
            <TouchableOpacity 
              onPress={() => setBrandDropdownOpen(!brandDropdownOpen)}
              style={styles.dropdownTrigger}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownValue, !brand ? styles.dropdownPlaceholder : null]}>
                {brand || 'Select Brand'}
              </Text>
              <Text style={styles.dropdownChevron}>{brandDropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {brandDropdownOpen && (
              <View style={styles.dropdownList}>
                {brands[type].map((b) => (
                  <TouchableOpacity
                    key={b}
                    onPress={() => {
                      setBrand(b);
                      setBrandDropdownOpen(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Model Name */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Model *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. City, Activa, Creta"
              placeholderTextColor="#9CA3AF"
              value={model}
              onChangeText={setModel}
            />
          </View>

          {/* Fuel Selector badges row */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Fuel Type</Text>
            <View style={styles.fuelRow}>
              {fuels[type].map((f) => {
                const active = fuel === f;
                return (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFuel(f)}
                    style={[styles.fuelBadge, active ? styles.fuelBadgeActive : null]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.fuelText, active ? styles.fuelTextActive : null]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── DOCUMENTS UPLOAD CARD ── */}
        <View style={styles.docHeaderRow}>
          <View>
            <Text style={styles.docSectionTitle}>Add Documents</Text>
            <Text style={styles.docSectionSubtitle}>All documents must be connected to proceed</Text>
          </View>
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredBadgeText}>Required</Text>
          </View>
        </View>

        <View style={styles.docsList}>
          {docEntries.map((doc) => (
            <DocCard key={doc.key} entry={doc} onConnected={handleDocConnected} />
          ))}
        </View>

        {/* Save Vehicle Action Button */}
        <TouchableOpacity
          disabled={!isValid}
          onPress={handleSave}
          style={[styles.saveButton, isValid ? styles.saveButtonEnabled : styles.saveButtonDisabled]}
          activeOpacity={0.88}
        >
          <Text style={styles.saveButtonText}>
            {isValid
              ? 'Save Vehicle'
              : !allDocsConnected
              ? `Connect ${docEntries.length - connectedDocs.size} more document${docEntries.length - connectedDocs.size > 1 ? 's' : ''}`
              : 'Fill vehicle details'}
          </Text>
        </TouchableOpacity>
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
    color: 'rgba(219, 234, 254, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  previewStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  previewIconBox: {
    width: 52,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: 22,
  },
  previewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  previewNumber: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  inputBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    color: '#111827',
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  typeEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  typeTextActive: {
    color: '#2563EB',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  dropdownValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownChevron: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 180,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  fuelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fuelBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  fuelBadgeActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  fuelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  fuelTextActive: {
    color: 'white',
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  docSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  docSectionSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  requiredBadge: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  requiredBadgeText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  docsList: {
    gap: 12,
    marginBottom: 24,
  },
  docCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  docIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docEmoji: {
    fontSize: 18,
  },
  docTitleBlock: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  docStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  chevron: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  docBody: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    backgroundColor: 'white',
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successCheckText: {
    fontSize: 13,
    fontWeight: '700',
  },
  connectPanel: {
    paddingTop: 4,
  },
  connectButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  manualToggle: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  manualToggleText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  manualForm: {
    gap: 12,
  },
  fieldBox: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#F8FAFC',
    color: '#1F2937',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  formCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  formCancelText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 13,
  },
  formSave: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSaveText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  saveButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonEnabled: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
