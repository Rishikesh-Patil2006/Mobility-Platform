import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface QuickActionItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  onPress: () => void;
}

interface QuickActionCardProps {
  actions: QuickActionItem[];
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ actions }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚡ Quick Shortcuts</Text>
      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            onPress={act.onPress}
            style={[styles.btn, { backgroundColor: act.color }]}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{act.emoji}</Text>
            <Text style={styles.label}>{act.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    flex: 1,
    minWidth: '45%',
  },
  emoji: {
    fontSize: 16,
    marginRight: 8,
  },
  label: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
export default QuickActionCard;
