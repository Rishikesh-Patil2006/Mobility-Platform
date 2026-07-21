import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Dimensions 
} from 'react-native';
import { VehicleFilterDropdown } from './VehicleComponents';
import { calculateExpiryStatus } from '../utils/vehicleHubUtils';

const { width } = Dimensions.get('window');

// ── 1. VEHICLE HUB HEADER ──
export function VehicleHubHeader({ title = 'Vehicle Hub', selectedFilter, onSelectFilter, onBack }) {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={headerStyles.backBtn} activeOpacity={0.75}>
            <Text style={headerStyles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : null}
        <View style={headerStyles.titleBox}>
          <Text style={headerStyles.title}>{title}</Text>
          <Text style={headerStyles.subtitle}>Central documents & maintenance repository</Text>
        </View>
      </View>
      {selectedFilter !== undefined && onSelectFilter ? (
        <VehicleFilterDropdown 
          selectedOption={selectedFilter} 
          onSelectOption={onSelectFilter} 
          darkTheme={false} 
        />
      ) : null}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#2563EB',
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  backBtn: {
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
  titleBox: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});

// ── 2. VEHICLE HUB SECTION ──
export function VehicleHubSection({ title, subtitle, children, rightAction }) {
  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.headerRow}>
        <View>
          <Text style={sectionStyles.title}>{title}</Text>
          {subtitle ? <Text style={sectionStyles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction}
      </View>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '850',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});

// ── 3. DOCUMENT STATUS CHIP ──
export function DocumentStatusChip({ expiryDate }) {
  const status = calculateExpiryStatus(expiryDate);

  return (
    <View style={[chipStyles.badge, { backgroundColor: status.bg, borderColor: status.border }]}>
      <View style={[chipStyles.dot, { backgroundColor: status.color }]} />
      <Text style={[chipStyles.text, { color: status.color }]}>{status.label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
  },
});

// ── 4. QUICK ACTION BUTTON ──
export function QuickActionButton({ label, icon, onPress, variant = 'secondary' }) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[
        actionBtnStyles.btn,
        isPrimary ? actionBtnStyles.primaryBtn : actionBtnStyles.secondaryBtn
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={actionBtnStyles.icon}>{icon}</Text>
      <Text style={[actionBtnStyles.text, isPrimary ? actionBtnStyles.primaryText : actionBtnStyles.secondaryText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const actionBtnStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
  },
  secondaryBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    fontSize: 13,
  },
  text: {
    fontSize: 11,
    fontWeight: '750',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#475569',
  },
});

// ── 5. VEHICLE DOCUMENT CARD ──
export function VehicleDocumentCard({ document, onViewDetails, onDownload, onShare }) {
  if (!document) return null;

  const getDocIcon = (type) => {
    switch (type) {
      case 'insurance':
        return (
          <View style={[docCardStyles.iconContainer, { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' }]}>
            <Text style={{ fontSize: 20 }}>🛡️</Text>
          </View>
        );
      case 'puc':
        return (
          <View style={[docCardStyles.iconContainer, { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' }]}>
            <Text style={{ fontSize: 20 }}>🍃</Text>
          </View>
        );
      case 'rc':
      default:
        return (
          <View style={[docCardStyles.iconContainer, { backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE' }]}>
            <Text style={{ fontSize: 20 }}>📄</Text>
          </View>
        );
    }
  };

  const handleDownloadPlaceholder = () => {
    if (onDownload) onDownload(document);
    else Alert.alert('Download Document', `Downloading official PDF for ${document.label} (${document.number})...`);
  };

  const handleSharePlaceholder = () => {
    if (onShare) onShare(document);
    else Alert.alert('Share Document', `Generating secure share link for ${document.label}...`);
  };

  return (
    <View style={docCardStyles.card}>
      <View style={docCardStyles.headerRow}>
        <View style={docCardStyles.typeBox}>
          {getDocIcon(document.type)}
          <View>
            <Text style={docCardStyles.label}>{document.label}</Text>
            <Text style={docCardStyles.vehicleName}>
              🚗 {document.vehicleName || 'Vehicle'} • {document.vehicleNumber || document.number}
            </Text>
          </View>
        </View>
        <DocumentStatusChip expiryDate={document.expiry} />
      </View>

      <View style={docCardStyles.detailsGrid}>
        {document.type === 'insurance' && (
          <>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Policy Provider</Text>
              <Text style={docCardStyles.detailValue}>{document.provider || 'N/A'}</Text>
            </View>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Policy Number</Text>
              <Text style={docCardStyles.detailValue}>{document.number}</Text>
            </View>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Coverage Type</Text>
              <Text style={docCardStyles.detailValue}>{document.coverageType || 'Comprehensive'}</Text>
            </View>
          </>
        )}

        {document.type === 'puc' && (
          <>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Certificate Number</Text>
              <Text style={docCardStyles.detailValue}>{document.number}</Text>
            </View>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Issued Date</Text>
              <Text style={docCardStyles.detailValue}>{document.issueDate || '2024-01-15'}</Text>
            </View>
          </>
        )}

        {document.type === 'rc' && (
          <>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Reg Number</Text>
              <Text style={docCardStyles.detailValue}>{document.number}</Text>
            </View>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Owner Name</Text>
              <Text style={docCardStyles.detailValue}>{document.ownerName || 'Rushikesh Patil'}</Text>
            </View>
            <View style={docCardStyles.detailCol}>
              <Text style={docCardStyles.detailLabel}>Reg Date</Text>
              <Text style={docCardStyles.detailValue}>{document.regDate || '2022-03-15'}</Text>
            </View>
          </>
        )}

        <View style={docCardStyles.detailCol}>
          <Text style={docCardStyles.detailLabel}>Expiry Date</Text>
          <Text style={[docCardStyles.detailValue, { color: '#D97706', fontWeight: '800' }]}>
            {document.expiry}
          </Text>
        </View>
      </View>

      <View style={docCardStyles.actionsRow}>
        <QuickActionButton 
          label="View Details" 
          icon="👁️" 
          variant="primary" 
          onPress={() => onViewDetails(document)} 
        />
        <QuickActionButton 
          label="Download" 
          icon="📥" 
          variant="secondary" 
          onPress={handleDownloadPlaceholder} 
        />
        <QuickActionButton 
          label="Share" 
          icon="🔗" 
          variant="secondary" 
          onPress={handleSharePlaceholder} 
        />
      </View>
    </View>
  );
}

const docCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  typeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '850',
    color: '#0F172A',
  },
  vehicleName: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 12,
  },
  detailCol: {
    minWidth: '45%',
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '750',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
});

// ── 6. EXPIRY ALERT CARD ──
export function ExpiryAlertCard({ urgentCount, expiringItems, onOpenItem }) {
  if (!urgentCount || urgentCount === 0) return null;

  return (
    <View style={alertCardStyles.card}>
      <View style={alertCardStyles.headerRow}>
        <Text style={alertCardStyles.icon}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={alertCardStyles.title}>Action Needed: Document Expiries</Text>
          <Text style={alertCardStyles.desc}>
            {urgentCount} document{urgentCount > 1 ? 's require' : ' requires'} immediate renewal.
          </Text>
        </View>
      </View>

      <View style={alertCardStyles.itemsList}>
        {expiringItems.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={alertCardStyles.itemRow} 
            onPress={() => onOpenItem(item)}
            activeOpacity={0.8}
          >
            <Text style={alertCardStyles.itemText}>• {item.vehicleName}: {item.label}</Text>
            <Text style={alertCardStyles.itemStatus}>{item.status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const alertCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '850',
    color: '#991B1B',
  },
  desc: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
  itemsList: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#FCA5A5',
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7F1D1D',
  },
  itemStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
});

// ── 7. MAINTENANCE CATEGORY CARD ──
export function MaintenanceCategoryCard({ category, onReadMore }) {
  if (!category) return null;

  return (
    <View style={maintStyles.card}>
      <View style={maintStyles.headerRow}>
        <View style={maintStyles.iconBox}>
          <Text style={maintStyles.icon}>{category.icon}</Text>
        </View>
        <View style={maintStyles.infoBox}>
          <Text style={maintStyles.title}>{category.title}</Text>
          <Text style={maintStyles.countText}>{category.articleCount || 8} Articles Available</Text>
        </View>
      </View>

      <Text style={maintStyles.desc} numberOfLines={2}>{category.description}</Text>

      {category.featuredArticle ? (
        <View style={maintStyles.featuredBox}>
          <Text style={maintStyles.featuredLabel}>Featured Guide</Text>
          <Text style={maintStyles.featuredTitle}>{category.featuredArticle.title}</Text>
        </View>
      ) : null}

      <TouchableOpacity 
        style={maintStyles.readBtn} 
        onPress={() => onReadMore(category)}
        activeOpacity={0.8}
      >
        <Text style={maintStyles.readBtnText}>Read Care Guides →</Text>
      </TouchableOpacity>
    </View>
  );
}

const maintStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  infoBox: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '850',
    color: '#0F172A',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  featuredBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  featuredLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 12,
    fontWeight: '750',
    color: '#1E293B',
    marginTop: 3,
  },
  readBtn: {
    alignSelf: 'flex-start',
  },
  readBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
});
