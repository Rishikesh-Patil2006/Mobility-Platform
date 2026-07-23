import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator, Alert, Image } from 'react-native';
import apiClient from '../services/apiClient';
import DashboardTab from './sub-screens/DashboardTab';
import VehicleHubScreen from './sub-screens/VehicleHubScreen';
import InformationHubScreen from './sub-screens/VehicleHubScreen';
import DocumentDetailScreen from './sub-screens/DocumentDetailScreen';
import ServicesHomeScreen from './sub-screens/ServicesHomeScreen';
import ProvidersListScreen from './sub-screens/ProvidersListScreen';
import ProviderDetailsScreen from './sub-screens/ProviderDetailsScreen';
import MapNavigationScreen from './sub-screens/MapNavigationScreen';
import PersonalizedScreen from './sub-screens/PersonalizedScreen';
import VehicleDetailScreen from './sub-screens/VehicleDetailScreen';
import AddVehicleScreen from './sub-screens/AddVehicleScreen';
import TipsScreen from './sub-screens/TipsScreen';
import { generateNotifications } from '../utils/expiryUtils';
import VehicleValuationScreen from './sub-screens/VehicleValuationScreen';
import VehicleInfoScreen from './sub-screens/VehicleInfoScreen';
import VehicleInsightsScreen from './sub-screens/VehicleInfoScreen'; // backward compatibility
import { addMockDocumentsForVehicle, deleteMockDocumentsForVehicle, updateMockDocumentsForVehicle } from '../services/documentService';
import { saveVehiclesToStorage, loadVehiclesFromStorage, saveDocumentsToStorage, loadDocumentsFromStorage } from '../services/vehicleStorageService';
import ExpenseTrackerScreen from './sub-screens/ExpenseTrackerScreen';
import FuelTrackerScreen from './sub-screens/FuelTrackerScreen';
import VehicleTrackerScreen from './sub-screens/VehicleTrackerScreen';
import ChallanScreen from './sub-screens/ChallanScreen';
import DrivingLicenseScreen from './sub-screens/DrivingLicenseScreen';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { FavoriteCard } from '../components/DrivingLicenseComponents';

const { width, height } = Dimensions.get('window');

// MOCK VEHICLE DATA (Supporting all categories and fuel types)
const defaultVehicles = [
  { id: '1', name: 'Honda City', number: 'MH-19-AB-1234', fuel: 'Petrol', type: 'car', status: 'Active', brand: 'Honda', model: 'City', ownerName: 'Rushikesh Patil', regDate: 'Apr 20, 2022', color: 'Golden Brown', year: '2022' },
  { id: '2', name: 'Activa 6G', number: 'MH-19-CD-5678', fuel: 'Petrol', type: 'scooty', status: 'Active', brand: 'Honda', model: 'Activa 6G', ownerName: 'Rushikesh Patil', regDate: 'Mar 10, 2021', color: 'Matte Blue', year: '2021' },
  { id: '3', name: 'Hyundai Creta EV', number: 'MH-19-EF-9012', fuel: 'Electric', type: 'ev', status: 'Active', brand: 'Hyundai', model: 'Creta EV', ownerName: 'Rushikesh Patil', regDate: 'Jun 15, 2023', color: 'Atlas White', year: '2023' },
  { id: '4', name: 'Hero Splendor Plus', number: 'MH-19-JK-1111', fuel: 'Petrol', type: 'bike', status: 'Active', brand: 'Hero', model: 'Splendor Plus', ownerName: 'Rushikesh Patil', regDate: 'Jan 10, 2020', color: 'Black Gold', year: '2020' },
  { id: '5', name: 'Ola S1 Pro', number: 'MH-19-LM-2222', fuel: 'Electric', type: 'scooty', status: 'Active', brand: 'Other', model: 'Ola S1 Pro', ownerName: 'Rushikesh Patil', regDate: 'Aug 14, 2022', color: 'Neo Mint', year: '2022' },
  { id: '6', name: 'Bajaj Freedom 125', number: 'MH-19-NO-3333', fuel: 'CNG', type: 'bike', status: 'Active', brand: 'Bajaj', model: 'Freedom 125', ownerName: 'Rushikesh Patil', regDate: 'Oct 05, 2024', color: 'Caribbean Blue', year: '2024' },
  { id: '7', name: 'Mahindra XUV700', number: 'MH-19-OP-4444', fuel: 'Diesel', type: 'car', status: 'Active', brand: 'Mahindra', model: 'XUV700', ownerName: 'Rushikesh Patil', regDate: 'Dec 18, 2021', color: 'Everest White', year: '2021' },
  { id: '8', name: 'Toyota Innova Hycross', number: 'MH-19-QR-5555', fuel: 'Hybrid', type: 'car', status: 'Active', brand: 'Toyota', model: 'Innova Hycross', ownerName: 'Rushikesh Patil', regDate: 'Feb 22, 2023', color: 'Blackish Ageha Glass Flake', year: '2023' },
];

const initialDocuments = [
  {
    vehicleId: '1',
    key: 'puc',
    label: 'PUC Certificate',
    emoji: '🟢',
    status: 'Valid',
    expiry: 'Dec 31, 2025',
    uploadDate: 'Jan 15, 2025',
    verified: true,
    fields: [
      { l: 'Vehicle Number', v: 'MH-19-AB-1234' },
      { l: 'Owner Name', v: 'Rushikesh Patil' },
      { l: 'PUC Number', v: 'PUC/2024/MH19/78542' },
      { l: 'Issue Date', v: 'Jan 15, 2025' },
      { l: 'Expiry Date', v: 'Dec 31, 2025' },
      { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }
    ],
    note: 'Valid until 31 December 2025'
  },
  {
    vehicleId: '1',
    key: 'rc',
    label: 'RC Book',
    emoji: '🔵',
    status: 'Valid',
    expiry: 'Apr 20, 2037',
    uploadDate: 'Apr 20, 2022',
    verified: true,
    fields: [
      { l: 'Registration No.', v: 'MH-19-AB-1234' },
      { l: 'Owner Name', v: 'Rushikesh Patil' },
      { l: 'Vehicle Class', v: 'Motor Car (LMV)' },
      { l: 'Engine Number', v: 'L15Z3A123456' },
      { l: 'Chassis Number', v: 'MHHRH2G5MCN123456' },
      { l: 'Reg. Date', v: 'Apr 20, 2022' },
      { l: 'Reg. Validity', v: 'Apr 20, 2037' }
    ],
    note: 'Valid until 20 April 2037'
  },
  {
    vehicleId: '1',
    key: 'driving-license',
    label: 'Driving License',
    emoji: '🟣',
    status: 'Valid',
    expiry: 'Sep 11, 2040',
    uploadDate: 'Sep 12, 2022',
    verified: true,
    fields: [
      { l: 'License Number', v: 'MH1920220012345' },
      { l: 'Holder Name', v: 'Rushikesh Patil' },
      { l: 'Date of Birth', v: 'Sep 12, 1998' },
      { l: 'Issue Date', v: 'Sep 12, 2022' },
      { l: 'Expiry Date', v: 'Sep 11, 2040' },
      { l: 'Vehicle Class', v: 'MC, LMV' }
    ],
    note: 'Valid until 11 September 2040'
  },
  {
    vehicleId: '1',
    key: 'insurance',
    label: 'Insurance Policy',
    emoji: '🟡',
    status: 'Expiring Soon',
    expiry: 'Jul 25, 2026',
    uploadDate: 'Jul 25, 2025',
    verified: true,
    fields: [
      { l: 'Policy Number', v: 'OD/2024/MH/00123456' },
      { l: 'Insurer Company', v: 'Bajaj Allianz General' },
      { l: 'Policy Type', v: 'Comprehensive' },
      { l: 'Issue Date', v: 'Jul 25, 2025' },
      { l: 'Expiry Date', v: 'Jul 25, 2026' },
      { l: 'Coverage IDV', v: '₹8,00,000' }
    ],
    note: 'Expires in 5 days'
  },
  {
    vehicleId: '2',
    key: 'puc',
    label: 'PUC Certificate',
    emoji: '🔴',
    status: 'Expired',
    expiry: 'Jan 10, 2025',
    uploadDate: 'Jan 10, 2024',
    verified: false,
    fields: [
      { l: 'Vehicle Number', v: 'MH-19-CD-5678' },
      { l: 'Owner Name', v: 'Rushikesh Patil' },
      { l: 'PUC Number', v: 'PUC/2023/MH19/45231' },
      { l: 'Issue Date', v: 'Jan 10, 2024' },
      { l: 'Expiry Date', v: 'Jan 10, 2025' },
      { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }
    ],
    note: 'Expired on 10 January 2025'
  },
  {
    vehicleId: '2',
    key: 'rc',
    label: 'RC Book',
    emoji: '🔵',
    status: 'Valid',
    expiry: 'Mar 10, 2036',
    uploadDate: 'Mar 10, 2021',
    verified: true,
    fields: [
      { l: 'Registration No.', v: 'MH-19-CD-5678' },
      { l: 'Owner Name', v: 'Rushikesh Patil' },
      { l: 'Vehicle Class', v: 'Scooter (MCWG)' },
      { l: 'Engine Number', v: 'JF50E8123456' },
      { l: 'Chassis Number', v: 'ME4JF503MC8123456' },
      { l: 'Reg. Date', v: 'Mar 10, 2021' },
      { l: 'Reg. Validity', v: 'Mar 10, 2036' }
    ],
    note: 'Valid until 10 March 2036'
  },
  {
    vehicleId: '2',
    key: 'driving-license',
    label: 'Driving License',
    emoji: '🟣',
    status: 'Valid',
    expiry: 'Sep 11, 2040',
    uploadDate: 'Sep 12, 2022',
    verified: true,
    fields: [
      { l: 'License Number', v: 'MH1920220012345' },
      { l: 'Holder Name', v: 'Rushikesh Patil' },
      { l: 'Date of Birth', v: 'Sep 12, 1998' },
      { l: 'Issue Date', v: 'Sep 12, 2022' },
      { l: 'Expiry Date', v: 'Sep 11, 2040' },
      { l: 'Vehicle Class', v: 'MC, LMV' }
    ],
    note: 'Valid until 11 September 2040'
  },
  {
    vehicleId: '2',
    key: 'insurance',
    label: 'Insurance Policy',
    emoji: '🟢',
    status: 'Valid',
    expiry: 'Nov 30, 2026',
    uploadDate: 'Nov 30, 2025',
    verified: true,
    fields: [
      { l: 'Policy Number', v: 'OD/2024/MH/00987654' },
      { l: 'Insurer Company', v: 'HDFC ERGO General' },
      { l: 'Policy Type', v: 'Third Party' },
      { l: 'Issue Date', v: 'Nov 30, 2025' },
      { l: 'Expiry Date', v: 'Nov 30, 2026' },
      { l: 'Coverage IDV', v: '₹2,00,000' }
    ],
    note: 'Valid until 30 November 2026'
  },
  {
    vehicleId: '3',
    key: 'puc',
    label: 'PUC Certificate',
    emoji: '🟢',
    status: 'Valid',
    expiry: 'Feb 28, 2026',
    uploadDate: 'Feb 28, 2025',
    verified: true,
    fields: [
      { l: 'Vehicle Number', v: 'MH-19-EF-9012' },
      { l: 'Owner Name', v: 'Rushikesh Patil' },
      { l: 'PUC Number', v: 'PUC/2025/MH19/99871' },
      { l: 'Issue Date', v: 'Feb 28, 2025' },
      { l: 'Expiry Date', v: 'Feb 28, 2026' },
      { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }
    ],
    note: 'Valid until 28 February 2026'
  },
  {
    vehicleId: '3',
    key: 'rc',
    label: 'RC Book',
    emoji: '🔵',
    status: 'Valid',
    expiry: 'Jun 15, 2038',
    uploadDate: 'Jun 15, 2023',
    verified: true,
    fields: [
      { l: 'Registration No.', v: 'MH-19-EF-9012' },
      { l: 'Owner Name', v: 'Rushikesh Patil' },
      { l: 'Vehicle Class', v: 'Motor Car (EV)' },
      { l: 'Engine Number', v: 'EVHCN123456' },
      { l: 'Chassis Number', v: 'MALE2BKA1PC123456' },
      { l: 'Reg. Date', v: 'Jun 15, 2023' },
      { l: 'Reg. Validity', v: 'Jun 15, 2038' }
    ],
    note: 'Valid until 15 June 2038'
  },
  {
    vehicleId: '3',
    key: 'driving-license',
    label: 'Driving License',
    emoji: '🟣',
    status: 'Valid',
    expiry: 'Sep 11, 2040',
    uploadDate: 'Sep 12, 2022',
    verified: true,
    fields: [
      { l: 'License Number', v: 'MH1920220012345' },
      { l: 'Holder Name', v: 'Rushikesh Patil' },
      { l: 'Date of Birth', v: 'Sep 12, 1998' },
      { l: 'Issue Date', v: 'Sep 12, 2022' },
      { l: 'Expiry Date', v: 'Sep 11, 2040' },
      { l: 'Vehicle Class', v: 'MC, LMV' }
    ],
    note: 'Valid until 11 September 2040'
  },
  {
    vehicleId: '3',
    key: 'insurance',
    label: 'Insurance Policy',
    emoji: '🟢',
    status: 'Valid',
    expiry: 'Mar 15, 2027',
    uploadDate: 'Mar 15, 2026',
    verified: true,
    fields: [
      { l: 'Policy Number', v: 'OD/2025/MH/00456789' },
      { l: 'Insurer Company', v: 'Tata AIG General' },
      { l: 'Policy Type', v: 'Comprehensive (EV)' },
      { l: 'Issue Date', v: 'Mar 15, 2026' },
      { l: 'Expiry Date', v: 'Mar 15, 2027' },
      { l: 'Coverage IDV', v: '₹12,00,000' }
    ],
    note: 'Valid until 15 March 2027'
  }
];

// ── SUB-SCREENS ──

function PlaceholderScreen({ title, onBack }) {
  return (
    <View style={styles.subScreenContainer}>
      <View style={styles.subScreenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.subScreenHeaderTitle}>{title}</Text>
      </View>
      <View style={styles.placeholderContent}>
        <Text style={styles.comingSoonEmoji}>🚀</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonDesc}>We're working hard to bring this feature to you. Stay tuned!</Text>
      </View>
    </View>
  );
}

function SupportScreen({ onBack }) {
  return (
    <View style={styles.subScreenContainer}>
      <View style={styles.subScreenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.subScreenHeaderTitle}>Support & Help</Text>
      </View>
      <ScrollView style={styles.subScreenBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.subScreenContentPadding}>
        <View style={styles.supportCard}>
          <Text style={styles.supportCardTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I sync my vehicle documents?</Text>
            <Text style={styles.faqAnswer}>You can sync documents by clicking the "Connect DigiLocker" or "Connect Parivahan" button when adding or modifying your vehicle details.</Text>
          </View>
          <View style={[styles.faqItem, styles.borderTop]}>
            <Text style={styles.faqQuestion}>Is my data secure?</Text>
            <Text style={styles.faqAnswer}>Yes, all your vehicle and personal information is encrypted and stored securely using industry-standard protocols.</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportCardTitle}>Contact Support</Text>
          <TouchableOpacity style={styles.contactRow} activeOpacity={0.7}>
            <Text style={styles.contactIcon}>📞</Text>
            <View>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+1 (800) 123-4567</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactRow, styles.borderTop]} activeOpacity={0.7}>
            <Text style={styles.contactIcon}>✉️</Text>
            <View>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@roadmate.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportCardTitle}>Report an Issue</Text>
          <Text style={styles.reportText}>Encountered a bug or a service issue? Tap below to report it directly to our technical team.</Text>
          <TouchableOpacity style={styles.reportButton} activeOpacity={0.8}>
            <Text style={styles.reportButtonText}>Report Technical Bug</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function AboutScreen({ onBack }) {
  return (
    <View style={styles.subScreenContainer}>
      <View style={styles.subScreenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.subScreenHeaderTitle}>About Roadmate</Text>
      </View>
      <ScrollView style={styles.subScreenBody} contentContainerStyle={styles.aboutContent} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutLogoContainer}>
          <Text style={styles.aboutLogoText}>RoadMate</Text>
          <Text style={styles.aboutVersionText}>Version 1.0.0</Text>
        </View>

        <View style={styles.aboutDescContainer}>
          <Text style={styles.aboutDescText}>
            Roadmate is your all-in-one vehicle management and mobility platform. Manage your vehicles, documents, nearby services, maintenance tips, and bookings from one place.
          </Text>
        </View>

        <View style={styles.aboutLinksContainer}>
          <TouchableOpacity style={styles.aboutLinkRow} activeOpacity={0.7}>
            <Text style={styles.aboutLinkLabel}>Privacy Policy</Text>
            <Text style={styles.aboutLinkArrow}>❯</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.aboutLinkRow, styles.borderTop]} activeOpacity={0.7}>
            <Text style={styles.aboutLinkLabel}>Terms & Conditions</Text>
            <Text style={styles.aboutLinkArrow}>❯</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.aboutCopyrightText}>© 2026 Roadmate Technologies Pvt. Ltd.</Text>
      </ScrollView>
    </View>
  );
}

export default function CustomerDashboardScreen({ navigation }) {
  // Main states
  const [tab, setTab] = useState('home'); // home | services | personalized
  const [screen, setScreen] = useState(null); // null | add-vehicle | doc | providers | provider-detail | map
  const [vehicles, setVehicles] = useState(defaultVehicles);
  const [documents, setDocuments] = useState(initialDocuments);

  // Persistent storage initialization and sync
  useEffect(() => {
    const loadPersistedData = async () => {
      const persistedVehicles = await loadVehiclesFromStorage(defaultVehicles);
      setVehicles(persistedVehicles);
      const persistedDocs = await loadDocumentsFromStorage(initialDocuments);
      setDocuments(persistedDocs);
    };
    loadPersistedData();
  }, []);

  useEffect(() => {
    saveVehiclesToStorage(vehicles);
  }, [vehicles]);

  useEffect(() => {
    saveDocumentsToStorage(documents);
  }, [documents]);

  // Tips & Maintenance States
  const [bookmarkedTips, setBookmarkedTips] = useState([]);
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
  const [likedTips, setLikedTips] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [recentlyViewedTips, setRecentlyViewedTips] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Notification center state
  const [notifications, setNotifications] = useState([]);

  // Valuation pre-fill state
  const [valuationVehicleId, setValuationVehicleId] = useState(null);

  // Detail screen scroll section state
  const [detailInitialSection, setDetailInitialSection] = useState(null); // null | 'info' | 'activity'

  const handleOpenInsights = useCallback((vehicleId) => {
    setActiveVehicleId(vehicleId || vehicles[0]?.id || '1');
    setDetailInitialSection('info');
    setScreen('vehicle-detail');
  }, [vehicles]);

  // Challan pre-fill state
  const [challanVehicleId, setChallanVehicleId] = useState(null);

  const handleOpenChallan = useCallback((vehicleId) => {
    setChallanVehicleId(vehicleId || null);
    setScreen('challan');
  }, []);

  // Expenses pre-fill state
  const [expenseVehicleId, setExpenseVehicleId] = useState(null);

  const handleOpenExpenseTracker = useCallback((vehicleId) => {
    setExpenseVehicleId(vehicleId || null);
    setScreen('expenses');
  }, []);

  // Fuel & Mileage pre-fill state
  const [fuelVehicleId, setFuelVehicleId] = useState(null);

  const handleOpenFuelTracker = useCallback((vehicleId) => {
    setFuelVehicleId(vehicleId || null);
    setScreen('fuel');
  }, []);

  useEffect(() => {
    const generated = generateNotifications(documents);
    setNotifications(generated);
  }, [documents]);

  const handleNotificationClick = useCallback((notif) => {
    // Mark as Read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, status: 'Read' } : n));

    // Open document
    setTab('personalized');
    setScreen('doc');
    setActiveDoc(notif.docKey);
    setActiveVehicleId(notif.vehicleId);
  }, []);

  const handleToggleOffline = useCallback(() => {
    setIsOffline(prev => !prev);
  }, []);

  const simulateRetry = useCallback(() => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setIsOffline(false);
      Alert.alert('Online', 'Network connection restored successfully!');
    }, 1500);
  }, []);

  const handleBookmarkTipToggle = useCallback((tipId) => {
    setBookmarkedTips(prev =>
      prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId]
    );
  }, []);

  const handleBookmarkVideoToggle = useCallback((vidId) => {
    setBookmarkedVideos(prev =>
      prev.includes(vidId) ? prev.filter(id => id !== vidId) : [...prev, vidId]
    );
  }, []);

  const handleLikeTipToggle = useCallback((tipId) => {
    setLikedTips(prev =>
      prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId]
    );
  }, []);

  const handleLikeVideoToggle = useCallback((vidId) => {
    setLikedVideos(prev =>
      prev.includes(vidId) ? prev.filter(id => id !== vidId) : [...prev, vidId]
    );
  }, []);

  const handleTrackRecentlyViewed = useCallback((tipId) => {
    setRecentlyViewedTips(prev => {
      const filtered = prev.filter(id => id !== tipId);
      return [tipId, ...filtered].slice(0, 5); // store up to 5 recently viewed items
    });
  }, []);

  const [activeDoc, setActiveDoc] = useState('puc');
  const [activeVehicleId, setActiveVehicleId] = useState('1');
  const [formInitialStep, setFormInitialStep] = useState(1);
  const [serviceCategory, setServiceCategory] = useState('Garage');

  const handleUploadDocument = useCallback((vehicleId, docKey, newDoc) => {
    setDocuments(prev => {
      const filtered = prev.filter(d => !(d.key === docKey && d.vehicleId === vehicleId));
      return [...filtered, { ...newDoc, vehicleId }];
    });
  }, []);

  const handleDeleteDocument = useCallback((vehicleId, docKey) => {
    setDocuments(prev => prev.filter(d => !(d.key === docKey && d.vehicleId === vehicleId)));
  }, []);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [navProvider, setNavProvider] = useState(null);

  const [savedProviderIds, setSavedProviderIds] = useState([]);

  const toggleSaveProvider = useCallback((providerId) => {
    setSavedProviderIds(prev =>
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  }, []);

  // Drawer state & animation
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerX = useRef(new Animated.Value(-285)).current;
  const drawerBgOpacity = useRef(new Animated.Value(0)).current;

  // Drawer tracker dropdown
  const [trackerDropdownOpen, setTrackerDropdownOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const loadFavorites = useCallback(async () => {
    try { const data = await getFavorites(); setFavorites(data); } catch (e) { setFavorites([]); }
  }, []);
  useEffect(() => { loadFavorites(); }, [loadFavorites]);

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
    else if (screen === 'providers') setScreen(null);
    else setScreen(null);
  };

  // Drawer links — ordered per spec
  // Home → My Vehicles → Services → Vehicle Hub → Tips & Maintenance
  // → Vehicle Tracker (dropdown) → Favorites → Driving License
  // → Settings → Support & Help → About Roadmate → Logout
  const drawerIcons = {
    home: require('../../assets/drawer_icons/home.png'),
    vehicles: require('../../assets/drawer_icons/my_vehicles.png'),
    services: require('../../assets/drawer_icons/services.png'),
    tips: require('../../assets/drawer_icons/tips_maintainance.png'),
    tracker: require('../../assets/drawer_icons/vehicle_tracker.png'),
    favorites: require('../../assets/drawer_icons/favorites.png'),
    license: require('../../assets/drawer_icons/driving_license.png'),
    settings: require('../../assets/drawer_icons/settings.png'),
    support: require('../../assets/drawer_icons/support_help.png'),
    about: require('../../assets/drawer_icons/about_roadmate.png'),
    logout: require('../../assets/drawer_icons/logout.png'),
  };
  const drawerLinks = [
    {
      id: 'home',
      icon: drawerIcons.home,
      label: 'Home',
      isActive: tab === 'home' && screen === null,
      action: () => { closeDrawer(); setTab('home'); setScreen(null); }
    },
    {
      id: 'vehicles',
      icon: drawerIcons.vehicles,
      label: 'My Vehicles',
      isActive: tab === 'personalized' && screen === null,
      action: () => { closeDrawer(); setTab('personalized'); setScreen(null); }
    },
    {
      id: 'services',
      icon: drawerIcons.services,
      label: 'Services',
      isActive: tab === 'services' && screen === null,
      action: () => { closeDrawer(); setTab('services'); setScreen(null); }
    },
    // Standalone Vehicle Hub removed from drawer
    {
      id: 'tips',
      icon: drawerIcons.tips,
      label: 'Tips & Maintenance',
      isActive: screen === 'tips',
      action: () => { closeDrawer(); setScreen('tips'); }
    },
    // Vehicle Tracker collapsible dropdown — rendered separately in JSX
    { id: '__tracker_dropdown__', isDropdown: true },
    {
      id: 'favorites',
      icon: drawerIcons.favorites,
      label: 'Favorites',
      isActive: screen === 'favorites',
      action: () => { closeDrawer(); loadFavorites(); setScreen('favorites'); }
    },
    {
      id: 'license',
      icon: drawerIcons.license,
      label: 'Driving License',
      isActive: screen === 'driving-license',
      action: () => { closeDrawer(); setScreen('driving-license'); }
    },
    {
      id: 'settings',
      icon: drawerIcons.settings,
      label: 'Settings',
      isActive: screen === 'settings',
      action: () => { closeDrawer(); setScreen('settings'); }
    },
    {
      id: 'support',
      icon: drawerIcons.support,
      label: 'Support & Help',
      isActive: screen === 'support',
      action: () => { closeDrawer(); setScreen('support'); }
    },
    {
      id: 'about',
      icon: drawerIcons.about,
      label: 'About Roadmate',
      isActive: screen === 'about',
      action: () => { closeDrawer(); setScreen('about'); }
    },
    {
      id: 'logout',
      icon: drawerIcons.logout,
      label: 'Logout',
      isActive: false,
      action: () => {
        closeDrawer();
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => handleLogout() }
          ]
        );
      }
    }
  ];

  // Vehicle Tracker sub-items (shown when dropdown is open)
  const trackerSubItems = [
    { id: 'vt-value', icon: '📈', label: 'Vehicle Value', action: () => { closeDrawer(); setValuationVehicleId(null); setScreen('valuation'); } },
    { id: 'vt-expense', icon: '💰', label: 'Expense Tracker', action: () => { closeDrawer(); setExpenseVehicleId(null); setScreen('expenses'); } },
    { id: 'vt-fuel', icon: '⛽', label: 'Fuel & Mileage', action: () => { closeDrawer(); setFuelVehicleId(null); setScreen('fuel'); } },
  ];

  // Render function depending on screening states
  const renderContent = () => {
    if (screen === 'add-vehicle') {
      return (
        <AddVehicleScreen
          vehicles={vehicles}
          onBack={navigateBack}
          initialStep={1}
          onSave={(v) => {
            setVehicles(prev => [...prev, v]);

            // Add mock documents in service database
            addMockDocumentsForVehicle(v);

            // Add documents to React state
            const newDocs = [
              {
                vehicleId: v.id,
                key: 'rc',
                label: 'RC Book',
                emoji: '🔵',
                status: 'Valid',
                expiry: v.rcExpiry || '2037-04-20',
                uploadDate: v.regDate || 'Apr 20, 2022',
                verified: true,
                fields: [
                  { l: 'Registration No.', v: v.number },
                  { l: 'Owner Name', v: v.ownerName || 'Rushikesh Patil' },
                  { l: 'Vehicle Class', v: v.type === 'car' ? 'Motor Car (LMV)' : 'Scooter (MCWG)' },
                  { l: 'Engine Number', v: 'L15Z3A123456' },
                  { l: 'Chassis Number', v: 'MHHRH2G5MCN123456' },
                  { l: 'Reg. Date', v: v.regDate || 'Apr 20, 2022' },
                  { l: 'Reg. Validity', v: v.rcExpiry || '2037-04-20' }
                ],
                note: 'Valid until ' + (v.rcExpiry || '2037-04-20')
              },
              {
                vehicleId: v.id,
                key: 'puc',
                label: 'PUC Certificate',
                emoji: '🟢',
                status: 'Valid',
                expiry: v.pucExpiry || '2026-12-31',
                uploadDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                verified: true,
                fields: [
                  { l: 'Vehicle Number', v: v.number },
                  { l: 'Owner Name', v: v.ownerName || 'Rushikesh Patil' },
                  { l: 'PUC Number', v: `PUC/${v.year}/MH19/78542` },
                  { l: 'Issue Date', v: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                  { l: 'Expiry Date', v: v.pucExpiry || '2026-12-31' },
                  { l: 'Testing Center', v: 'Jalgaon PUC Center, NH-6' }
                ],
                note: 'Valid until ' + (v.pucExpiry || '2026-12-31')
              },
              {
                vehicleId: v.id,
                key: 'insurance',
                label: 'Insurance Policy',
                emoji: '🟢',
                status: 'Valid',
                expiry: v.insuranceExpiry || '2026-06-25',
                uploadDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                verified: true,
                fields: [
                  { l: 'Policy Number', v: 'OD/' + v.year + '/MH/' + Math.floor(10000000 + Math.random() * 90000000) },
                  { l: 'Insurer Company', v: 'Bajaj Allianz General' },
                  { l: 'Policy Type', v: 'Comprehensive' },
                  { l: 'Issue Date', v: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                  { l: 'Expiry Date', v: v.insuranceExpiry || '2026-06-25' },
                  { l: 'Coverage IDV', v: '₹8,00,000' }
                ],
                note: 'Valid until ' + (v.insuranceExpiry || '2026-06-25')
              }
            ];
            setDocuments(prev => [...prev, ...newDocs]);

            setTab('personalized');
            setScreen(null);
          }}
        />
      );
    }
    if (screen === 'vehicle-detail') {
      return (
        <VehicleDetailScreen
          vehicleId={activeVehicleId}
          vehicles={vehicles}
          documents={documents}
          initialSection={detailInitialSection}
          onBack={() => { setScreen(null); setDetailInitialSection(null); }}
          onEdit={(id, step) => {
            setActiveVehicleId(id);
            setFormInitialStep(step || 1);
            setScreen('edit-vehicle');
          }}
          onDelete={(id) => {
            setVehicles(prev => prev.filter(v => v.id !== id));
            deleteMockDocumentsForVehicle(id);
            setDocuments(prev => prev.filter(d => d.vehicleId !== id));
            setScreen(null);
          }}
          onOpenDoc={handleOpenDoc}
          onOpenVehicleValuation={(id) => {
            setValuationVehicleId(id);
            setScreen('valuation');
          }}
          onOpenChallan={handleOpenChallan}
          onOpenExpenseTracker={handleOpenExpenseTracker}
          onOpenFuelTracker={handleOpenFuelTracker}
        />
      );
    }
    if (screen === 'edit-vehicle') {
      const vehicleToEdit = vehicles.find(v => v.id === activeVehicleId);
      return (
        <AddVehicleScreen
          vehicles={vehicles}
          vehicle={vehicleToEdit}
          initialStep={formInitialStep}
          onBack={() => setScreen('vehicle-detail')}
          onSave={(updated) => {
            setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v));

            // Sync updated info in document service & state
            updateMockDocumentsForVehicle(updated);
            setDocuments(prev => prev.map(d => {
              if (d.vehicleId === updated.id) {
                let expiry = d.expiry;
                if (d.key === 'rc') expiry = updated.rcExpiry || d.expiry;
                if (d.key === 'puc') expiry = updated.pucExpiry || d.expiry;
                if (d.key === 'insurance') expiry = updated.insuranceExpiry || d.expiry;

                return {
                  ...d,
                  expiry,
                  note: `Valid until ${expiry}`,
                  fields: d.fields.map(f => {
                    if (f.l === 'Vehicle Number' || f.l === 'Registration No.') {
                      return { ...f, v: updated.number };
                    }
                    if (f.l === 'Owner Name') {
                      return { ...f, v: updated.ownerName || f.v };
                    }
                    return f;
                  })
                };
              }
              return d;
            }));

            setScreen('vehicle-detail');
          }}
        />
      );
    }
    if (screen === 'doc') {
      return (
        <DocumentDetailScreen
          docType={activeDoc}
          vehicleId={activeVehicleId}
          documents={documents}
          onDeleteDocument={handleDeleteDocument}
          onReplaceDocument={handleUploadDocument}
          onBack={() => {
            if (activeVehicleId) {
              setScreen('vehicle-detail');
            } else {
              setScreen(null);
            }
          }}
        />
      );
    }
    if (screen === 'providers') {
      return (
        <ProvidersListScreen
          category={serviceCategory}
          onBack={navigateBack}
          onSelect={(p) => {
            setSelectedProvider(p);
            setScreen('provider-detail');
          }}
          savedProviderIds={savedProviderIds}
          toggleSaveProvider={toggleSaveProvider}
        />
      );
    }
    if (screen === 'provider-detail') {
      return (
        <ProviderDetailsScreen
          provider={selectedProvider}
          category={serviceCategory}
          vehicles={vehicles}
          onBack={navigateBack}
          onNavigate={(p) => {
            setNavProvider(p);
            setScreen('map');
          }}
          savedProviderIds={savedProviderIds}
          toggleSaveProvider={toggleSaveProvider}
        />
      );
    }
    if (screen === 'map') {
      return <MapNavigationScreen provider={navProvider} onBack={navigateBack} />;
    }
    if (screen === 'tips') {
      return (
        <TipsScreen
          onBack={navigateBack}
          bookmarkedTips={bookmarkedTips}
          bookmarkedVideos={bookmarkedVideos}
          likedTips={likedTips}
          likedVideos={likedVideos}
          recentlyViewedTips={recentlyViewedTips}
          onBookmarkTipToggle={handleBookmarkTipToggle}
          onBookmarkVideoToggle={handleBookmarkVideoToggle}
          onLikeTipToggle={handleLikeTipToggle}
          onLikeVideoToggle={handleLikeVideoToggle}
          onTrackRecentlyViewed={handleTrackRecentlyViewed}
          onOpenServicesCategory={handleOpenServices}
        />
      );
    }
    if (screen === 'valuation') {
      return (
        <VehicleValuationScreen
          vehicles={vehicles}
          initialVehicleId={valuationVehicleId}
          onBack={navigateBack}
        />
      );
    }
    if (screen === 'insights' || screen === 'vehicle-info') {
      return (
        <VehicleDetailScreen
          vehicleId={activeVehicleId || vehicles[0]?.id || '1'}
          vehicles={vehicles}
          documents={documents}
          initialSection="info"
          onBack={navigateBack}
          onEdit={(id, step) => {
            setActiveVehicleId(id);
            setFormInitialStep(step || 1);
            setScreen('edit-vehicle');
          }}
          onDelete={(id) => {
            setVehicles(prev => prev.filter(v => v.id !== id));
            deleteMockDocumentsForVehicle(id);
            setDocuments(prev => prev.filter(d => d.vehicleId !== id));
            setScreen(null);
          }}
          onOpenDoc={handleOpenDoc}
          onOpenVehicleValuation={(id) => {
            setValuationVehicleId(id);
            setScreen('valuation');
          }}
          onOpenChallan={handleOpenChallan}
          onOpenExpenseTracker={handleOpenExpenseTracker}
          onOpenFuelTracker={handleOpenFuelTracker}
        />
      );
    }
    if (screen === 'challan') {
      return (
        <ChallanScreen
          vehicles={vehicles}
          initialVehicleId={challanVehicleId}
          onBack={navigateBack}
        />
      );
    }
    if (screen === 'expenses') {
      return (
        <ExpenseTrackerScreen
          vehicles={vehicles}
          initialVehicleId={expenseVehicleId}
          onBack={navigateBack}
        />
      );
    }
    if (screen === 'fuel') {
      return (
        <FuelTrackerScreen
          vehicles={vehicles}
          initialVehicleId={fuelVehicleId}
          onBack={navigateBack}
        />
      );
    }
    if (screen === 'driving-license') {
      return (
        <DrivingLicenseScreen
          onBack={navigateBack}
        />
      );
    }
    if (screen === 'favorites') {
      return (
        <FavoritesScreen
          favorites={favorites}
          onRemove={async (pid) => { await removeFavorite(pid); loadFavorites(); }}
          onBack={navigateBack}
        />
      );
    }
    if (screen === 'settings') {
      return <PlaceholderScreen title="Settings" onBack={navigateBack} />;
    }
    if (screen === 'support') {
      return <SupportScreen onBack={navigateBack} />;
    }
    if (screen === 'about') {
      return <AboutScreen onBack={navigateBack} />;
    }

    // Default Tab Rendering
    switch (tab) {
      case 'home':
        return (
          <DashboardTab
            vehicles={vehicles}
            documents={documents}
            backendStatus={backendStatus}
            onOpenDrawer={openDrawer}
            onAddVehicle={() => {
              setFormInitialStep(1);
              setScreen('add-vehicle');
            }}
            onOpenDoc={handleOpenDoc}
            onOpenServices={handleOpenServices}
            onOpenInfoHub={() => { setTab('personalized'); setScreen(null); }}
            onOpenProfile={() => { setTab('personalized'); setScreen(null); }}
            onOpenTips={() => setScreen('tips')}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onCheckValuation={(vehicleId) => {
              setValuationVehicleId(vehicleId);
              setScreen('valuation');
            }}
            onOpenVehicleInsights={handleOpenInsights}
            onOpenExpenseTracker={handleOpenExpenseTracker}
            onOpenFuelTracker={handleOpenFuelTracker}
            onOpenChallan={handleOpenChallan}
          />
        );
      case 'services':
        return (
          <ServicesHomeScreen
            onBack={() => setTab('home')}
            onSelectCategory={(cat) => {
              setServiceCategory(cat);
              setScreen('providers');
            }}
            savedProviderIds={savedProviderIds}
            toggleSaveProvider={toggleSaveProvider}
            onSelectProvider={(p) => {
              setSelectedProvider(p);
              setServiceCategory(p.category);
              setScreen('provider-detail');
            }}
          />
        );
      // Standalone Vehicle Hub tab view removed
      case 'personalized':
        return (
          <PersonalizedScreen
            vehicles={vehicles}
            onLogout={handleLogout}
            onOpenDoc={handleOpenDoc}
            onOpenVehicle={(id) => {
              setActiveVehicleId(id);
              setScreen('vehicle-detail');
            }}
            savedProviderIds={savedProviderIds}
            toggleSaveProvider={toggleSaveProvider}
            onSelectProvider={(p) => {
              setSelectedProvider(p);
              setServiceCategory(p.category);
              setScreen('provider-detail');
            }}
            onAddVehicle={() => {
              setFormInitialStep(1);
              setScreen('add-vehicle');
            }}
            onOpenDrivingLicense={() => setScreen('driving-license')}
          />
        );
      case 'tracker':
        return (
          <VehicleTrackerScreen
            vehicles={vehicles}
            onBack={() => setTab('home')}
            onOpenVehicleInfo={(id) => {
              setInsightsVehicleId(id);
              setScreen('vehicle-info');
            }}
            onOpenVehicleValuation={(id) => {
              setValuationVehicleId(id);
              setScreen('valuation');
            }}
            onOpenChallan={handleOpenChallan}
            onOpenExpenseTracker={handleOpenExpenseTracker}
            onOpenFuelTracker={handleOpenFuelTracker}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pageScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>⚠️ Working Offline. Check connection.</Text>
            <TouchableOpacity onPress={simulateRetry} style={styles.retryButton} disabled={isRetrying}>
              {isRetrying ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.retryButtonText}>Retry</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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

            <TouchableOpacity onPress={() => setTab('tracker')} style={styles.navButton} activeOpacity={0.7}>
              <Text style={[styles.navIcon, tab === 'tracker' ? styles.navIconActive : null]}>📊</Text>
              <Text style={[styles.navText, tab === 'tracker' ? styles.navTextActive : null]}>Vehicle Tracker</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTab('personalized')} style={styles.navButton} activeOpacity={0.7}>
              <Text style={[styles.navIcon, tab === 'personalized' ? styles.navIconActive : null]}>🚗</Text>
              <Text style={[styles.navText, tab === 'personalized' ? styles.navTextActive : null]}>My Vehicles</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
              <View style={styles.drawerHeaderTopRow}>
                <Text style={styles.drawerLogoText}>RoadMate</Text>
                <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => { closeDrawer(); setTab('personalized'); setScreen(null); }}
                style={styles.drawerProfileSection}
                activeOpacity={0.8}
              >
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>RP</Text>
                </View>
                <View style={styles.drawerProfileDetails}>
                  <Text style={styles.drawerProfileName}>Rushikesh Patil</Text>
                  <Text style={styles.drawerProfileEmail}>rp6870888@gmail.com</Text>
                  <View style={styles.editProfileButton}>
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Navigation links */}
            <ScrollView style={styles.drawerLinksContainer} contentContainerStyle={styles.drawerLinksContent} showsVerticalScrollIndicator={false}>
              {drawerLinks.map((link) => {
                // Render the Vehicle Tracker dropdown item
                if (link.isDropdown) {
                  return (
                    <View key="tracker-dropdown">
                      <TouchableOpacity
                        onPress={() => setTrackerDropdownOpen(p => !p)}
                        style={[styles.drawerLink, (tab === 'tracker' && screen === null) ? styles.drawerLinkActive : null]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.drawerLinkRow}>
                          <Text style={[styles.drawerLinkIcon, (tab === 'tracker' && screen === null) ? styles.drawerLinkIconActive : null]}>📊</Text>
                          <Text style={[styles.drawerLinkLabel, (tab === 'tracker' && screen === null) ? styles.drawerLinkLabelActive : null]}>Vehicle Tracker</Text>
                        </View>
                        <Text style={styles.drawerLinkArrow}>{trackerDropdownOpen ? '▼' : '❯'}</Text>
                      </TouchableOpacity>
                      {/* Open tracker hub */}
                      {trackerDropdownOpen && (
                        <View style={styles.drawerSubMenu}>
                          <TouchableOpacity
                            style={styles.drawerSubItem}
                            onPress={() => { closeDrawer(); setTrackerDropdownOpen(false); setTab('tracker'); setScreen(null); }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.drawerSubItemIcon}>📊</Text>
                            <Text style={styles.drawerSubItemText}>Open Hub</Text>
                          </TouchableOpacity>
                          {trackerSubItems.map(sub => (
                            <TouchableOpacity
                              key={sub.id}
                              style={styles.drawerSubItem}
                              onPress={() => { setTrackerDropdownOpen(false); sub.action(); }}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.drawerSubItemIcon}>{sub.icon}</Text>
                              <Text style={styles.drawerSubItemText}>{sub.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                }
                // Regular drawer item
                return (
                  <TouchableOpacity
                    key={link.id}
                    onPress={link.action}
                    style={[styles.drawerLink, link.isActive ? styles.drawerLinkActive : null]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.drawerLinkRow}>
                      <Image
                        source={link.icon}
                        style={styles.drawerLinkIcon}
                        resizeMode="contain"
                      />
                      <Text style={[styles.drawerLinkLabel, link.isActive ? styles.drawerLinkLabelActive : null]}>
                        {link.label}
                      </Text>
                    </View>
                    {!link.isActive && <Text style={styles.drawerLinkArrow}>❯</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Footer with version */}
            <View style={styles.drawerFooter}>
              <Text style={styles.footerLogoText}>RoadMate</Text>
              <Text style={styles.footerVersionText}>Version 1.0.0</Text>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

// ── TEMPORARY VIEW STUBS FOR CORE SUB-MODULES ──
// These will be fully replaced with standalone files and premium layout screens
// ── FAVORITES SCREEN (inline component, backend-ready) ──
function FavoritesScreen({ favorites = [], onRemove, onBack }) {
  const CATEGORY_ICONS = {
    'Fuel Station': '⛽', 'Garage': '🔧', 'Accessories': '🛍️',
    'Vehicle Dealer': '🚗', 'Tyre Shop': '⚫', 'Washing': '🚧', 'Insurance': '🛡️',
  };
  const CATEGORY_FILTER_OPTIONS = ['All', 'Fuel Station', 'Garage', 'Accessories', 'Vehicle Dealer'];
  const [catFilter, setCatFilter] = React.useState('All');
  const displayed = catFilter === 'All' ? favorites : favorites.filter(f => f.category === catFilter);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#1E293B', paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
            <Text style={{ fontSize: 22, color: '#FFFFFF' }}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFFFFF' }}>❤️ Favorites</Text>
            <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 1 }}>{favorites.length} saved item{favorites.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: '#FFF', paddingVertical: 10, maxHeight: 52 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {CATEGORY_FILTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1.5, borderColor: catFilter === opt ? '#2563EB' : '#E2E8F0', backgroundColor: catFilter === opt ? '#2563EB' : '#FFF' }}
            onPress={() => setCatFilter(opt)}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: catFilter === opt ? '#FFF' : '#475569' }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {displayed.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 14 }}>❤️</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>No Favorites Yet</Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6 }}>Browse Services and save your favourite providers here.</Text>
          </View>
        ) : (
          displayed.map(item => (
            <FavoriteCard key={item.id} item={item} onRemove={onRemove} />
          ))
        )}
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  pageScroll: {
    flex: 1,
    width: '100%',
  },
  pageScrollContent: {
    flexGrow: 1,
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
    width: 290,
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
    paddingTop: 50,
  },
  drawerHeader: {
    backgroundColor: '#1E3FAA',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  drawerHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  drawerLogoText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawerProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  drawerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  drawerAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3FAA',
  },
  drawerProfileDetails: {
    flex: 1,
  },
  drawerProfileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  drawerProfileEmail: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    marginTop: 1,
    marginBottom: 6,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  drawerLinksContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  drawerLinksContent: {
    paddingBottom: 30,
  },
  drawerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  drawerLinkActive: {
    backgroundColor: '#EEF2FF',
  },
  drawerLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerLinkIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  drawerLinkIconActive: {
    opacity: 1,
  },
  drawerLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  drawerLinkLabelActive: {
    color: '#1E3FAA',
    fontWeight: '700',
  },
  drawerLinkArrow: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  // Drawer sub-menu (Vehicle Tracker dropdown)
  drawerSubMenu: {
    backgroundColor: '#F8FAFC',
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#BFDBFE',
    marginBottom: 4,
  },
  drawerSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  drawerSubItemIcon: {
    fontSize: 16,
  },
  drawerSubItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  drawerFooter: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  footerLogoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  footerVersionText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  // Sub-screen layout
  subScreenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  subScreenHeader: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 22,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  subScreenHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  comingSoonEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3FAA',
    marginBottom: 8,
  },
  comingSoonDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  subScreenBody: {
    flex: 1,
  },
  subScreenContentPadding: {
    padding: 16,
  },
  supportCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  supportCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3FAA',
    marginBottom: 16,
  },
  faqItem: {
    paddingVertical: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 8,
    paddingTop: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  reportText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  reportButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  aboutContent: {
    alignItems: 'center',
    padding: 24,
  },
  aboutLogoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  aboutLogoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E3FAA',
    letterSpacing: 1,
  },
  aboutVersionText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  aboutDescContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutDescText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'center',
  },
  aboutLinksContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  aboutLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  aboutLinkArrow: {
    fontSize: 12,
    color: '#94A3B8',
  },
  aboutCopyrightText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 20,
  },
  offlineBanner: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
});
