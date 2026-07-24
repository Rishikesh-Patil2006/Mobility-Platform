import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function StatCard({
  label,
  value,
  emoji,
  change,
  subtitle,
  accentColor = '#2563EB',
  onPress,
}) {
  const isPositive = (change || 0) >= 0;

  const content = (
    <>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${accentColor}15` }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        {change !== undefined && (
          <View style={[styles.badge, isPositive ? styles.badgePositive : styles.badgeNegative]}>
            <Text style={[styles.badgeText, isPositive ? styles.badgeTextPos : styles.badgeTextNeg]}>
              {isPositive ? '▲ +' : '▼ '}
              {Math.abs(change)}%
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    flex: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePositive: {
    backgroundColor: '#DCFCE7',
  },
  badgeNegative: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgeTextPos: {
    color: '#16A34A',
  },
  badgeTextNeg: {
    color: '#DC2626',
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
});
