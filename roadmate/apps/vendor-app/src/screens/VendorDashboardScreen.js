import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

import VendorHomeTab from './sub-screens/VendorHomeTab';
import VendorListingsTab from './sub-screens/VendorListingsTab';
import VendorManageTab from './sub-screens/VendorManageTab';
import VendorProfileTab from './sub-screens/VendorProfileTab';

const { width } = Dimensions.get('window');

export default function VendorDashboardScreen({ navigation }) {
  const [tab, setTab] = useState('home'); // home | listings | manage | profile

  const handleLogout = () => {
    navigation.replace('Auth');
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'home':
        return <VendorHomeTab onSelectTab={setTab} />;
      case 'listings':
        return <VendorListingsTab />;
      case 'manage':
        return <VendorManageTab />;
      case 'profile':
        return <VendorProfileTab onLogout={handleLogout} />;
      default:
        return <VendorHomeTab onSelectTab={setTab} />;
    }
  };

  const navItems = [
    { key: 'home', label: 'Home', emoji: '🏠' },
    { key: 'listings', label: 'Listings', emoji: '📋' },
    { key: 'manage', label: 'Manage', emoji: '⚙️' },
    { key: 'profile', label: 'Profile', emoji: '👤' },
  ];

  return (
    <View style={styles.container}>
      {/* Main Tab Render Body */}
      <View style={styles.body}>
        {renderTabContent()}
      </View>

      {/* Bottom Navigation Menu */}
      <SafeAreaView style={styles.bottomNavContainer}>
        <View style={styles.bottomNavRow}>
          {navItems.map((item) => {
            const active = tab === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setTab(item.key)}
                style={styles.navButton}
                activeOpacity={0.7}
              >
                <View style={[styles.emojiBox, active ? styles.emojiBoxActive : null]}>
                  <Text style={[styles.navEmoji, active ? styles.navEmojiActive : null]}>
                    {item.emoji}
                  </Text>
                </View>
                <Text style={[styles.navLabel, active ? styles.navLabelActive : null]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  body: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 4,
  },
  emojiBox: {
    width: 44,
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiBoxActive: {
    backgroundColor: '#EFF6FF',
  },
  navEmoji: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  navEmojiActive: {
    color: '#1E3A8A',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#1E3A8A',
    fontWeight: '800',
  },
});
