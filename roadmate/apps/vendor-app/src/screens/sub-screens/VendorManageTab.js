import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function VendorManageTab() {
  // Service toggle states
  const [servicesList, setServicesList] = useState([
    { id: '1', name: 'Engine Overhaul', active: true },
    { id: '2', name: 'Brake Service', active: true },
    { id: '3', name: 'AC Repair', active: true },
    { id: '4', name: 'Wheel Alignment', active: false },
    { id: '5', name: 'Oil Change', active: true },
  ]);

  const [newServiceName, setNewServiceName] = useState('');

  // Timing states
  const [timings, setTimings] = useState([
    { day: 'Monday', active: true, hours: '9:00 AM – 8:00 PM' },
    { day: 'Tuesday', active: true, hours: '9:00 AM – 8:00 PM' },
    { day: 'Wednesday', active: true, hours: '9:00 AM – 8:00 PM' },
    { day: 'Thursday', active: true, hours: '9:00 AM – 8:00 PM' },
    { day: 'Friday', active: true, hours: '9:00 AM – 8:00 PM' },
    { day: 'Saturday', active: true, hours: '9:00 AM – 6:00 PM' },
    { day: 'Sunday', active: false, hours: 'Closed' },
  ]);

  const toggleService = (id) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    setServicesList((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newServiceName.trim(), active: true },
    ]);
    setNewServiceName('');
  };

  const toggleDay = (dayName) => {
    setTimings((prev) =>
      prev.map((t) =>
        t.day === dayName
          ? { ...t, active: !t.active, hours: !t.active ? '9:00 AM – 8:00 PM' : 'Closed' }
          : t
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Services</Text>
        <Text style={styles.headerSubtitle}>Configure services and shop timings</Text>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* Services Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Configure Services</Text>
          <Text style={styles.cardSubtitle}>Enable or disable the services you offer</Text>

          <View style={styles.servicesList}>
            {servicesList.map((s) => (
              <View key={s.id} style={styles.serviceRow}>
                <Text style={[styles.serviceName, !s.active ? styles.textDisabled : null]}>
                  {s.name}
                </Text>
                <Switch
                  value={s.active}
                  onValueChange={() => toggleService(s.id)}
                  trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                  thumbColor={s.active ? '#1E3A8A' : '#F3F4F6'}
                />
              </View>
            ))}
          </View>

          {/* Add custom service */}
          <View style={styles.addServiceBox}>
            <TextInput
              style={styles.addInput}
              placeholder="Add new custom service..."
              placeholderTextColor="#9CA3AF"
              value={newServiceName}
              onChangeText={setNewServiceName}
            />
            <TouchableOpacity onPress={handleAddService} style={styles.addButton} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>＋ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Operating Hours Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Shop Timings</Text>
          <Text style={styles.cardSubtitle}>Set your weekly active working hours</Text>

          <View style={styles.timingsList}>
            {timings.map((t) => (
              <View key={t.day} style={styles.timingRow}>
                <TouchableOpacity 
                  onPress={() => toggleDay(t.day)} 
                  style={styles.timingLeft}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, t.active ? styles.checkboxChecked : null]}>
                    {t.active && <Text style={styles.checkboxCheckMark}>✓</Text>}
                  </View>
                  <Text style={[styles.dayLabel, !t.active ? styles.textDisabled : null]}>
                    {t.day}
                  </Text>
                </TouchableOpacity>
                
                <Text style={[styles.hoursValue, !t.active ? styles.hoursClosed : null]}>
                  {t.hours}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 20,
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
    paddingHorizontal: 20,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  servicesList: {
    marginBottom: 14,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  textDisabled: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  addServiceBox: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  addInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  timingsList: {
    gap: 2,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  timingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  checkboxChecked: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  checkboxCheckMark: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  hoursValue: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '800',
  },
  hoursClosed: {
    color: '#EF4444',
  },
});
