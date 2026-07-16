import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const docConfig = {
  puc: { title: 'PUC Certificate', emoji: '🟢', color: '#22C55E', bg: '#F0FDF4', source: 'Parivahan Sewa' },
  rc: { title: 'RC Book', emoji: '🔵', color: '#2563EB', bg: '#EFF6FF', source: 'DigiLocker' },
  'driving-license': { title: 'Driving License', emoji: '🟣', color: '#8B5CF6', bg: '#F5F3FF', source: 'DigiLocker' },
  insurance: { title: 'Insurance Policy', emoji: '🟡', color: '#F59E0B', bg: '#FFFBEB', source: 'Insurance Bureau (IIB)' },
};

const vehicleData = [
  { id: '1', number: 'MH-19-AB-1234', type: '4 Wheeler', name: 'Honda City' },
  { id: '2', number: 'MH-19-CD-5678', type: '2 Wheeler', name: 'Activa 6G' },
  { id: '3', number: 'MH-19-EF-9012', type: '4 Wheeler', name: 'Hyundai Creta EV' },
];

const docDetails = {
  puc: {
    '1': { fields: [{ l: 'Vehicle Number', v: 'MH-19-AB-1234' }, { l: 'Owner Name', v: 'Rushikesh Patil' }, { l: 'PUC Number', v: 'PUC/2024/MH19/78542' }, { l: 'Issue Date', v: 'Jan 15, 2025' }, { l: 'Expiry Date', v: 'Dec 31, 2025' }, { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }], status: 'Valid', note: 'Valid until 31 December 2025', expiry: 'Dec 31, 2025' },
    '2': { fields: [{ l: 'Vehicle Number', v: 'MH-19-CD-5678' }, { l: 'Owner Name', v: 'Rushikesh Patil' }, { l: 'PUC Number', v: 'PUC/2023/MH19/45231' }, { l: 'Issue Date', v: 'Jan 10, 2024' }, { l: 'Expiry Date', v: 'Jan 10, 2025' }, { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }], status: 'Expired', note: 'Expired on 10 January 2025', expiry: 'Jan 10, 2025' },
    '3': { fields: [{ l: 'Vehicle Number', v: 'MH-19-EF-9012' }, { l: 'Owner Name', v: 'Rushikesh Patil' }, { l: 'PUC Number', v: 'PUC/2025/MH19/99871' }, { l: 'Issue Date', v: 'Feb 28, 2025' }, { l: 'Expiry Date', v: 'Feb 28, 2026' }, { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }], status: 'Valid', note: 'Valid until 28 February 2026', expiry: 'Feb 28, 2026' },
  },
  rc: {
    '1': { fields: [{ l: 'Registration No.', v: 'MH-19-AB-1234' }, { l: 'Owner Name', v: 'Rushikesh Patil' }, { l: 'Vehicle Class', v: 'Motor Car (LMV)' }, { l: 'Engine Number', v: 'L15Z3A123456' }, { l: 'Chassis Number', v: 'MHHRH2G5MCN123456' }, { l: 'Reg. Date', v: 'Apr 20, 2022' }, { l: 'Reg. Validity', v: 'Apr 20, 2037' }], status: 'Valid', note: 'Valid until 20 April 2037', expiry: 'Apr 20, 2037' },
    '2': { fields: [{ l: 'Registration No.', v: 'MH-19-CD-5678' }, { l: 'Owner Name', v: 'Rushikesh Patil' }, { l: 'Vehicle Class', v: 'Scooter (MCWG)' }, { l: 'Engine Number', v: 'JF50E8123456' }, { l: 'Chassis Number', v: 'ME4JF503MC8123456' }, { l: 'Reg. Date', v: 'Mar 10, 2021' }, { l: 'Reg. Validity', v: 'Mar 10, 2036' }], status: 'Valid', note: 'Valid until 10 March 2036', expiry: 'Mar 10, 2036' },
    '3': { fields: [{ l: 'Registration No.', v: 'MH-19-EF-9012' }, { l: 'Owner Name', v: 'Rushikesh Patil' }, { l: 'Vehicle Class', v: 'Motor Car (EV)' }, { l: 'Engine Number', v: 'EVHCN123456' }, { l: 'Chassis Number', v: 'MALE2BKA1PC123456' }, { l: 'Reg. Date', v: 'Jun 15, 2023' }, { l: 'Reg. Validity', v: 'Jun 15, 2038' }], status: 'Valid', note: 'Valid until 15 June 2038', expiry: 'Jun 15, 2038' },
  },
  'driving-license': {
    '1': { fields: [{ l: 'License Number', v: 'MH1920220012345' }, { l: 'Holder Name', v: 'Rushikesh Patil' }, { l: 'Date of Birth', v: 'Sep 12, 1998' }, { l: 'Issue Date', v: 'Sep 12, 2022' }, { l: 'Expiry Date', v: 'Sep 11, 2040' }, { l: 'Vehicle Class', v: 'MC, LMV' }], status: 'Valid', note: 'Valid until 11 September 2040', expiry: 'Sep 11, 2040' },
    '2': { fields: [{ l: 'License Number', v: 'MH1920220012345' }, { l: 'Holder Name', v: 'Rushikesh Patil' }, { l: 'Date of Birth', v: 'Sep 12, 1998' }, { l: 'Issue Date', v: 'Sep 12, 2022' }, { l: 'Expiry Date', v: 'Sep 11, 2040' }, { l: 'Vehicle Class', v: 'MC, LMV' }], status: 'Valid', note: 'Valid until 11 September 2040', expiry: 'Sep 11, 2040' },
    '3': { fields: [{ l: 'License Number', v: 'MH1920220012345' }, { l: 'Holder Name', v: 'Rushikesh Patil' }, { l: 'Date of Birth', v: 'Sep 12, 1998' }, { l: 'Issue Date', v: 'Sep 12, 2022' }, { l: 'Expiry Date', v: 'Sep 11, 2040' }, { l: 'Vehicle Class', v: 'MC, LMV' }], status: 'Valid', note: 'Valid until 11 September 2040', expiry: 'Sep 11, 2040' },
  },
  insurance: {
    '1': { fields: [{ l: 'Policy Number', v: 'OD/2024/MH/00123456' }, { l: 'Insurer Company', v: 'Bajaj Allianz General' }, { l: 'Policy Type', v: 'Comprehensive' }, { l: 'Issue Date', v: 'Jun 25, 2025' }, { l: 'Expiry Date', v: 'Jun 25, 2026' }, { l: 'Coverage IDV', v: '₹8,00,000' }], status: 'Expiring Soon', note: 'Expires in 7 days', expiry: 'Jun 25, 2026' },
    '2': { fields: [{ l: 'Policy Number', v: 'OD/2024/MH/00987654' }, { l: 'Insurer Company', v: 'HDFC ERGO General' }, { l: 'Policy Type', v: 'Third Party' }, { l: 'Issue Date', v: 'Nov 30, 2025' }, { l: 'Expiry Date', v: 'Nov 30, 2026' }, { l: 'Coverage IDV', v: '₹2,00,000' }], status: 'Valid', note: 'Valid until 30 November 2026', expiry: 'Nov 30, 2026' },
    '3': { fields: [{ l: 'Policy Number', v: 'OD/2025/MH/00456789' }, { l: 'Insurer Company', v: 'Tata AIG General' }, { l: 'Policy Type', v: 'Comprehensive (EV)' }, { l: 'Issue Date', v: 'Mar 15, 2026' }, { l: 'Expiry Date', v: 'Mar 15, 2027' }, { l: 'Coverage IDV', v: '₹12,00,000' }], status: 'Valid', note: 'Valid until 15 March 2027', expiry: 'Mar 15, 2027' },
  },
};

export default function DocumentDetailScreen({ docType, vehicleId = '1', onBack }) {
  const cfg = docConfig[docType] || docConfig.puc;
  const vehicle = vehicleData.find((v) => v.id === vehicleId) || vehicleData[0];
  const detail = docDetails[docType]?.[vehicle.id] || docDetails[docType]?.[1];

  const isExp = detail.status === 'Expired';
  const isSoon = detail.status === 'Expiring Soon';

  return (
    <View style={styles.container}>
      {/* Header with matching document colored background */}
      <View style={[styles.header, { backgroundColor: cfg.color }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.docHeaderTitleRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>{cfg.emoji}</Text>
            </View>
            <Text style={styles.headerTitle}>{cfg.title}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Selected Vehicle Info Banner */}
        <View style={styles.vehicleStrip}>
          <View style={styles.vehicleGraphicBox}>
            <Text style={styles.vehicleEmoji}>
              {vehicle.type === '2 Wheeler' ? '🛵' : '🚗'}
            </Text>
          </View>
          <View>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleNumber}>{vehicle.number} · {vehicle.type}</Text>
          </View>
        </View>

        {/* Status Alert Widget */}
        <View style={[
          styles.alertCard,
          { 
            backgroundColor: isExp ? '#FEF2F2' : isSoon ? '#FFFBEB' : '#F0FDF4',
            borderColor: isExp ? '#FECACA' : isSoon ? '#FDE68A' : '#BBF7D0'
          }
        ]}>
          <View style={[styles.alertDot, { backgroundColor: isExp ? '#EF4444' : isSoon ? '#F59E0B' : '#22C55E' }]} />
          <View>
            <Text style={[styles.alertLabel, { color: isExp ? '#EF4444' : isSoon ? '#D97706' : '#16A34A' }]}>
              {detail.status}
            </Text>
            <Text style={[styles.alertNote, { color: isExp ? '#EF4444' : isSoon ? '#D97706' : '#16A34A' }]}>
              {detail.note}
            </Text>
          </View>
        </View>

        {/* Document Details Key-Value Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Document details</Text>
            <View style={[styles.expiryBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.expiryBadgeText, { color: cfg.color }]}>Exp: {detail.expiry}</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            {detail.fields.map((f, i) => (
              <View key={f.l} style={[styles.fieldRow, i < detail.fields.length - 1 ? styles.borderBottom : null]}>
                <Text style={styles.fieldLabel}>{f.l}</Text>
                <Text style={styles.fieldValue}>{f.v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Verification Check Badge */}
        <View style={styles.verifiedBox}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.verifiedText}>Verified via {cfg.source}</Text>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Actions ── */}
      <View style={styles.actionsPanel}>
        <View style={styles.buttonsRow}>
          {/* Download */}
          <TouchableOpacity style={[styles.actionButton, styles.downloadButton]} activeOpacity={0.7}>
            <Text style={styles.actionEmoji}>📥</Text>
            <Text style={styles.downloadText}>Download PDF</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={[styles.actionButton, styles.shareButton]} activeOpacity={0.7}>
            <Text style={styles.actionEmoji}>✉️</Text>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>

          {/* View Full */}
          <TouchableOpacity style={[styles.actionButton, styles.viewFullButton]} activeOpacity={0.7}>
            <Text style={styles.actionEmoji}>👁️</Text>
            <Text style={styles.viewFullText}>View Full</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.syncTimestampText}>
          Last synced · 25 Jun 2026 via {cfg.source}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  docHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  vehicleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  vehicleGraphicBox: {
    width: 44,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleEmoji: {
    fontSize: 20,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleNumber: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alertLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  alertNote: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFC',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  expiryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  expiryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  fieldsContainer: {
    paddingHorizontal: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: '65%',
  },
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 14,
  },
  verifiedText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
  },
  actionsPanel: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  actionEmoji: {
    fontSize: 18,
  },
  downloadButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  downloadText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
  },
  shareButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  shareText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
  },
  viewFullButton: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  viewFullText: {
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: '700',
  },
  syncTimestampText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
});
