import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BusinessPreferences, ThemeMode } from '../services/vendorPreferenceService';

interface PreferenceCardProps {
  preferences: BusinessPreferences;
  onUpdatePref: (key: keyof BusinessPreferences, val: string) => void;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({ preferences, onUpdatePref }) => {
  return (
    <View style={styles.container}>
      {/* Currency */}
      <View style={styles.row}>
        <View style={styles.lblCol}>
          <Text style={styles.label}>🪙 Default Currency</Text>
          <Text style={styles.desc}>Currency used for service pricing & quotes</Text>
        </View>
        <TouchableOpacity
          onPress={() => onUpdatePref('currency', preferences.currency === 'INR (₹)' ? 'USD ($)' : 'INR (₹)')}
          style={styles.pickerBtn}
        >
          <Text style={styles.pickerVal}>{preferences.currency}</Text>
        </TouchableOpacity>
      </View>

      {/* Language */}
      <View style={styles.row}>
        <View style={styles.lblCol}>
          <Text style={styles.label}>🗣️ Partner Language</Text>
          <Text style={styles.desc}>App interface language</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            const next = preferences.language === 'English' ? 'Hindi' : preferences.language === 'Hindi' ? 'Marathi' : 'English';
            onUpdatePref('language', next);
          }}
          style={styles.pickerBtn}
        >
          <Text style={styles.pickerVal}>{preferences.language}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Format */}
      <View style={styles.row}>
        <View style={styles.lblCol}>
          <Text style={styles.label}>📅 Date Format</Text>
          <Text style={styles.desc}>Format for slot schedules</Text>
        </View>
        <TouchableOpacity
          onPress={() => onUpdatePref('dateFormat', preferences.dateFormat === 'DD/MM/YYYY' ? 'YYYY-MM-DD' : 'DD/MM/YYYY')}
          style={styles.pickerBtn}
        >
          <Text style={styles.pickerVal}>{preferences.dateFormat}</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Mode */}
      <View style={styles.row}>
        <View style={styles.lblCol}>
          <Text style={styles.label}>🎨 Appearance Theme</Text>
          <Text style={styles.desc}>Choose UI theme mode</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            const next: ThemeMode = preferences.themeMode === 'Light' ? 'Dark' : preferences.themeMode === 'Dark' ? 'System' : 'Light';
            onUpdatePref('themeMode', next);
          }}
          style={styles.pickerBtn}
        >
          <Text style={styles.pickerVal}>{preferences.themeMode}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  lblCol: {
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
  pickerBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pickerVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
});
export default PreferenceCard;
