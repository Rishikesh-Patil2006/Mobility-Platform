import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  children: React.ReactNode;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ title, subtitle, icon, children }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  content: {
    gap: 4,
  },
});
export default SettingsCard;
