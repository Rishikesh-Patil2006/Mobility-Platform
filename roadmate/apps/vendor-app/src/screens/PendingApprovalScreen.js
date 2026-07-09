import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PendingApprovalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Under Review</Text>
      <Text>Your profile is pending admin approval.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
