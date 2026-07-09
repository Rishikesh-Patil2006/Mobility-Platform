import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function VendorRegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Register</Text>
      <Button title="Register & Verify OTP" onPress={() => navigation.navigate('VendorOtp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
