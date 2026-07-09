import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function OtpVerificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Button title="Verify & Login" onPress={() => navigation.navigate('Main')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
