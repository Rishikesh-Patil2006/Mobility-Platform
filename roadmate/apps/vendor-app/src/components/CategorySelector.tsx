import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { categoryGroups, CategoryItem } from '../services/vendorCategoryService';
import CategoryCard from './CategoryCard';

interface CategorySelectorProps {
  selectedCategoryId: string;
  onSelectCategory: (category: CategoryItem) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [search, setSearch] = useState('');

  // Filter categories by search
  const filteredGroups = categoryGroups
    .map((group) => {
      const items = group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search categories (e.g. Towing, Wash)..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
        {filteredGroups.map((group) => (
          <View key={group.title} style={styles.groupSection}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item) => (
              <CategoryCard
                key={item.id}
                name={item.name}
                emoji={item.emoji}
                description={item.description}
                selected={selectedCategoryId === item.id}
                onSelect={() => onSelectCategory(item)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  listScroll: {
    maxHeight: 280,
  },
  groupSection: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
});
export default CategorySelector;
