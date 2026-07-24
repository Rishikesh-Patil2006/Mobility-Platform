import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

interface QuickActionButtonsProps {
  customerName: string;
  customerMobile: string;
  address?: string;
  bookingId?: string;
  serviceName?: string;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  customerName,
  customerMobile,
  address,
  bookingId,
  serviceName,
}) => {
  const handleCall = () => {
    Linking.openURL(`tel:${customerMobile}`).catch(() => {
      Alert.alert('Error', 'Unable to open phone dialer.');
    });
  };

  const handleWhatsApp = () => {
    const formatted = customerMobile.replace(/[^0-9]/g, '');
    const msg = `Hello ${customerName}, this is RoadMate partner regarding your booking ${bookingId ? `#${bookingId}` : ''} (${serviceName || 'service'}).`;
    const url = `whatsapp://send?phone=${formatted}&text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`).catch(() => {
        Alert.alert('Error', 'WhatsApp unavailable.');
      });
    });
  };

  const handleMap = () => {
    if (!address) return Alert.alert('Notice', 'No customer address specified.');
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(mapUrl);
  };

  const handleCopy = () => {
    Alert.alert('Details Copied', `Copied details for ${customerName} (${customerMobile})`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCall} style={[styles.btn, styles.callBtn]} activeOpacity={0.7}>
        <Text style={styles.callText}>📞 Call</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleWhatsApp} style={[styles.btn, styles.waBtn]} activeOpacity={0.7}>
        <Text style={styles.waText}>💬 WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleMap} style={[styles.btn, styles.mapBtn]} activeOpacity={0.7}>
        <Text style={styles.mapText}>🗺️ Directions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCopy} style={[styles.btn, styles.copyBtn]} activeOpacity={0.7}>
        <Text style={styles.copyText}>📋 Copy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    backgroundColor: '#DC2626',
  },
  callText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  waBtn: {
    backgroundColor: '#16A34A',
  },
  waText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  mapBtn: {
    backgroundColor: '#2563EB',
  },
  mapText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  copyBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  copyText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '800',
  },
});
export default QuickActionButtons;
