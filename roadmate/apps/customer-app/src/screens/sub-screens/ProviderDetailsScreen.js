import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const servicesByCategory = {
  Garage: ['Engine Overhaul', 'Brake Service', 'AC Repair', 'Wheel Alignment', 'Oil Change', 'Battery Replacement'],
  'Car Wash': ['Exterior Wash', 'Interior Cleaning', 'Waxing & Polishing', 'Engine Bay Cleaning', 'Foam Wash', 'Ceramic Coat'],
  Towing: ['24x7 Breakdown Towing', 'Accident Recovery', 'Flatbed Towing', 'Long Distance Towing', 'Motorcycle Towing'],
  'PUC Center': ['PUC Testing', 'Emission Certificate', 'HSRP Plate', 'Digital Certificate'],
  Denting: ['Dent Removal', 'Panel Beating', 'Full Body Paint', 'Scratch Removal', 'Rust Treatment'],
  'Service Center': ['Full Service', 'Engine Tune-up', 'Transmission Service', 'Suspension Check', 'Electrical Repair'],
};

const categoryIcon = {
  Garage: '🔧',
  'Car Wash': '🫧',
  Towing: '🛻',
  'PUC Center': '💨',
};

const photoLabels = ['Interior', 'Workshop', 'Equipment', 'Team'];

export default function ProviderDetailsScreen({ provider, category, onBack, onNavigate }) {
  if (!provider) return null;

  const providerServices = servicesByCategory[category] || servicesByCategory.Garage;
  const icon = categoryIcon[category] || '🔧';

  const handleCall = () => {
    Linking.openURL(`tel:${provider.phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Cover Image Hero */}
      <View style={styles.heroSection}>
        {/* Dynamic decorative backdrop shape */}
        <View style={styles.heroBackdrop}>
          <Text style={styles.heroHugeEmoji}>{icon}</Text>
        </View>

        {/* Floating buttons */}
        <View style={styles.headerFloatingRow}>
          <TouchableOpacity onPress={onBack} style={styles.floatingButton} activeOpacity={0.7}>
            <Text style={styles.floatArrow}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingButton} activeOpacity={0.7}>
            <Text style={styles.floatArrow}>✉️</Text>
          </TouchableOpacity>
        </View>

        {/* Photo thumbnails row */}
        <View style={styles.thumbnailsRow}>
          {photoLabels.map((lbl) => (
            <View key={lbl} style={styles.thumbnailBox}>
              <Text style={styles.thumbnailIcon}>🖼️</Text>
              <Text style={styles.thumbnailText}>{lbl}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Main Details Overlay Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View style={styles.titleRow}>
              <View style={styles.brandIconCircle}>
                <Text style={styles.brandIconEmoji}>{icon}</Text>
              </View>
              <View style={styles.titleBlock}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerCat}>{category}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: provider.open ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, { color: provider.open ? '#2E7D32' : '#C62828' }]}>
                {provider.open ? '● Open' : '● Closed'}
              </Text>
            </View>
          </View>

          {/* Rating stars */}
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={[styles.starIcon, { color: i < Math.floor(provider.rating) ? '#F59E0B' : '#E5E7EB' }]}>★</Text>
            ))}
            <Text style={styles.ratingVal}>{provider.rating}</Text>
            <Text style={styles.reviewsCount}>({provider.reviews} reviews)</Text>
          </View>

          {/* Core Info list */}
          <View style={styles.infoLinesList}>
            <View style={styles.infoLine}>
              <Text style={styles.infoLineEmoji}>📍</Text>
              <Text style={styles.infoLineText}>{provider.address}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLineEmoji}>🧭</Text>
              <Text style={styles.infoLineText}>{provider.distance} away</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLineEmoji}>🕒</Text>
              <Text style={styles.infoLineText}>{provider.hours}</Text>
            </View>
          </View>
        </View>

        {/* Action Call & Directions Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleCall} style={styles.callButton} activeOpacity={0.85}>
            <Text style={styles.actionButtonText}>📞 Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNavigate(provider)} style={styles.directionsButton} activeOpacity={0.85}>
            <Text style={styles.actionButtonText}>🧭 Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Services Checklist */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          <View style={styles.servicesGrid}>
            {providerServices.map((s) => (
              <View key={s} style={styles.serviceCheckItem}>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
                <Text style={styles.serviceText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Reviews list */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {[
            { name: 'Rahul S.', date: '2 days ago', rating: 5, comment: 'Excellent service! Very professional and on time.' },
            { name: 'Priya M.', date: '1 week ago', rating: 4, comment: 'Good work, fair pricing. Will visit again.' },
          ].map((r, i) => (
            <View key={r.name} style={[styles.reviewRow, i > 0 ? styles.borderTop : null]}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerAvatarText}>{r.name[0]}</Text>
                </View>
                <View>
                  <Text style={styles.reviewerName}>{r.name}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
              </View>
              <View style={styles.reviewStars}>
                {[...Array(r.rating)].map((_, idx) => (
                  <Text key={idx} style={styles.miniStar}>★</Text>
                ))}
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    height: 200,
    backgroundColor: '#1E40AF',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBackdrop: {
    position: 'absolute',
    opacity: 0.1,
  },
  heroHugeEmoji: {
    fontSize: 100,
    color: 'white',
  },
  headerFloatingRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatingButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  floatArrow: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thumbnailsRow: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    flexDirection: 'row',
    gap: 8,
  },
  thumbnailBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailIcon: {
    fontSize: 14,
  },
  thumbnailText: {
    fontSize: 8,
    color: 'white',
    fontWeight: '600',
    marginTop: 2,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  detailsCard: {
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
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  brandIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIconEmoji: {
    fontSize: 22,
  },
  titleBlock: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  providerCat: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  ratingVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 6,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  infoLinesList: {
    gap: 10,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 14,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLineEmoji: {
    fontSize: 14,
  },
  infoLineText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  checkBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  serviceText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  reviewRow: {
    paddingVertical: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerAvatarText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  reviewDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  miniStar: {
    fontSize: 12,
    color: '#F59E0B',
    marginRight: 1,
  },
  reviewComment: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
