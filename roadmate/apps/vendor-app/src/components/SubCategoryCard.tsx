import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SubCategoryCardProps {
  name: string;
  selected: boolean;
  onSelect: () => void;
}

export const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  name,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.pill, selected ? styles.pillSelected : null]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected ? styles.textSelected : null]}>
        {selected ? `✓ ${name}` : name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
    marginBottom: 8,
  },
  pillSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  textSelected: {
    color: 'white',
  },
});
export default SubCategoryCard;
