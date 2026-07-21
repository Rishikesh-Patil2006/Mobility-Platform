// roadmate/apps/customer-app/src/components/VehicleInsightsComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── STATUS CHIP ──
export const StatusChip = React.memo(function StatusChip({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Active':
      case 'Paid':
      case 'Valid':
      case 'Excellent':
        return { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' };
      case 'Busy':
      case 'Expiring Soon':
      case 'Needs Attention':
        return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
      case 'Expired':
      case 'Pending':
      case 'Unavailable':
      case 'Critical':
        return { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
      default:
        return { color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' };
    }
  };

  const cStyles = getStyles();

  return (
    <View style={[styles.statusChip, { backgroundColor: cStyles.bg, borderColor: cStyles.border }]}>
      <View style={[styles.statusChipDot, { backgroundColor: cStyles.color }]} />
      <Text style={[styles.statusChipText, { color: cStyles.color }]}>{status}</Text>
    </View>
  );
});

// ── VEHICLE SUMMARY CARD ──
export const VehicleSummaryCard = React.memo(function VehicleSummaryCard({ vehicle }) {
  if (!vehicle) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Basic Specifications</Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Year of Mfg</Text>
          <Text style={styles.gridVal}>{vehicle.mfgYear || '2022'}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Transmission</Text>
          <Text style={styles.gridVal}>{vehicle.transmission || 'Manual'}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Fuel Type</Text>
          <Text style={styles.gridVal}>{vehicle.fuelType}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Vehicle Age</Text>
          <Text style={styles.gridVal}>{vehicle.age}</Text>
        </View>
      </View>
    </View>
  );
});

// ── VEHICLE INFO CARD ──
export const VehicleInfoCard = React.memo(function VehicleInfoCard({ info }) {
  if (!info) return null;

  const rows = [
    { label: 'Owner Name', value: info.ownerName },
    { label: 'Registration Date', value: info.regDate },
    { label: 'Vehicle Class', value: info.vehicleClass },
    { label: 'Vehicle Category', value: info.vehicleCategory },
    { label: 'Engine Number', value: info.engineNumber, isMasked: true },
    { label: 'Chassis Number', value: info.chassisNumber, isMasked: true },
    { label: 'Color', value: info.color },
    { label: 'Seating Capacity', value: info.seatingCapacity },
    { label: 'Insurance Provider', value: info.insuranceCompany },
    { label: 'Policy Expiry Date', value: info.policyExpiry },
    { label: 'RC Expiry Date', value: info.rcExpiry },
    { label: 'PUC Expiry Date', value: info.pucExpiry },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>VAHAN Registration Details</Text>
      <View style={styles.infoList}>
        {rows.map((row, index) => (
          <View key={index} style={[styles.infoRow, index < rows.length - 1 ? styles.borderBottom : null]}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={[styles.infoValue, row.isMasked ? styles.maskedText : null]}>
              {row.value || 'N/A'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// ── CHALLAN SUMMARY CARD ──
export const ChallanSummaryCard = React.memo(function ChallanSummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Challan Statistics Summary</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{summary.total}</Text>
          <Text style={styles.statLabel}>Total Challans</Text>
        </View>
        <View style={[styles.statBox, styles.borderLeft]}>
          <Text style={[styles.statNum, { color: summary.pending > 0 ? '#EF4444' : '#111827' }]}>
            {summary.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, styles.borderLeft]}>
          <Text style={styles.statNum}>{summary.paid}</Text>
          <Text style={styles.statLabel}>Paid</Text>
        </View>
      </View>

      <View style={styles.fineBox}>
        <View style={styles.fineRow}>
          <Text style={styles.fineLabel}>Outstanding Fine Amount</Text>
          <Text style={styles.fineVal}>₹{summary.pendingFine}</Text>
        </View>
        <View style={styles.fineRow}>
          <Text style={styles.fineLabelSecond}>Latest Challan Date</Text>
          <Text style={styles.fineValSecond}>{summary.latestDate}</Text>
        </View>
      </View>
    </View>
  );
});

// ── CHALLAN HISTORY CARD ──
export const ChallanHistoryCard = React.memo(function ChallanHistoryCard({ challan, onViewDetails }) {
  if (!challan) return null;

  return (
    <View style={styles.challanCard}>
      <View style={styles.challanHeader}>
        <View style={styles.challanTitleBlock}>
          <Text style={styles.challanViolation}>{challan.violation}</Text>
          <Text style={styles.challanDate}>{challan.date}</Text>
        </View>
        <StatusChip status={challan.status} />
      </View>

      <Text style={styles.challanLocation} numberOfLines={1}>📍 {challan.location}</Text>
      
      <View style={styles.challanFooter}>
        <Text style={styles.challanAmount}>₹{challan.amount}</Text>
        <TouchableOpacity 
          style={styles.detailsBtn} 
          onPress={() => onViewDetails(challan)}
          activeOpacity={0.7}
        >
          <Text style={styles.detailsBtnText}>View Details ❯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ── VEHICLE HEALTH CARD ──
export const VehicleHealthCard = React.memo(function VehicleHealthCard({ vehicle, challansCount }) {
  if (!vehicle) return null;

  const score = vehicle.healthScore || 90;

  // Determine health color
  const getScoreColor = (sc) => {
    if (sc >= 85) return '#10B981';
    if (sc >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(score);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Vehicle Health Index</Text>
      
      <View style={styles.healthRow}>
        <View style={styles.scoreCircleWrapper}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}%</Text>
            <Text style={styles.scoreSub}>Score</Text>
          </View>
        </View>

        <View style={styles.healthDetails}>
          <Text style={styles.healthRatingText}>
            Status: <Text style={{ fontWeight: '800', color: scoreColor }}>{vehicle.overallHealth}</Text>
          </Text>
          
          <View style={styles.healthChecksList}>
            <View style={styles.healthCheckItem}>
              <Text style={styles.checkBullet}>●</Text>
              <Text style={styles.checkText}>
                RC Status: <Text style={styles.checkHighlight}>{vehicle.rcStatus}</Text>
              </Text>
            </View>
            <View style={styles.healthCheckItem}>
              <Text style={styles.checkBullet}>●</Text>
              <Text style={styles.checkText}>
                Insurance: <Text style={styles.checkHighlight}>{vehicle.insuranceStatus}</Text>
              </Text>
            </View>
            <View style={styles.healthCheckItem}>
              <Text style={styles.checkBullet}>●</Text>
              <Text style={styles.checkText}>
                PUC Status: <Text style={styles.checkHighlight}>{vehicle.pucStatus}</Text>
              </Text>
            </View>
            <View style={styles.healthCheckItem}>
              <Text style={styles.checkBullet}>●</Text>
              <Text style={styles.checkText}>
                Pending Challans: <Text style={[styles.checkHighlight, { color: challansCount > 0 ? '#EF4444' : '#16A34A' }]}>{challansCount}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '850',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: (width - 74) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  gridLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  gridVal: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '800',
    marginTop: 4,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '800',
    textAlign: 'right',
  },
  maskedText: {
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  fineBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  fineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fineLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  fineVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EF4444',
  },
  fineLabelSecond: {
    fontSize: 11,
    fontWeight: '650',
    color: '#64748B',
  },
  fineValSecond: {
    fontSize: 11,
    fontWeight: '750',
    color: '#1E293B',
  },
  challanCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
  },
  challanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  challanTitleBlock: {
    flex: 1,
    paddingRight: 10,
  },
  challanViolation: {
    fontSize: 14,
    fontWeight: '850',
    color: '#1E293B',
  },
  challanDate: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '650',
    marginTop: 2,
  },
  challanLocation: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
  },
  challanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  challanAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#EF4444',
  },
  detailsBtn: {
    paddingVertical: 4,
  },
  detailsBtnText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '800',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 6,
  },
  scoreCircleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '900',
  },
  scoreSub: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  healthDetails: {
    flex: 1,
  },
  healthRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  healthChecksList: {
    gap: 4,
  },
  healthCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkBullet: {
    fontSize: 8,
    color: '#CBD5E1',
  },
  checkText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  checkHighlight: {
    fontWeight: '800',
    color: '#1E293B',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  statusChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
