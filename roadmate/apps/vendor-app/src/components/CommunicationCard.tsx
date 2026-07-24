import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommunicationLogItem } from '../services/vendorCommunicationService';

interface CommunicationCardProps {
  log: CommunicationLogItem;
}

export const CommunicationCard: React.FC<CommunicationCardProps> = ({ log }) => {
  const getIcon = () => {
    switch (log.channel) {
      case 'Call':
        return '📞';
      case 'WhatsApp':
        return '💬';
      case 'Navigation':
        return '🗺️';
      default:
        return '📩';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{log.customerName}</Text>
          <Text style={styles.time}>{log.timestamp}</Text>
        </View>
        <Text style={styles.mobile}>{log.customerMobile} · <Text style={styles.channel}>{log.channel}</Text></Text>
        {log.notes ? <Text style={styles.notes}>"{log.notes}"</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  time: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  mobile: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  channel: {
    fontWeight: '800',
    color: '#2563EB',
  },
  notes: {
    fontSize: 10.5,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
export default CommunicationCard;
