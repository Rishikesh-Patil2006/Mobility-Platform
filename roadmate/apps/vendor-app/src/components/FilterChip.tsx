import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : null]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected ? styles.textSelected : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  chipSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  textSelected: {
    color: 'white',
  },
});
export default FilterChip;
