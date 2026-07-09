import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function VendorLoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Login</Text>
      <Button title="Get OTP" onPress={() => navigation.navigate('VendorOtp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
