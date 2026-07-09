import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function VendorLandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roadmate Vendor</Text>
      <Button title="Login" onPress={() => navigation.navigate('VendorLogin')} />
      <View style={{height: 10}} />
      <Button title="Register" onPress={() => navigation.navigate('VendorRegister')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
