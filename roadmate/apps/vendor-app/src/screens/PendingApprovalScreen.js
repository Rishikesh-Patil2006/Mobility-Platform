import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const documentTypes = [
  { key: 'aadhaar_front', label: 'Aadhaar Card (Front)' },
  { key: 'aadhaar_back', label: 'Aadhaar Card (Back)' },
  { key: 'pan', label: 'PAN Card' },
  { key: 'gst', label: 'GST Certificate' },
  { key: 'license', label: 'Shop Act License' },
];

export default function PendingApprovalScreen({ route, navigation }) {
  const params = route.params || {};
  const { email = '', name = '', mobile = '', category = '' } = params;

  // Onboarding states
  const [showOnboarding, setShowOnboarding] = useState(params.showOnboarding !== false);
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jalgaon');
  const [state, setState] = useState('Maharashtra');
  const [about, setAbout] = useState('');
  const [services, setServices] = useState('');
  
  // Document Upload Mock states
  const [uploadedDocs, setUploadedDocs] = useState(new Set());
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleUpload = (key) => {
    setUploadingDoc(key);
    setTimeout(() => {
      setUploadedDocs((prev) => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });
      setUploadingDoc(null);
    }, 1200);
  };

  const allDocsUploaded = documentTypes.every((d) => uploadedDocs.has(d.key));
  const isFormValid = shopName.trim().length > 3 && address.trim().length > 5 && allDocsUploaded;

  const handleSubmitProfile = () => {
    if (!isFormValid) return;
    setShowOnboarding(false);
  };

  const handleSimulateApproval = () => {
    navigation.replace('Main');
  };

  // ── ONBOARDING PROFILE FORM VIEW ──
  if (showOnboarding) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Complete Shop Profile</Text>
          <Text style={styles.headerSubtitle}>Enter business details & official documents</Text>
        </View>

        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          
          {/* Shop Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Shop Details</Text>
            
            <View style={styles.inputBox}>
              <Text style={styles.label}>Shop Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Speed Auto Workshop"
                placeholderTextColor="#9CA3AF"
                value={shopName}
                onChangeText={setShopName}
              />
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

            <View style={styles.inputBox}>
              <Text style={styles.label}>About Business</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Describe your services, specialities, etc."
                placeholderTextColor="#9CA3AF"
                multiline
                value={about}
                onChangeText={setAbout}
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>Services Offered (Comma Separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Wheel Alignment, AC Repair, Body Paint"
                placeholderTextColor="#9CA3AF"
                value={services}
                onChangeText={setServices}
              />
            </View>
          </View>

          {/* Document Uploads Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Upload Legal Documents</Text>
            <Text style={styles.cardSubtitle}>All documents are mandatory for verification</Text>
            
            <View style={styles.docList}>
              {documentTypes.map((doc) => {
                const uploaded = uploadedDocs.has(doc.key);
                const loading = uploadingDoc === doc.key;
                return (
                  <View key={doc.key} style={styles.docRow}>
                    <View style={styles.docInfo}>
                      <Text style={styles.docEmoji}>{uploaded ? '✅' : '📄'}</Text>
                      <Text style={[styles.docLabel, uploaded ? styles.docLabelUploaded : null]}>
                        {doc.label}
                      </Text>
                    </View>

                    <TouchableOpacity
                      disabled={uploaded || loading}
                      onPress={() => handleUpload(doc.key)}
                      style={[styles.uploadButton, uploaded ? styles.uploadButtonSuccess : null]}
                      activeOpacity={0.7}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#2563EB" />
                      ) : (
                        <Text style={[styles.uploadButtonText, uploaded ? styles.uploadButtonTextSuccess : null]}>
                          {uploaded ? '✓ Saved' : 'Upload'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Submit Profile */}
          <TouchableOpacity
            disabled={!isFormValid}
            onPress={handleSubmitProfile}
            style={[styles.submitButton, isFormValid ? styles.submitButtonEnabled : styles.submitButtonDisabled]}
            activeOpacity={0.88}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
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
          <Text style={styles.snapLabel}>Owner Name:</Text>
          <Text style={styles.snapValue}>{name || 'Rushikesh Patil'}</Text>
        </View>
        <View style={styles.snapshotLine}>
          <Text style={styles.snapLabel}>Shop Category:</Text>
          <Text style={styles.snapValue}>{category || 'Garage'}</Text>
        </View>
        <View style={styles.snapshotLine}>
          <Text style={styles.snapLabel}>Status:</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Pending Review</Text>
          </View>
        </View>
      </View>

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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  docList: {
    gap: 10,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docEmoji: {
    fontSize: 16,
  },
  docLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  docLabelUploaded: {
    color: '#16A34A',
    fontWeight: '700',
  },
  uploadButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  uploadButtonSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  uploadButtonText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  uploadButtonTextSuccess: {
    color: '#16A34A',
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
    marginBottom: 24,
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
  statusPill: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '800',
  },
  supportLabelHint: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
