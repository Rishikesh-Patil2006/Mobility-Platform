import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { PrivacySettings } from '../services/vendorPreferenceService';

interface PrivacyCardProps {
  privacy: PrivacySettings;
  onUpdatePrivacy: (key: keyof PrivacySettings, val: boolean) => void;
}

export const PrivacyCard: React.FC<PrivacyCardProps> = ({ privacy, onUpdatePrivacy }) => {
  const items: { key: keyof PrivacySettings; label: string; icon: string; desc: string }[] = [
    {
      key: 'businessVisibility',
      label: 'Public Business Profile',
      icon: '🌐',
      desc: 'Show workshop listing in customer search results',
    },
    {
      key: 'displayContactNumber',
      label: 'Display Phone Number',
      icon: '📞',
      desc: 'Allow customers to view & call workshop mobile',
    },
    {
      key: 'displayWhatsApp',
      label: 'Display WhatsApp Button',
      icon: '💬',
      desc: 'Show direct WhatsApp enquiry trigger',
    },
    {
      key: 'displayEmail',
      label: 'Display Email Address',
      icon: '✉️',
      desc: 'Display support email address on listing page',
    },
    {
      key: 'displayAddress',
      label: 'Display Workshop Address',
      icon: '🗺️',
      desc: 'Show full workshop address & map directions pin',
    },
    {
      key: 'displayBusinessHours',
      label: 'Display Opening Hours',
      icon: '⏰',
      desc: 'Show daily operating schedule on profile page',
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.key} style={styles.row}>
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.textCol}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <Switch
            value={privacy[item.key]}
            onValueChange={(val) => onUpdatePrivacy(item.key, val)}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={privacy[item.key] ? '#1E3A8A' : '#94A3B8'}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
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
  desc: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
});
export default PrivacyCard;
