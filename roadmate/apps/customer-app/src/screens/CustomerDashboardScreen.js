import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import apiClient from '../services/apiClient';
import DashboardTab from './sub-screens/DashboardTab';
import AddVehicleScreen from './sub-screens/AddVehicleScreen';
import InformationHubScreen from './sub-screens/InformationHubScreen';
import DocumentDetailScreen from './sub-screens/DocumentDetailScreen';
import ServicesHomeScreen from './sub-screens/ServicesHomeScreen';
import ProvidersListScreen from './sub-screens/ProvidersListScreen';
import ProviderDetailsScreen from './sub-screens/ProviderDetailsScreen';
import MapNavigationScreen from './sub-screens/MapNavigationScreen';
import PersonalizedScreen from './sub-screens/PersonalizedScreen';

const { width, height } = Dimensions.get('window');

// MOCK VEHICLE DATA (Matching Figma spec)
const defaultVehicles = [
  { id: '1', name: 'Honda City', number: 'MH-19-AB-1234', fuel: 'Petrol', type: 'car', status: 'Active', brand: 'Honda', model: 'City' },
  { id: '2', name: 'Activa 6G', number: 'MH-19-CD-5678', fuel: 'Petrol', type: 'scooty', status: 'Active', brand: 'Honda', model: 'Activa 6G' },
  { id: '3', name: 'Hyundai Creta EV', number: 'MH-19-EF-9012', fuel: 'Electric', type: 'ev', status: 'Active', brand: 'Hyundai', model: 'Creta EV' },
];

export default function CustomerDashboardScreen({ navigation }) {
  // Main states
  const [tab, setTab] = useState('home'); // home | services | ihub | personalized
  const [screen, setScreen] = useState(null); // null | add-vehicle | doc | providers | provider-detail | map
  const [vehicles, setVehicles] = useState(defaultVehicles);
  const [activeDoc, setActiveDoc] = useState('puc');
  const [activeVehicleId, setActiveVehicleId] = useState('1');
  const [serviceCategory, setServiceCategory] = useState('Garage');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [navProvider, setNavProvider] = useState(null);
  
  // Drawer state & animation
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerX = useRef(new Animated.Value(-285)).current;
  const drawerBgOpacity = useRef(new Animated.Value(0)).current;

  // Backend Health check state
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    // Perform backend health check
    const checkHealth = async () => {
      try {
        const response = await apiClient.get('/health');
        if (response.data?.success) {
          setBackendStatus('Connected');
        } else {
          setBackendStatus('Failed');
        }
      } catch (error) {
        setBackendStatus('Offline');
      }
    };
    checkHealth();
  }, []);

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(drawerX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(drawerBgOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerX, {
        toValue: -285,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(drawerBgOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setDrawerOpen(false));
  };

  const handleLogout = () => {
    closeDrawer();
    navigation.replace('Auth', { screen: 'Welcome' });
  };

  const handleOpenDoc = (docType, vehicleId) => {
    setActiveDoc(docType);
    if (vehicleId) setActiveVehicleId(vehicleId);
    setScreen('doc');
  };

  const handleOpenServices = (category) => {
    if (category) {
      setServiceCategory(category);
      setScreen('providers');
    } else {
      setTab('services');
      setScreen(null);
    }
  };

  // Navigations back helper
  const navigateBack = () => {
    if (screen === 'map') setScreen('provider-detail');
    else if (screen === 'provider-detail') setScreen('providers');
    else if (screen === 'providers') setScreen('services');
    else setScreen(null);
  };

  // Drawer links
  const drawerLinks = [
    { icon: '📄', label: 'My Documents', action: () => { closeDrawer(); setTab('ihub'); setScreen(null); } },
    { icon: '🚗', label: 'My Vehicles', action: () => { closeDrawer(); setTab('personalized'); setScreen(null); } },
    { icon: '⭐', label: 'Saved Services', action: () => { closeDrawer(); handleOpenServices(); } },
    { icon: '⚙️', label: 'Settings', action: () => closeDrawer() },
    { icon: '❓', label: 'Help & Support', action: () => closeDrawer() },
  ];

  // Render function depending on screening states
  const renderContent = () => {
    if (screen === 'add-vehicle') {
      return <AddVehicleScreen onBack={navigateBack} onSave={(v) => { setVehicles(prev => [...prev, v]); setScreen(null); }} />;
    }
    if (screen === 'doc') {
      return <DocumentDetailScreen docType={activeDoc} vehicleId={activeVehicleId} onBack={navigateBack} />;
    }
    if (screen === 'providers') {
      return <ProvidersListScreen category={serviceCategory} onBack={navigateBack} onSelect={(p) => { setSelectedProvider(p); setScreen('provider-detail'); }} />;
    }
    if (screen === 'provider-detail') {
      return <ProviderDetailsScreen provider={selectedProvider} category={serviceCategory} onBack={navigateBack} onNavigate={(p) => { setNavProvider(p); setScreen('map'); }} />;
    }
    if (screen === 'map') {
      return <MapNavigationScreen provider={navProvider} onBack={navigateBack} />;
    }

    // Default Tab Rendering
    switch (tab) {
      case 'home':
        return (
          <DashboardTab 
            vehicles={vehicles}
            backendStatus={backendStatus}
            onOpenDrawer={openDrawer}
            onAddVehicle={() => setScreen('add-vehicle')}
            onOpenDoc={handleOpenDoc}
            onOpenServices={handleOpenServices}
            onOpenInfoHub={() => { setTab('ihub'); setScreen(null); }}
          />
        );
      case 'services':
        return <ServicesHomeScreen onBack={() => setTab('home')} onSelectCategory={(cat) => { setServiceCategory(cat); setScreen('providers'); }} />;
      case 'ihub':
        return <InformationHubScreen vehicles={vehicles} onBack={() => setTab('home')} onOpenDoc={handleOpenDoc} />;
      case 'personalized':
        return <PersonalizedScreen vehicles={vehicles} onLogout={handleLogout} onOpenDoc={handleOpenDoc} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Active screen content */}
      <View style={styles.mainContainer}>
        {renderContent()}
      </View>

      {/* Custom Bottom Nav Bar */}
      {!screen && (
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => setTab('home')} style={styles.navButton} activeOpacity={0.7}>
            <Text style={[styles.navIcon, tab === 'home' ? styles.navIconActive : null]}>🏠</Text>
            <Text style={[styles.navText, tab === 'home' ? styles.navTextActive : null]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab('services')} style={styles.navButton} activeOpacity={0.7}>
            <Text style={[styles.navIcon, tab === 'services' ? styles.navIconActive : null]}>🛠️</Text>
            <Text style={[styles.navText, tab === 'services' ? styles.navTextActive : null]}>Services</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab('ihub')} style={styles.navButton} activeOpacity={0.7}>
            <Text style={[styles.navIcon, tab === 'ihub' ? styles.navIconActive : null]}>📂</Text>
            <Text style={[styles.navText, tab === 'ihub' ? styles.navTextActive : null]}>Info Hub</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab('personalized')} style={styles.navButton} activeOpacity={0.7}>
            <Text style={[styles.navIcon, tab === 'personalized' ? styles.navIconActive : null]}>👤</Text>
            <Text style={[styles.navText, tab === 'personalized' ? styles.navTextActive : null]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Side Drawer Menu Overlay */}
      {drawerOpen && (
        <View style={styles.drawerOverlay}>
          {/* Backdrop */}
          <Animated.View style={[styles.drawerBackdrop, { opacity: drawerBgOpacity }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={closeDrawer} activeOpacity={1} />
          </Animated.View>
          
          {/* Drawer Menu Body */}
          <Animated.View style={[styles.drawerBody, { transform: [{ translateX: drawerX }] }]}>
            {/* Header info */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerHeaderRow}>
                <Text style={styles.drawerLogoText}>RoadMate</Text>
                <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.drawerProfileRow}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>👤</Text>
                </View>
                <View>
                  <Text style={styles.drawerProfileName}>Rushikesh Patil</Text>
                  <Text style={styles.drawerProfileEmail}>rp6870888@gmail.com</Text>
                </View>
              </View>
            </View>

            {/* Navigation links */}
            <ScrollView style={styles.drawerLinksContainer} showsVerticalScrollIndicator={false}>
              {drawerLinks.map((link) => (
                <TouchableOpacity key={link.label} onPress={link.action} style={styles.drawerLink} activeOpacity={0.7}>
                  <View style={styles.drawerLinkRow}>
                    <Text style={styles.drawerLinkIcon}>{link.icon}</Text>
                    <Text style={styles.drawerLinkLabel}>{link.label}</Text>
                  </View>
                  <Text style={styles.drawerLinkArrow}>❯</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Footer with logout */}
            <View style={styles.drawerFooter}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.8}>
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

// ── TEMPORARY VIEW STUBS FOR CORE SUB-MODULES ──
// These will be fully replaced with standalone files and premium layout screens



















const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
  },
  bottomNav: {
    height: 72,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.4,
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  navTextActive: {
    color: '#2563EB',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  drawerBody: {
    width: 285,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 16,
    paddingTop: 50,
  },
  drawerHeader: {
    backgroundColor: '#1E3FAA',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerLogoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  drawerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  drawerAvatarText: {
    fontSize: 24,
  },
  drawerProfileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  drawerProfileEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  drawerLinksContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  drawerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  drawerLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  drawerLinkIcon: {
    fontSize: 18,
  },
  drawerLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  drawerLinkArrow: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 10,
  },
  logoutIcon: {
    fontSize: 16,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },

});
