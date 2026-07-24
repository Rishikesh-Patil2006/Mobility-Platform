import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface BookingFilterBarProps {
  search: string;
  onChangeSearch: (t: string) => void;
  activeFilter: string;
  onSelectFilter: (f: string) => void;
  filters: string[];
}

export const BookingFilterBar: React.FC<BookingFilterBarProps> = ({
  search,
  onChangeSearch,
  activeFilter,
  onSelectFilter,
  filters,
}) => {
  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by ID, Name, Mobile, Service..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={onChangeSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onChangeSearch('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Badges Horizontal Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {filters.map((f) => {
          const selected = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => onSelectFilter(f)}
              style={[styles.pill, selected ? styles.pillActive : null]}
            >
              <Text style={[styles.pillText, selected ? styles.pillTextActive : null]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  filterScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTextActive: {
    color: 'white',
  },
});
export default BookingFilterBar;
