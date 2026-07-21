// roadmate/apps/customer-app/src/screens/sub-screens/VehicleHubScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { getVehicleDocuments } from '../../services/documentService';
import { getMaintenanceCategories } from '../../services/maintenanceService';
import { getVehicleHubSummary } from '../../services/vehicleHubService';
import { 
  VehicleHubHeader, 
  VehicleHubSection, 
  VehicleDocumentCard, 
  ExpiryAlertCard, 
  MaintenanceCategoryCard 
} from '../../components/VehicleHubComponents';
import { filterVehicleDocuments } from '../../utils/vehicleHubUtils';

export default function VehicleHubScreen({ 
  vehicles = [], 
  onBack, 
  onOpenDoc,
  onOpenTips
}) {
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles'); // 'All Vehicles' | '2 Wheelers' | '4 Wheelers'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Database states
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await getVehicleDocuments();
      const catList = await getMaintenanceCategories();
      const hubSummary = await getVehicleHubSummary();

      setDocuments(docs);
      setCategories(catList);
      setSummary(hubSummary);
    } catch (err) {
      console.error('Error fetching Vehicle Hub data:', err);
      Alert.alert('Database Sync Error', 'Could not refresh vehicle documents and maintenance guidelines.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter documents: Filters RC, Insurance, PUC by vehicle type dropdown + search
  const filteredDocuments = filterVehicleDocuments(documents, vehicles, selectedFilter, searchQuery);

  // Filter maintenance categories: Filtered ONLY by search query (NOT by vehicle category dropdown)
  const filteredCategories = categories.filter(cat => {
    if (!searchQuery || searchQuery.trim().length === 0) return true;
    const q = searchQuery.toLowerCase().trim();
    return cat.title.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
  });

  const handleOpenMaintenanceCategory = (category) => {
    if (onOpenTips) {
      onOpenTips(category.id);
    } else {
      Alert.alert(
        category.title,
        `${category.description}\n\nFeatured Guide:\n• ${category.featuredArticle.title} (${category.featuredArticle.readTime})\n\n${category.featuredArticle.summary}`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* ── HEADER WITH COMPACT DROPDOWN ── */}
      <VehicleHubHeader 
        title="Vehicle Hub"
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        onBack={onBack}
      />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* ── SEARCH BAR ── */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Insurance, PUC, RC or Care Guides..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loaderText}>Syncing vehicle certificates & care repository...</Text>
          </View>
        ) : (
          <View>
            {/* ── EXPIRY ALERTS BANNER ── */}
            {summary && summary.urgentItems.length > 0 && (
              <ExpiryAlertCard 
                urgentCount={summary.urgentItems.length}
                expiringItems={summary.urgentItems}
                onOpenItem={(item) => {
                  const matchedDoc = documents.find(d => d.id === item.id);
                  if (matchedDoc && onOpenDoc) onOpenDoc(matchedDoc.key || matchedDoc.id, matchedDoc.vehicleId);
                  else if (matchedDoc) Alert.alert(matchedDoc.label, `Document ${matchedDoc.number} is ${item.status}`);
                }}
              />
            )}

            {/* ── SECTION 1: VEHICLE DOCUMENTS ── */}
            <VehicleHubSection 
              title="Vehicle Documents" 
              subtitle={`Showing ${filteredDocuments.length} registered certificates (${selectedFilter})`}
            >
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(doc => (
                  <VehicleDocumentCard
                    key={doc.id}
                    document={doc}
                    onViewDetails={(d) => {
                      if (onOpenDoc) onOpenDoc(d.key || d.type, d.vehicleId);
                      else Alert.alert(d.label, `Number: ${d.number}\nVehicle: ${d.vehicleName}\nExpiry: ${d.expiry}`);
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyEmoji}>📄</Text>
                  <Text style={styles.emptyTitle}>No Matching Documents</Text>
                  <Text style={styles.emptySub}>No RC, Insurance or PUC certificates found for {selectedFilter}.</Text>
                </View>
              )}
            </VehicleHubSection>

            {/* ── SECTION 2: TIPS & MAINTENANCE ── */}
            <VehicleHubSection 
              title="Tips & Maintenance" 
              subtitle="Curated care guides, engine checklists & RTO guidelines"
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => (
                  <MaintenanceCategoryCard
                    key={cat.id}
                    category={cat}
                    onReadMore={handleOpenMaintenanceCategory}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyEmoji}>🛠️</Text>
                  <Text style={styles.emptyTitle}>No Matching Care Guides</Text>
                  <Text style={styles.emptySub}>Try adjusting your search query.</Text>
                </View>
              )}
            </VehicleHubSection>

          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Re-export alias for backward compatibility
export { VehicleHubScreen as InformationHubScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  body: {
    flex: 1,
  },
  scrollPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  clearIcon: {
    fontSize: 14,
    color: '#94A3B8',
    padding: 4,
    fontWeight: 'bold',
  },
  loaderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 14,
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '850',
    color: '#1E293B',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
