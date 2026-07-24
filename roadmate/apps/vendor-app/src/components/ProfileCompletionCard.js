import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileCompletionCard({
  percentage = 95,
  missingFields = [],
  onAction,
  onFixPress,
}) {
  const safeFields = Array.isArray(missingFields) ? missingFields : [];
  const isComplete = percentage === 100;
  const handleAction = onFixPress || onAction;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile Completion</Text>
        <Text style={[styles.percentText, { color: isComplete ? '#16A34A' : '#2563EB' }]}>
          {percentage}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFilled,
            {
              width: `${percentage}%`,
              backgroundColor: isComplete ? '#22C55E' : '#2563EB',
            },
          ]}
        />
      </View>

      {isComplete ? (
        <Text style={styles.completeMsg}>🎉 Congratulations! Your profile is 100% complete.</Text>
      ) : (
        <View style={styles.missingContainer}>
          <Text style={styles.missingTitle}>Complete your profile to get verified faster:</Text>
          {safeFields.slice(0, 4).map((field) => (
            <TouchableOpacity
              key={field}
              onPress={() => handleAction && handleAction(field)}
              style={styles.missingItem}
              activeOpacity={0.7}
            >
              <Text style={styles.missingItemIcon}>➕</Text>
              <Text style={styles.missingItemText}>{field}</Text>
            </TouchableOpacity>
          ))}
          {safeFields.length > 4 && (
            <Text style={styles.moreCount}>+ {safeFields.length - 4} more details remaining</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  percentText: {
    fontSize: 18,
    fontWeight: '900',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barFilled: {
    height: '100%',
    borderRadius: 4,
  },
  completeMsg: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  missingContainer: {
    marginTop: 4,
  },
  missingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  missingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  missingItemIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  missingItemText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  moreCount: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
});
