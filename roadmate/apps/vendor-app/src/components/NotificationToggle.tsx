import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

interface NotificationToggleProps {
  label: string;
  description: string;
  icon: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  description,
  icon,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
        thumbColor={value ? '#1E3A8A' : '#94A3B8'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  description: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
});
export default NotificationToggle;
