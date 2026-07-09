import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import apiClient from '../services/apiClient';

export default function VendorDashboardScreen() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await apiClient.get('/health');
        if (response.data.success) {
          setStatus('Backend is Connected');
        } else {
          setStatus('Backend Connection Failed');
        }
      } catch (error) {
        setStatus('Error connecting to backend');
      }
    };

    checkHealth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roadmate</Text>
      <Text style={styles.subtitle}>Vendor App Connected</Text>
      
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>Backend Status: {status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 30,
  },
  statusBox: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
});
