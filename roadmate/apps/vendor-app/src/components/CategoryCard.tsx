import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  name: string;
  emoji: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  emoji,
  description,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.card, selected ? styles.cardSelected : null]}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, selected ? styles.iconCircleSelected : null]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, selected ? styles.nameSelected : null]}>{name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>
      </View>
      {selected && (
        <View style={styles.checkmarkCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircleSelected: {
    backgroundColor: '#DBEAFE',
  },
  emoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  nameSelected: {
    color: '#1E3A8A',
  },
  desc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  checkmarkCircle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
export default CategoryCard;
