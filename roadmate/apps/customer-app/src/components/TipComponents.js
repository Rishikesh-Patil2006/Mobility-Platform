import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Share
} from 'react-native';

const { width } = Dimensions.get('window');

// Mapped local assets
const serviceImages = {
  car_wash: require('../../assets/services_images/car_wash.jpg'),
  denting: require('../../assets/services_images/denting&painting.jpg'),
  garage: require('../../assets/services_images/garage.jpg'),
  puc: require('../../assets/services_images/puc center.jpg'),
  service: require('../../assets/services_images/service center.jpg'),
  towing: require('../../assets/services_images/towing.jpg'),
  placeholder: require('../../assets/vehicle_placeholder.png')
};

// ── CATEGORY CHIP ──
export const CategoryChip = React.memo(function CategoryChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : null]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

// ── TIP CARD ──
export const TipCard = React.memo(function TipCard({ tip, bookmarked, onBookmarkToggle, onPress }) {
  const imageSource = serviceImages[tip.imageKey] || serviceImages.placeholder;

  return (
    <TouchableOpacity
      style={styles.tipCardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={imageSource} style={styles.tipCardImg} resizeMode="cover" />
      <View style={styles.tipCardBadgeRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{tip.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.floatingFavBtn}
          onPress={onBookmarkToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.favIcon}>{bookmarked ? '⭐️' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipCardContent}>
        <Text style={styles.tipCardTitle} numberOfLines={2}>{tip.title}</Text>
        <Text style={styles.tipCardDesc} numberOfLines={2}>{tip.description}</Text>

        <View style={styles.tipCardFooter}>
          <Text style={styles.tipCardMeta}>⏳ {tip.readTime} · 👤 {tip.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// ── FEATURED BANNER ──
export const FeaturedBanner = React.memo(function FeaturedBanner({ tip, onPress }) {
  const imageSource = serviceImages[tip.imageKey] || serviceImages.placeholder;

  return (
    <TouchableOpacity
      style={styles.featuredContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={imageSource} style={styles.featuredImg} resizeMode="cover" />
      <View style={styles.featuredOverlay} />

      <View style={styles.featuredContent}>
        <View style={styles.featuredTag}>
          <Text style={styles.featuredTagText}>🔥 FEATURED GUIDE</Text>
        </View>
        <Text style={styles.featuredTitle} numberOfLines={2}>{tip.title}</Text>
        <Text style={styles.featuredDesc} numberOfLines={1}>{tip.description}</Text>
        <Text style={styles.featuredMeta}>⏳ {tip.readTime} · 📅 {tip.publishDate}</Text>
      </View>
    </TouchableOpacity>
  );
});

// ── VIDEO CARD (REEL THUMBNAIL) ──
export const VideoCard = React.memo(function VideoCard({ video, bookmarked, onBookmarkToggle, onPress }) {
  const imageSource = serviceImages[video.imageKey] || serviceImages.placeholder;

  return (
    <TouchableOpacity
      style={styles.videoCardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={imageSource} style={styles.videoCardImg} resizeMode="cover" />
      <View style={styles.videoCardDuration}>
        <Text style={styles.videoCardDurationText}>🎬 {video.duration}</Text>
      </View>

      <View style={styles.videoCardContent}>
        <View style={styles.videoCardCategoryBox}>
          <Text style={styles.videoCardCategoryText}>{video.category}</Text>
        </View>
        <Text style={styles.videoCardTitle} numberOfLines={1}>{video.title}</Text>
      </View>
    </TouchableOpacity>
  );
});

// ── SIMULATED VIDEO PLAYER ──
export const VideoPlayer = React.memo(function VideoPlayer({ video, isMuted, onMuteToggle }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const durationSec = 45; // Simulated 45s duration

  // Simulate Buffering Loader on Mount
  useEffect(() => {
    setLoading(true);
    setProgress(0);
    setSeconds(0);
    const loadTimeout = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(loadTimeout);
  }, [video]);

  // Handle Simulated Video Progression Timer
  useEffect(() => {
    if (loading || !isPlaying) return;

    const interval = setInterval(() => {
      setSeconds((prevSec) => {
        const nextSec = prevSec + 1;
        if (nextSec >= durationSec) {
          setProgress(100);
          setIsPlaying(false);
          return durationSec;
        } else {
          setProgress((nextSec / durationSec) * 100);
          return nextSec;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, isPlaying, video]);

  const handleReplay = () => {
    setProgress(0);
    setSeconds(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={[styles.playerContainer, isFullscreen ? styles.playerFullscreen : null]}>
      {/* Video Content Graphic */}
      <Image
        source={serviceImages[video.imageKey] || serviceImages.placeholder}
        style={styles.playerVideoImage}
        resizeMode="cover"
      />
      <View style={styles.playerShadowOverlay} />

      {/* Buffering Indicator */}
      {loading && (
        <View style={styles.playerLoader}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.playerLoaderText}>Buffering Reel...</Text>
        </View>
      )}

      {/* Play/Pause Center Indicator */}
      {!loading && !isPlaying && (
        <TouchableOpacity style={styles.centerPlayBtn} onPress={togglePlay} activeOpacity={0.8}>
          <Text style={styles.centerPlayEmoji}>▶️</Text>
        </TouchableOpacity>
      )}

      {/* Floating Action Controls */}
      <View style={styles.playerControlOverlay}>

        {/* Info panel */}
        <View style={styles.playerInfoRow}>
          <View style={styles.playerCategoryPill}>
            <Text style={styles.playerCategoryText}>{video.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.playerTitle}>{video.title}</Text>
          <Text style={styles.playerDesc}>Quick instructional video on maintaining performance.</Text>
        </View>

        {/* Progress Bar & Buttons */}
        <View style={styles.playerBottomActions}>

          {/* Timeline Row */}
          <View style={styles.timelineRow}>
            <Text style={styles.timelineText}>{formatTime(seconds)}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.timelineText}>{formatTime(durationSec)}</Text>
          </View>

          {/* Quick Toolbar */}
          <View style={styles.toolbarRow}>
            <View style={styles.toolbarLeft}>
              <TouchableOpacity onPress={togglePlay} style={styles.toolbarBtn}>
                <Text style={styles.toolbarEmoji}>{isPlaying ? '⏸️' : '▶️'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onMuteToggle} style={styles.toolbarBtn}>
                <Text style={styles.toolbarEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleReplay} style={styles.toolbarBtn}>
                <Text style={styles.toolbarEmoji}>🔄</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setIsFullscreen(!isFullscreen)}
              style={styles.toolbarBtn}
            >
              <Text style={styles.toolbarEmoji}>{isFullscreen ? '📴' : '📺'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

// ── STYLE SHEET ──
const styles = StyleSheet.create({
  // Category Chips
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: 'white',
  },

  // Tip Cards
  tipCardContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  tipCardImg: {
    width: '100%',
    height: 160,
  },
  tipCardBadgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  floatingFavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favIcon: {
    fontSize: 14,
    color: '#F59E0B',
  },
  tipCardContent: {
    padding: 16,
  },
  tipCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  tipCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  tipCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  tipCardMeta: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },

  // Featured Banner
  featuredContainer: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuredImg: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredTag: {
    backgroundColor: '#EF4444',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  featuredTagText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '850',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
    lineHeight: 22,
  },
  featuredDesc: {
    fontSize: 11,
    color: '#E2E8F0',
    marginBottom: 10,
    fontWeight: '500',
  },
  featuredMeta: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },

  // Video Card (Reels Grid)
  videoCardContainer: {
    width: '48%',
    height: 220,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  videoCardImg: {
    width: '100%',
    height: '100%',
  },
  videoCardDuration: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    zIndex: 10,
  },
  videoCardDurationText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
  },
  videoCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 10,
  },
  videoCardCategoryBox: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginBottom: 4,
  },
  videoCardCategoryText: {
    color: 'white',
    fontSize: 7,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  videoCardTitle: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },

  // Simulated Video Player
  playerContainer: {
    width: '100%',
    height: height => height * 0.75, // responsive
    backgroundColor: 'black',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  playerFullscreen: {
    borderRadius: 0,
    height: '100%',
  },
  playerVideoImage: {
    width: '100%',
    height: '100%',
  },
  playerShadowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playerLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerLoaderText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  centerPlayBtn: {
    position: 'absolute',
    top: '45%',
    left: '42%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  centerPlayEmoji: {
    fontSize: 24,
    marginLeft: 4,
  },
  playerControlOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 20,
  },
  playerInfoRow: {
    marginBottom: 16,
  },
  playerCategoryPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.95)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  playerCategoryText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  playerTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playerDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '550',
  },
  playerBottomActions: {
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timelineText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: 14,
  },
  toolbarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarEmoji: {
    fontSize: 13,
  },
});
