import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DashboardCardProps {
  title: string;
  emoji?: string;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  emoji,
  actionText,
  onAction,
  children,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {actionText && onAction ? (
          <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
            <Text style={styles.actionText}>{actionText} →</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.body}>{children}</View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  body: {
    width: '100%',
  },
});
export default DashboardCard;
