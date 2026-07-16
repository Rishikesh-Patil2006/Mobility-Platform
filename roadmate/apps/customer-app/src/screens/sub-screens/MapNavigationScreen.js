import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MapNavigationScreen({ provider, onBack }) {
  const [started, setStarted] = useState(false);

  if (!provider) return null;

  const etaMinutes = Math.round(parseFloat(provider.distance) * 3.5) || 3;

  return (
    <View style={styles.container}>
      {/* ── Simulated Map Area ── */}
      <View style={styles.mapArea}>
        {/* Grass background green tint */}
        <View style={styles.mapBackground} />

        {/* Roads Grid (drawn using Views) */}
        <View style={[styles.roadHorizontal, { top: '45%' }]} />
        <View style={[styles.roadHorizontal, { top: '70%' }]} />
        <View style={[styles.roadVertical, { left: '45%' }]} />
        <View style={[styles.roadVertical, { left: '20%' }]} />
        <View style={[styles.roadVertical, { left: '75%' }]} />

        {/* Blocks / Buildings */}
        <View style={[styles.mapBlock, { top: '5%', left: '5%', width: '35%', height: '35%' }]} />
        <View style={[styles.mapBlock, { top: '5%', left: '50%', width: '20%', height: '35%' }]} />
        <View style={[styles.mapBlock, { top: '5%', left: '80%', width: '15%', height: '20%' }]} />
        <View style={[styles.mapBlock, { top: '50%', left: '5%', width: '12%', height: '15%' }]} />
        <View style={[styles.mapBlock, { top: '50%', left: '50%', width: '22%', height: '15%' }]} />
        <View style={[styles.mapBlock, { top: '75%', left: '50%', width: '22%', height: '20%' }]} />

        {/* Active Route Path highlighted in blue */}
        <View style={styles.routePathLine} />

        {/* User Current Location Dot */}
        <View style={styles.userLocationMarkerOuter}>
          <View style={styles.userLocationMarkerInner} />
        </View>

        {/* Destination Pin Marker */}
        <View style={styles.destinationPinWrapper}>
          <View style={styles.pinBubble}>
            <Text style={styles.pinText}>📍</Text>
          </View>
        </View>

        {/* Floating Back Button Overlay */}
        <TouchableOpacity onPress={onBack} style={styles.floatingBackButton} activeOpacity={0.7}>
          <Text style={styles.floatArrow}>←</Text>
        </TouchableOpacity>

        {/* Map engine label overlay */}
        <View style={styles.mapProviderLabel}>
          <Text style={styles.mapProviderText}>MapMyIndia</Text>
        </View>

        {/* Float tags */}
        <View style={styles.userPositionBubble}>
          <Text style={styles.userPositionText}>📍 Your Location</Text>
        </View>

        <View style={styles.destPositionBubble}>
          <Text style={styles.destPositionName} numberOfLines={1}>{provider.name}</Text>
          <Text style={styles.destPositionSub}>Destination</Text>
        </View>
      </View>

      {/* ── Navigation Bottom Panel ── */}
      <View style={styles.infoPanel}>
        {/* Pull handle styling */}
        <View style={styles.pullHandle} />

        <Text style={styles.providerName}>{provider.name}</Text>
        <Text style={styles.providerAddress}>{provider.address}</Text>

        {/* Route Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statItem, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.statEmoji}>🧭</Text>
            <Text style={[styles.statBoldText, { color: '#2563EB' }]}>{provider.distance}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          
          <View style={[styles.statItem, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.statEmoji}>🕒</Text>
            <Text style={[styles.statBoldText, { color: '#16A34A' }]}>{etaMinutes} min</Text>
            <Text style={styles.statLabel}>ETA</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: '#FFFBEB' }]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={[styles.statBoldText, { color: '#D97706' }]}>Light</Text>
            <Text style={styles.statLabel}>Traffic</Text>
          </View>
        </View>

        {/* Direction Description path */}
        <View style={styles.viaRow}>
          <Text style={styles.viaIcon}>🚗</Text>
          <Text style={styles.viaText}>Via MG Road → Station Road → NH-6</Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          onPress={() => setStarted(!started)}
          style={[styles.startButton, started ? styles.startButtonActive : null]}
          activeOpacity={0.88}
        >
          <Text style={styles.startButtonText}>
            {started ? 'Navigation Started ✓' : 'Start Navigation'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    minHeight: 300,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8F4E8', // Light grassy green
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  mapBlock: {
    position: 'absolute',
    backgroundColor: '#C8D8C8', // Darker grass/park block
    borderRadius: 12,
  },
  routePathLine: {
    position: 'absolute',
    left: '48%', // Middle vertical road
    top: '30%',
    width: 6,
    height: '42%',
    backgroundColor: '#2563EB', // Blue route path
    borderStyle: 'dashed',
    borderRadius: 3,
  },
  userLocationMarkerOuter: {
    position: 'absolute',
    left: '45%',
    top: '70%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: 'white',
  },
  destinationPinWrapper: {
    position: 'absolute',
    left: '45%',
    top: '26%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 14,
  },
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  floatArrow: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapProviderLabel: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  mapProviderText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  },
  userPositionBubble: {
    position: 'absolute',
    left: '25%',
    top: '64%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userPositionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  destPositionBubble: {
    position: 'absolute',
    left: '24%',
    top: '18%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  destPositionName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    maxWidth: 100,
  },
  destPositionSub: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 2,
  },
  infoPanel: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
    marginTop: -24,
  },
  pullHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  providerAddress: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 14,
    marginBottom: 4,
  },
  statBoldText: {
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  viaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    gap: 8,
  },
  viaIcon: {
    fontSize: 12,
  },
  viaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  startButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  startButtonActive: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
