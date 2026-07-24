import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

import VendorHomeTab from './sub-screens/VendorHomeTab';
import VendorListingsTab from './sub-screens/VendorListingsTab';
import VendorTipsTab from './sub-screens/VendorTipsTab';
import VendorProfileTab from './sub-screens/VendorProfileTab';

const { width } = Dimensions.get('window');

export default function VendorDashboardScreen({ navigation }) {
  const [tab, setTab] = useState('home'); // home | listings | tips | profile
  const [profileSegment, setProfileSegment] = useState('particulars');
  const [profileModal, setProfileModal] = useState(null);

  const handleLogout = () => {
    if (navigation && navigation.replace) {
      navigation.replace('Auth');
    }
  };

  const handleSelectTab = (targetTab, targetSegment = 'particulars', targetModal = null) => {
    setTab(targetTab || 'home');
    if (targetSegment) setProfileSegment(targetSegment);
    if (targetModal !== undefined) setProfileModal(targetModal);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'home':
        return <VendorHomeTab onSelectTab={handleSelectTab} />;
      case 'listings':
        return <VendorListingsTab />;
      case 'tips':
        return <VendorTipsTab />;
      case 'profile':
        return (
          <VendorProfileTab
            onLogout={handleLogout}
            initialSegment={profileSegment}
            initialModal={profileModal}
          />
        );
      default:
        return <VendorHomeTab onSelectTab={handleSelectTab} />;
    }
  };

  const navItems = [
    { key: 'home', label: 'Home', emoji: '🏠' },
    { key: 'listings', label: 'Listings', emoji: '📋' },
    { key: 'tips', label: 'Tips & Care', emoji: '🛠' },
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
                onPress={() => handleSelectTab(item.key)}
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
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bottomNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emojiBox: {
    width: 38,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiBoxActive: {
    backgroundColor: '#EFF6FF',
  },
  navEmoji: {
    fontSize: 16,
  },
  navEmojiActive: {
    fontSize: 18,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#1E3A8A',
    fontWeight: '800',
  },
});
