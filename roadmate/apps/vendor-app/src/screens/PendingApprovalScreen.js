import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useVendorProfile } from '../context/VendorProfileContext';
import { validateBusinessDescription, validatePricing } from '../services/vendorProfileService';
import { getCategoryById } from '../services/vendorCategoryService';
import VerificationBadge from '../components/VerificationBadge';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import DocumentUploadCard from '../components/DocumentUploadCard';
import ImageUploadCard from '../components/ImageUploadCard';
import BusinessGallery from '../components/BusinessGallery';

const { width } = Dimensions.get('window');

export default function PendingApprovalScreen({ route, navigation }) {
  const { profile, updateProfile, getCompletionPercentage, getMissingFields, simulateAdminApproval } = useVendorProfile();

  const params = route.params || {};
  const [showOnboarding, setShowOnboarding] = useState(params.showOnboarding !== false && (!profile || profile.verificationStatus === 'Pending Verification'));

  // Local form states (populated from profile context if exists)
  const [businessName, setBusinessName] = useState(profile?.businessName || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || 'Jalgaon');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [pinCode, setPinCode] = useState(profile?.pinCode || '');
  const [experience, setExperience] = useState(profile?.yearsOfExperience || '1');
  const [description, setDescription] = useState(profile?.businessDescription || '');
  const [subCategory, setSubCategory] = useState(profile?.subcategory || '');
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);

  // Pricing states
  const [startingPrice, setStartingPrice] = useState(profile?.startingPrice || '');
  const [inspectionCharges, setInspectionCharges] = useState(profile?.inspectionCharges || '');
  const [visitingCharges, setVisitingCharges] = useState(profile?.visitingCharges || '');
  const [emergencyCharges, setEmergencyCharges] = useState(profile?.emergencyCharges || '');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [subSearch, setSubSearch] = useState('');
  const categoryObj = getCategoryById(profile?.mainCategory || 'Garage');
  const fullSubcategories = categoryObj ? categoryObj.subcategories : [];
  const subcategoriesList = fullSubcategories.filter((sc) =>
    sc.toLowerCase().includes(subSearch.toLowerCase())
  );

  // Update profile context when form state changes locally (optional/auto-saves or saves on submit)
  const allDocs = profile?.documents || {};
  const allMandatoryDocsUploaded =
    !!allDocs.businessRegistration &&
    !!allDocs.udyamRegistration &&
    !!allDocs.shopActLicense &&
    !!allDocs.businessPan &&
    !!allDocs.governmentId;

  const isFormValid =
    businessName.trim().length > 2 &&
    address.trim().length > 5 &&
    pinCode.trim().length === 6 &&
    description.trim().length >= 50 &&
    subCategory &&
    allMandatoryDocsUploaded &&
    !!profile?.logo &&
    !!profile?.coverImage &&
    !!profile?.ownerPhoto;

  const handleSubmitProfile = () => {
    setError('');

    // Validations
    const descErr = validateBusinessDescription(description);
    if (descErr) return setError(descErr);

    if (pinCode.trim().length !== 6 || isNaN(Number(pinCode))) {
      return setError('PIN Code must be a valid 6-digit number.');
    }

    setSaving(true);
    setTimeout(() => {
      updateProfile({
        businessName: businessName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        yearsOfExperience: experience.trim(),
        businessDescription: description.trim(),
        subcategory: subCategory,
        verificationStatus: 'Pending Verification',
      });
      setSaving(false);
      setShowOnboarding(false);
    }, 1000);
  };

  const handleSimulateApproval = () => {
    simulateAdminApproval();
    // Redirect to main app dashboard
    navigation.replace('Main');
  };

  const completionPercent = getCompletionPercentage();
  const missingInfo = getMissingFields();

  // ── ONBOARDING PROFILE FORM VIEW ──
  if (showOnboarding) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Complete Shop Profile</Text>
          <Text style={styles.headerSubtitle}>Enter business details & official documents</Text>
        </View>

        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          {/* Profile Completion Indicator */}
          <ProfileCompletionCard
            percentage={completionPercent}
            missingFields={missingInfo}
            onAction={(field) => {
              // Focus helper / guidance placeholder
            }}
          />

          {/* Shop Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Shop Details</Text>
            
            <View style={styles.inputBox}>
              <Text style={styles.label}>Business Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Speed Auto Workshop"
                placeholderTextColor="#9CA3AF"
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Main Category</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledInputText}>{profile?.mainCategory || 'Garage'}</Text>
                </View>
              </View>

              {/* Business Subcategory Dropdown */}
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Subcategory *</Text>
                <TouchableOpacity 
                  onPress={() => setSubDropdownOpen(!subDropdownOpen)}
                  style={styles.dropdownTrigger}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownValue, !subCategory ? styles.dropdownPlaceholder : null]}>
                    {subCategory || 'Select Sub'}
                  </Text>
                  <Text style={styles.dropdownChevron}>{subDropdownOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {subDropdownOpen && (
                  <View style={styles.dropdownList}>
                    <TextInput
                      style={styles.subSearchInput}
                      placeholder="Search sub..."
                      placeholderTextColor="#9CA3AF"
                      value={subSearch}
                      onChangeText={setSubSearch}
                    />
                    {subcategoriesList.map((sc) => (
                      <TouchableOpacity
                        key={sc}
                        onPress={() => {
                          setSubCategory(sc);
                          setSubDropdownOpen(false);
                          setSubSearch('');
                          updateProfile({ subcategory: sc });
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{sc}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Experience (Years) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={2}
                  value={experience}
                  onChangeText={(t) => setExperience(t.replace(/[^0-9]/g, ''))}
                />
              </View>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>PIN Code *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 425001"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={6}
                  value={pinCode}
                  onChangeText={(t) => setPinCode(t.replace(/[^0-9]/g, ''))}
                />
              </View>
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>Shop Address *</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Enter complete workshop address"
                placeholderTextColor="#9CA3AF"
                multiline
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>

            {/* Business Description */}
            <View style={styles.inputBox}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>About Business *</Text>
                <Text style={[styles.counter, description.length < 50 ? styles.counterError : null]}>
                  {description.length}/1000
                </Text>
              </View>
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder='e.g. "We provide complete two-wheeler servicing, engine repair, washing, insurance assistance..."'
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  updateProfile({ businessDescription: text });
                }}
              />
            </View>
          </View>

          {/* Business Pricing Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Business Base Pricing</Text>
            <Text style={styles.cardSubtitle}>Configure base rates for services and visits</Text>

            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Starting Price *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 199"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={startingPrice}
                  onChangeText={setStartingPrice}
                />
              </View>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Inspection Fee *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 99"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={inspectionCharges}
                  onChangeText={setInspectionCharges}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Visiting Fee (Opt)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 149"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={visitingCharges}
                  onChangeText={setVisitingCharges}
                />
              </View>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Emergency Fee (Opt)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 299"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={emergencyCharges}
                  onChangeText={setEmergencyCharges}
                />
              </View>
            </View>
          </View>

          {/* Profile Media Cards */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Profile Photos</Text>
            <Text style={styles.cardSubtitle}>Images are displayed to customers immediately</Text>

            <ImageUploadCard
              label="Business Logo (Square) *"
              imageUri={profile?.logo}
              onUploadSuccess={(url) => updateProfile({ logo: url })}
              onDelete={() => updateProfile({ logo: '' })}
            />

            <ImageUploadCard
              label="Owner Photo (Portrait) *"
              imageUri={profile?.ownerPhoto}
              onUploadSuccess={(url) => updateProfile({ ownerPhoto: url })}
              onDelete={() => updateProfile({ ownerPhoto: '' })}
            />

            <ImageUploadCard
              label="Business Cover Banner *"
              imageUri={profile?.coverImage}
              onUploadSuccess={(url) => updateProfile({ coverImage: url })}
              onDelete={() => updateProfile({ coverImage: '' })}
            />

            {/* Gallery Section */}
            <BusinessGallery
              galleryUrls={profile?.gallery || []}
              onAddImage={(url) => updateProfile({ gallery: [...(profile?.gallery || []), url] })}
              onRemoveImage={(idx) => {
                const nextG = [...(profile?.gallery || [])];
                nextG.splice(idx, 1);
                updateProfile({ gallery: nextG });
              }}
            />
          </View>

          {/* Document Uploads Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Legal Documents Vault</Text>
            <Text style={styles.cardSubtitle}>All required documents are mandatory for verification</Text>

            <DocumentUploadCard
              label="Business Registration Certificate *"
              docName={profile?.documents.businessRegistration}
              onUploadSuccess={(file) => updateProfile({ documents: { ...allDocs, businessRegistration: file } })}
              onDelete={() => {
                const copy = { ...allDocs };
                delete copy.businessRegistration;
                updateProfile({ documents: copy });
              }}
            />

            <DocumentUploadCard
              label="Udyam Registration Certificate *"
              docName={profile?.documents.udyamRegistration}
              onUploadSuccess={(file) => updateProfile({ documents: { ...allDocs, udyamRegistration: file } })}
              onDelete={() => {
                const copy = { ...allDocs };
                delete copy.udyamRegistration;
                updateProfile({ documents: copy });
              }}
            />

            <DocumentUploadCard
              label="Shop Act License *"
              docName={profile?.documents.shopActLicense}
              onUploadSuccess={(file) => updateProfile({ documents: { ...allDocs, shopActLicense: file } })}
              onDelete={() => {
                const copy = { ...allDocs };
                delete copy.shopActLicense;
                updateProfile({ documents: copy });
              }}
            />

            <DocumentUploadCard
              label="Business PAN Card *"
              docName={profile?.documents.businessPan}
              onUploadSuccess={(file) => updateProfile({ documents: { ...allDocs, businessPan: file } })}
              onDelete={() => {
                const copy = { ...allDocs };
                delete copy.businessPan;
                updateProfile({ documents: copy });
              }}
            />

            <DocumentUploadCard
              label="Government ID Proof (Aadhaar/DL) *"
              docName={profile?.documents.governmentId}
              onUploadSuccess={(file) => updateProfile({ documents: { ...allDocs, governmentId: file } })}
              onDelete={() => {
                const copy = { ...allDocs };
                delete copy.governmentId;
                updateProfile({ documents: copy });
              }}
            />

            <DocumentUploadCard
              label="GST Registration Certificate"
              docName={profile?.documents.gstCertificate}
              onUploadSuccess={(file) => updateProfile({ documents: { ...allDocs, gstCertificate: file } })}
              onDelete={() => {
                const copy = { ...allDocs };
                delete copy.gstCertificate;
                updateProfile({ documents: copy });
              }}
              optional
            />
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {/* Submit Profile */}
          <TouchableOpacity
            disabled={!isFormValid || saving}
            onPress={handleSubmitProfile}
            style={[styles.submitButton, isFormValid ? styles.submitButtonEnabled : styles.submitButtonDisabled]}
            activeOpacity={0.88}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── PENDING APPROVAL / REVIEW STATE VIEW ──
  return (
    <View style={styles.reviewContainer}>
      {/* Simulation Banner */}
      <TouchableOpacity 
        onPress={handleSimulateApproval} 
        style={styles.simulationBanner} 
        activeOpacity={0.8}
      >
        <Text style={styles.simulationText}>💡 SIMULATE ADMIN APPROVAL ✓</Text>
      </TouchableOpacity>

      <View style={styles.hourglassWrapper}>
        <Text style={styles.hourglassEmoji}>⌛</Text>
      </View>

      <Text style={styles.reviewTitle}>Application Under Review</Text>
      <Text style={styles.reviewSubtitle}>
        Your shop profile is being verified by Roadmate Administrators. We will notify you via email shortly.
      </Text>

      {/* Profile Details Snapshot */}
      <View style={styles.snapshotCard}>
        <Text style={styles.snapshotSection}>APPLICATION SNAPSHOT</Text>
        <View style={styles.snapshotLine}>
          <Text style={styles.snapLabel}>Business Name:</Text>
          <Text style={styles.snapValue}>{profile?.businessName || 'Roadmate Garage'}</Text>
        </View>
        <View style={styles.snapshotLine}>
          <Text style={styles.snapLabel}>Owner Name:</Text>
          <Text style={styles.snapValue}>{profile?.ownerName || 'Rushikesh Patil'}</Text>
        </View>
        <View style={styles.snapshotLine}>
          <Text style={styles.snapLabel}>Shop Category:</Text>
          <Text style={styles.snapValue}>{profile?.mainCategory || 'Garage'}</Text>
        </View>
        <View style={styles.snapshotLine}>
          <Text style={styles.snapLabel}>Status:</Text>
          <VerificationBadge status={profile?.verificationStatus || 'Pending Verification'} />
        </View>
      </View>

      {/* Expand Vault Section to let them manage docs even when review is pending */}
      <TouchableOpacity 
        onPress={() => setShowOnboarding(true)} 
        style={styles.vaultTriggerBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.vaultTriggerText}>📁 View / Edit Uploaded Vault Documents</Text>
      </TouchableOpacity>

      <Text style={styles.supportLabelHint}>
        Need help? Contact partner-support@roadmate.in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 4,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: -8,
    marginBottom: 14,
  },
  inputBox: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  counter: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  counterError: {
    color: '#DC2626',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    fontSize: 13,
    color: '#111827',
  },
  disabledInput: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
  },
  disabledInputText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  dropdownValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownChevron: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 120,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  errorBanner: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  submitButtonEnabled: {
    backgroundColor: '#1E3A8A',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── REVIEW STATE VIEWS CLASSES ──
  reviewContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  simulationBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  simulationText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  hourglassWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  hourglassEmoji: {
    fontSize: 42,
  },
  reviewTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  reviewSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  snapshotCard: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  snapshotSection: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  snapshotLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  snapLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  snapValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '750',
  },
  vaultTriggerBtn: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  vaultTriggerText: {
    fontSize: 12.5,
    color: '#374151',
    fontWeight: '800',
  },
  supportLabelHint: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  subSearchInput: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
});
