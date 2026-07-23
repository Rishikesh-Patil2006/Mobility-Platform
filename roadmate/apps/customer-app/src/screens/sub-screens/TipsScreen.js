import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Dimensions, 
  Image, 
  Modal, 
  Alert 
} from 'react-native';
import { 
  CategoryChip, 
  TipCard, 
  FeaturedBanner, 
  VideoCard, 
  VideoPlayer 
} from '../../components/TipComponents';

const { width, height } = Dimensions.get('window');

// Local icon imports for article detail preview mapping
const serviceImages = {
  car_wash: require('../../../assets/services_images/car_wash.jpg'),
  denting: require('../../../assets/services_images/denting_painting.jpg'),
  garage: require('../../../assets/services_images/garage.jpg'),
  puc: require('../../../assets/services_images/puc center.jpg'),
  service: require('../../../assets/services_images/service center.jpg'),
  towing: require('../../../assets/services_images/towing.jpg'),
  placeholder: require('../../../assets/vehicle_placeholder.png')
};

// ── CORE MOCK DATABASES ──
const mockTips = [
  {
    id: 't1',
    title: '10 Tips to Maximize Fuel Efficiency',
    description: 'Learn simple driving habits and vehicle checks that can significantly reduce your fuel consumption and emissions.',
    category: 'Mileage',
    readTime: '4 min read',
    author: 'Amit Sharma (Senior Mechanic)',
    publishDate: 'Jun 12, 2026',
    imageKey: 'garage',
    content: '1. Keep Your Tyres Properly Inflated: Driving with underinflated tyres increases rolling resistance, wasting fuel.\n\n2. Avoid Aggressive Driving: Hard acceleration and braking lower mileage by up to 15-30%.\n\n3. Reduce Excess Weight: Every extra 50kg in your car increases fuel consumption by 1-2%.\n\n4. Perform Periodic Engine Tune-ups: Clogged air filters or faulty spark plugs can drastically drop efficiency.\n\n5. Use the Right Fuel Type: Consult your vehicle manual to ensure you are filling the recommended octane.',
    keywords: ['fuel', 'saving', 'petrol', 'diesel', 'efficiency']
  },
  {
    id: 't2',
    title: 'Monsoon Car Care Special Checklist',
    description: 'Ensure your brakes, wipers, and tyres are ready to handle heavy rain showers and slippery asphalt roads.',
    category: 'Monsoon Care',
    readTime: '6 min read',
    author: 'Rajesh Patil (Car Care Expert)',
    publishDate: 'Jul 04, 2026',
    imageKey: 'service',
    content: '1. Check Windshield Wipers: Worn-out wiper blades streak your windshield and impair visibility. Replace them before the rain starts.\n\n2. Inspect Tyre Tread Depth: Worn tyres risk aquaplaning, where your vehicle slides uncontrollably on wet pavement. Ensure at least 2mm tread.\n\n3. Test Brake Responsiveness: Rainy weather increases stopping distance. Ensure your brake pads have sufficient thickness.\n\n4. Guard Against Rust: Rainwater is acidic. Get an underbody anti-rust coating to protect structural chassis parts.',
    keywords: ['rain', 'monsoon', 'water', 'wipers', 'rust', 'brakes']
  },
  {
    id: 't3',
    title: 'EV Battery Longevity & Range Hacks',
    description: 'Maximize the service lifespan and daily operating range of your electric vehicle battery with these charge tips.',
    category: 'EV Care',
    readTime: '5 min read',
    author: 'Vikranth Reddy (EV Engineer)',
    publishDate: 'May 28, 2026',
    imageKey: 'denting',
    content: '1. Limit Fast DC Charging: Frequent high-voltage fast charging degrades lithium-ion cells faster than slow AC charging.\n\n2. Maintain 20%-80% Charge: Keeping battery levels between 20% and 80% reduces state-of-charge stress.\n\n3. Protect from Thermal Extremes: Park in the shade during hot summer days to keep your battery from overheating.\n\n4. Use Regenerative Braking: Leverage high regen modes to feed kinetic energy back into the battery pack and boost range.',
    keywords: ['ev', 'battery', 'charge', 'range', 'electric']
  },
  {
    id: 't4',
    title: 'How to Safely Handle Tire Aquaplaning',
    description: 'What to do when your car loses traction on a wet highway. Learn the golden rules of maintaining control.',
    category: 'Road Safety',
    readTime: '3 min read',
    author: 'Nikhil Sen (RTO Instructor)',
    publishDate: 'Jul 15, 2026',
    imageKey: 'towing',
    content: '1. Do Not Slam the Brakes: Slamming the brakes can cause a complete skid. Gently release the accelerator.\n\n2. Steer in the Direction of the Skid: Turn your steering wheel slightly towards the direction your car is sliding.\n\n3. Keep Two Hands on the Wheel: Steady control is critical when tyres regain traction with the asphalt.\n\n4. Avoid Cruising in Deep Puddles: Slow down in areas of heavy accumulation on the highway.',
    keywords: ['tyre', 'skid', 'water', 'road', 'highway', 'aquaplane']
  },
  {
    id: 't5',
    title: 'Tyre Rotation & Care Guidelines',
    description: 'Periodic rotations extend tyre tread life. Learn how often and in what patterns you should rotate tyres.',
    category: 'Tyres',
    readTime: '5 min read',
    author: 'Karan Mehra (Tyre Specialist)',
    publishDate: 'Mar 10, 2026',
    imageKey: 'car_wash',
    content: '1. Rotation Interval: Rotate your tyres every 10,000 km to ensure even wear patterns.\n\n2. Check Pressure Weekly: Correct inflation pressure is key to preventing sidewall damage and maintaining grip.\n\n3. Wheel Alignment: Get your wheels aligned if your steering pulls to one side.\n\n4. Inspect for Bulges or Cracks: Inspect tyres for side-wall bulges that indicate internal damage.',
    keywords: ['tyres', 'rotation', 'alignment', 'wear', 'pressure']
  }
];

const mockVideos = [
  {
    id: 'v1',
    title: 'How to Jumpstart a Dead Battery',
    category: 'Battery',
    duration: '0:45',
    imageKey: 'garage',
    likesCount: 245
  },
  {
    id: 'v2',
    title: 'Emergency Tyre Changing Steps',
    category: 'Tyres',
    duration: '0:58',
    imageKey: 'towing',
    likesCount: 512
  },
  {
    id: 'v3',
    title: 'Quick 10-Min Car Wash Routine',
    category: 'Vehicle Cleaning',
    duration: '0:40',
    imageKey: 'car_wash',
    likesCount: 189
  },
  {
    id: 'v4',
    title: 'Inspecting Windshield Wipers',
    category: 'Monsoon Care',
    duration: '0:35',
    imageKey: 'puc',
    likesCount: 304
  }
];

const categories = [
  'All',
  'Mileage',
  'Engine',
  'Tyres',
  'Battery',
  'Insurance',
  'Driving',
  'Emergency',
  'Monsoon Care',
  'Summer Care',
  'Winter Care',
  'EV Care',
  'Government Rules',
  'Road Safety',
  'Vehicle Cleaning',
  'Accessories'
];

// Service category mapper for tips
export function getServiceCategoryForTip(tip) {
  if (!tip) return 'Garage';
  const titleLower = (tip.title || '').toLowerCase();
  const catLower   = (tip.category || '').toLowerCase();

  if (titleLower.includes('tyre') || titleLower.includes('tire') || catLower.includes('tyre')) return 'Tyre Shop';
  if (titleLower.includes('oil') || titleLower.includes('engine') || catLower.includes('engine') || catLower.includes('mileage')) return 'Garage';
  if (titleLower.includes('battery') || catLower.includes('battery') || catLower.includes('ev')) return 'Battery Shop';
  if (titleLower.includes('wash') || titleLower.includes('clean') || catLower.includes('cleaning')) return 'Car Wash';
  if (titleLower.includes('puc') || catLower.includes('puc')) return 'PUC Center';
  if (titleLower.includes('insurance') || catLower.includes('insurance')) return 'RTO Agents';
  if (titleLower.includes('rc') || titleLower.includes('rto') || titleLower.includes('license') || catLower.includes('rules')) return 'RTO Agents';
  if (titleLower.includes('towing') || titleLower.includes('skid') || titleLower.includes('breakdown') || titleLower.includes('emergency') || catLower.includes('emergency')) return 'Towing';

  const map = {
    'Mileage': 'Garage',
    'Engine': 'Garage',
    'Tyres': 'Tyre Shop',
    'Battery': 'Battery Shop',
    'EV Care': 'Battery Shop',
    'Vehicle Cleaning': 'Car Wash',
    'PUC': 'PUC Center',
    'Monsoon Care': 'Garage',
    'Road Safety': 'Towing',
    'Emergency': 'Towing',
    'Insurance': 'RTO Agents',
    'Government Rules': 'RTO Agents',
  };
  return map[tip.category] || 'Garage';
}

export default function TipsScreen({ 
  onBack, 
  bookmarkedTips = [], 
  bookmarkedVideos = [], 
  likedTips = [],
  likedVideos = [],
  recentlyViewedTips = [],
  onBookmarkTipToggle,
  onBookmarkVideoToggle,
  onLikeTipToggle,
  onLikeVideoToggle,
  onTrackRecentlyViewed,
  onOpenServicesCategory
}) {
  const [activeTab, setActiveTab] = useState('articles'); // articles | reels | saved
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Immersive Reels swipe states
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reelsMuted, setReelsMuted] = useState(false);

  // Article Details modal states
  const [selectedTip, setSelectedTip] = useState(null);

  // Handle article press
  const handleArticlePress = (tip) => {
    setSelectedTip(tip);
    if (onTrackRecentlyViewed) {
      onTrackRecentlyViewed(tip.id);
    }
  };

  // Share simulated link
  const handleSocialShare = async (title) => {
    try {
      await Share.share({
        message: `Check out this Roadmate Guide: "${title}"! Stay updated on vehicle care: https://roadmate.com/tips`,
      });
    } catch (e) {
      Alert.alert('Error', 'Unable to launch native share.');
    }
  };

  // Filtered Articles
  const filteredTips = useMemo(() => {
    return mockTips.filter(tip => {
      const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tip.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'All' || tip.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered Reels
  const filteredVideos = useMemo(() => {
    return mockVideos.filter(vid => {
      const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || vid.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Saved Content items
  const savedTipsList = useMemo(() => {
    return mockTips.filter(t => bookmarkedTips.includes(t.id));
  }, [bookmarkedTips]);

  const savedVideosList = useMemo(() => {
    return mockVideos.filter(v => bookmarkedVideos.includes(v.id));
  }, [bookmarkedVideos]);

  // Immersive Reels swipe transition helpers
  const handleReelSwipeUp = () => {
    if (activeReelIndex < mockVideos.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
    } else {
      Alert.alert('End of Feed', 'You have viewed all educational reels.');
    }
  };

  const handleReelSwipeDown = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Tips & Maintenance</Text>
            <Text style={styles.headerSubtitle}>Keep your ride in showroom condition</Text>
          </View>
        </View>
      </View>

      {/* Tabs segment controller */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setActiveTab('articles')}
          style={[styles.tabButton, activeTab === 'articles' ? styles.tabButtonActive : null]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'articles' ? styles.tabButtonTextActive : null]}>
            📚 Articles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('reels')}
          style={[styles.tabButton, activeTab === 'reels' ? styles.tabButtonActive : null]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'reels' ? styles.tabButtonTextActive : null]}>
            🎥 Reels Shorts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('saved')}
          style={[styles.tabButton, activeTab === 'saved' ? styles.tabButtonActive : null]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'saved' ? styles.tabButtonTextActive : null]}>
            ⭐️ Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* ───────────────── VIEW SWITCHER ───────────────── */}

      {/* VIEW 1: ARTICLES HUB */}
      {activeTab === 'articles' && (
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyScrollPadding}>
          
          {/* Search bar wrapper */}
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tips, maintenance guides, keywords..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category scrolling row */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesRow}
            contentContainerStyle={styles.categoriesRowContent}
          >
            {categories.map((cat) => (
              <CategoryChip 
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>

          {/* Featured Spotlight Section */}
          {selectedCategory === 'All' && searchQuery === '' && (
            <View>
              <Text style={styles.sectionHeading}>Spotlight Guide</Text>
              <FeaturedBanner 
                tip={mockTips[1]} // Monsoon Care special
                onPress={() => handleArticlePress(mockTips[1])}
              />
            </View>
          )}

          {/* Tips List */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Latest Maintenance Tips</Text>
            <Text style={styles.resultsCount}>{filteredTips.length} Articles</Text>
          </View>

          {filteredTips.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyTitle}>No Articles Found</Text>
              <Text style={styles.emptyDesc}>Try typing a different keyword or matching category.</Text>
            </View>
          ) : (
            filteredTips.map((tip) => (
              <TipCard 
                key={tip.id}
                tip={tip}
                bookmarked={bookmarkedTips.includes(tip.id)}
                onBookmarkToggle={() => onBookmarkTipToggle(tip.id)}
                onPress={() => handleArticlePress(tip)}
              />
            ))
          )}

          {/* Recently Viewed Drawer shelf */}
          {recentlyViewedTips.length > 0 && (
            <View style={styles.recentViewedShelf}>
              <Text style={styles.sectionHeading}>Recently Viewed</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScrollContent}>
                {recentlyViewedTips.map((rId) => {
                  const rTip = mockTips.find(t => t.id === rId);
                  if (!rTip) return null;
                  return (
                    <TouchableOpacity 
                      key={rId} 
                      style={styles.recentCard}
                      onPress={() => handleArticlePress(rTip)}
                      activeOpacity={0.8}
                    >
                      <Image source={serviceImages[rTip.imageKey]} style={styles.recentCardImg} />
                      <Text style={styles.recentCardTitle} numberOfLines={1}>{rTip.title}</Text>
                      <Text style={styles.recentCardMeta}>{rTip.category}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}

      {/* VIEW 2: VERTICAL SWIPE EDUCATIONAL REELS */}
      {activeTab === 'reels' && (
        <View style={styles.reelsContainer}>
          {mockVideos.length > 0 ? (
            <View style={styles.reelPlayerWrapper}>
              <VideoPlayer 
                video={mockVideos[activeReelIndex]}
                isMuted={reelsMuted}
                onMuteToggle={() => setReelsMuted(!reelsMuted)}
              />

              {/* Sidebar Action Buttons Overlay */}
              <View style={styles.reelsSidebar}>
                {/* Like Button */}
                <TouchableOpacity 
                  onPress={() => onLikeVideoToggle(mockVideos[activeReelIndex].id)} 
                  style={[styles.sidebarBtn, likedVideos.includes(mockVideos[activeReelIndex].id) ? styles.sidebarBtnLiked : null]}
                >
                  <Text style={styles.sidebarEmoji}>❤️</Text>
                  <Text style={styles.sidebarLabel}>
                    {mockVideos[activeReelIndex].likesCount + (likedVideos.includes(mockVideos[activeReelIndex].id) ? 1 : 0)}
                  </Text>
                </TouchableOpacity>

                {/* Bookmark Button */}
                <TouchableOpacity 
                  onPress={() => onBookmarkVideoToggle(mockVideos[activeReelIndex].id)} 
                  style={[styles.sidebarBtn, bookmarkedVideos.includes(mockVideos[activeReelIndex].id) ? styles.sidebarBtnSaved : null]}
                >
                  <Text style={styles.sidebarEmoji}>⭐️</Text>
                  <Text style={styles.sidebarLabel}>Save</Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity 
                  onPress={() => handleSocialShare(mockVideos[activeReelIndex].title)} 
                  style={styles.sidebarBtn}
                >
                  <Text style={styles.sidebarEmoji}>✉️</Text>
                  <Text style={styles.sidebarLabel}>Share</Text>
                </TouchableOpacity>

                {/* Report Button */}
                <TouchableOpacity 
                  onPress={() => Alert.alert('Report Video', 'Thank you for reporting. Our moderators will review this reel within 24 hours.')} 
                  style={styles.sidebarBtn}
                >
                  <Text style={styles.sidebarEmoji}>⚠️</Text>
                  <Text style={styles.sidebarLabel}>Report</Text>
                </TouchableOpacity>
              </View>

              {/* Feed Navigation Buttons Overlay */}
              <View style={styles.feedNavigationPanel}>
                <TouchableOpacity 
                  onPress={handleReelSwipeDown} 
                  style={[styles.navSwipeBtn, activeReelIndex === 0 ? styles.navSwipeBtnDisabled : null]}
                  disabled={activeReelIndex === 0}
                >
                  <Text style={styles.navSwipeText}>▲ Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleReelSwipeUp} 
                  style={styles.navSwipeBtn}
                >
                  <Text style={styles.navSwipeText}>▼ Next Shorts</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎥</Text>
              <Text style={styles.emptyTitle}>No Reels Uploaded</Text>
            </View>
          )}
        </View>
      )}

      {/* VIEW 3: SAVED CONTENT BOOKMARKS SHELF */}
      {activeTab === 'saved' && (
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyScrollPadding}>
          
          <Text style={styles.sectionHeading}>Saved Tips Articles</Text>
          {savedTipsList.length === 0 ? (
            <View style={styles.savedEmptyBox}>
              <Text style={styles.savedEmptyEmoji}>📚</Text>
              <Text style={styles.savedEmptyTitle}>No Bookmarked Articles</Text>
              <Text style={styles.savedEmptyDesc}>Articles you bookmark will be displayed here.</Text>
            </View>
          ) : (
            savedTipsList.map((t) => (
              <TipCard 
                key={t.id}
                tip={t}
                bookmarked={true}
                onBookmarkToggle={() => onBookmarkTipToggle(t.id)}
                onPress={() => handleArticlePress(t)}
              />
            ))
          )}

          <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Saved Shorts Reels</Text>
          {savedVideosList.length === 0 ? (
            <View style={styles.savedEmptyBox}>
              <Text style={styles.savedEmptyEmoji}>🎥</Text>
              <Text style={styles.savedEmptyTitle}>No Saved Videos</Text>
              <Text style={styles.savedEmptyDesc}>Videos you bookmark will show up here.</Text>
            </View>
          ) : (
            <View style={styles.savedVideosGrid}>
              {savedVideosList.map((vid) => (
                <VideoCard 
                  key={vid.id}
                  video={vid}
                  bookmarked={true}
                  onBookmarkToggle={() => onBookmarkVideoToggle(vid.id)}
                  onPress={() => {
                    setActiveTab('reels');
                    const idx = mockVideos.findIndex(v => v.id === vid.id);
                    if (idx !== -1) setActiveReelIndex(idx);
                  }}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ───────────────── ARTICLE DETAIL SCREEN MODAL ───────────────── */}
      <Modal visible={selectedTip !== null} animationType="slide" transparent>
        <View style={styles.detailsOverlay}>
          <View style={styles.detailsCard}>
            
            {/* Modal Top Navigation Bar */}
            <View style={styles.detailsHeader}>
              <TouchableOpacity onPress={() => setSelectedTip(null)} style={styles.detailsCloseBtn}>
                <Text style={styles.detailsCloseText}>✕ Close</Text>
              </TouchableOpacity>
              
              <View style={styles.detailsActionsRow}>
                {/* Like */}
                <TouchableOpacity 
                  onPress={() => selectedTip && onLikeTipToggle(selectedTip.id)}
                  style={styles.detailsActionBtn}
                >
                  <Text style={styles.detailsActionEmoji}>
                    {selectedTip && likedTips.includes(selectedTip.id) ? '❤️' : '♡'}
                  </Text>
                </TouchableOpacity>

                {/* Bookmark */}
                <TouchableOpacity 
                  onPress={() => selectedTip && onBookmarkTipToggle(selectedTip.id)}
                  style={styles.detailsActionBtn}
                >
                  <Text style={styles.detailsActionEmoji}>
                    {selectedTip && bookmarkedTips.includes(selectedTip.id) ? '⭐️' : '☆'}
                  </Text>
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity 
                  onPress={() => selectedTip && handleSocialShare(selectedTip.title)}
                  style={styles.detailsActionBtn}
                >
                  <Text style={styles.detailsActionEmoji}>✉️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {selectedTip && (
              <ScrollView style={styles.detailsScrollBody} showsVerticalScrollIndicator={false}>
                {/* Article Cover */}
                <Image 
                  source={serviceImages[selectedTip.imageKey] || serviceImages.placeholder} 
                  style={styles.detailsCoverImage} 
                  resizeMode="cover" 
                />

                <View style={styles.detailsMetaPadding}>
                  
                  {/* Category badge */}
                  <View style={styles.detailsCategoryPill}>
                    <Text style={styles.detailsCategoryText}>{selectedTip.category}</Text>
                  </View>

                  <Text style={styles.detailsTitle}>{selectedTip.title}</Text>
                  
                  <View style={styles.detailsAuthorBlock}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorAvatarText}>RM</Text>
                    </View>
                    <View>
                      <Text style={styles.authorName}>{selectedTip.author}</Text>
                      <Text style={styles.authorMeta}>{selectedTip.publishDate} · {selectedTip.readTime}</Text>
                    </View>
                  </View>

                  <Text style={styles.detailsDivider} />

                  <Text style={styles.detailsFullText}>{selectedTip.content}</Text>
                  
                  <Text style={styles.detailsDivider} />

                  {/* Recommended Service Providers Section */}
                  <View style={styles.recommendedServicesBox}>
                    <View style={styles.recommendedHeaderRow}>
                      <Text style={styles.recommendedTitle}>🛠️ Recommended Service Providers</Text>
                      <View style={styles.recommendedCategoryBadge}>
                        <Text style={styles.recommendedCategoryBadgeText}>{getServiceCategoryForTip(selectedTip)}</Text>
                      </View>
                    </View>
                    <Text style={styles.recommendedDesc}>
                      Need professional assistance for this task? Connect directly with verified {getServiceCategoryForTip(selectedTip)} providers in your city.
                    </Text>
                    <TouchableOpacity
                      style={styles.viewServiceBtn}
                      onPress={() => {
                        const targetCat = getServiceCategoryForTip(selectedTip);
                        setSelectedTip(null);
                        if (onOpenServicesCategory) {
                          onOpenServicesCategory(targetCat);
                        }
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.viewServiceBtnText}>View {getServiceCategoryForTip(selectedTip)} Providers →</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.detailsDivider} />

                  {/* Related tips list */}
                  <Text style={styles.relatedHeading}>Related Tips & Guides</Text>
                  {mockTips
                    .filter(t => t.id !== selectedTip.id && (t.category === selectedTip.category || t.id === 't5'))
                    .slice(0, 2)
                    .map(rel => (
                      <TouchableOpacity 
                        key={rel.id} 
                        style={styles.relatedCard}
                        onPress={() => setSelectedTip(rel)}
                        activeOpacity={0.8}
                      >
                        <Image source={serviceImages[rel.imageKey]} style={styles.relatedCardImg} />
                        <View style={styles.relatedCardContent}>
                          <Text style={styles.relatedCardTitle} numberOfLines={1}>{rel.title}</Text>
                          <Text style={styles.relatedCardDesc} numberOfLines={1}>{rel.description}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(219, 234, 254, 0.8)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 6,
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  body: {
    flex: 1,
  },
  bodyScrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoriesRow: {
    marginBottom: 20,
  },
  categoriesRowContent: {
    paddingRight: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '850',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // Recently Viewed Styles
  recentViewedShelf: {
    marginTop: 20,
  },
  recentScrollContent: {
    gap: 12,
  },
  recentCard: {
    width: 130,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    paddingBottom: 8,
  },
  recentCardImg: {
    width: '100%',
    height: 80,
  },
  recentCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  recentCardMeta: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
    paddingHorizontal: 8,
    marginTop: 2,
  },

  // Saved Bookmarks Tab View Grid
  savedEmptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  savedEmptyEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  savedEmptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  savedEmptyDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  savedVideosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },

  // Immersive Reels layout
  reelsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F172A',
  },
  reelPlayerWrapper: {
    flex: 1,
    position: 'relative',
  },
  reelsSidebar: {
    position: 'absolute',
    right: 14,
    bottom: 120,
    gap: 16,
    alignItems: 'center',
    zIndex: 30,
  },
  sidebarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarBtnLiked: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderColor: '#EF4444',
  },
  sidebarBtnSaved: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    borderColor: '#F59E0B',
  },
  sidebarEmoji: {
    fontSize: 16,
  },
  sidebarLabel: {
    color: 'white',
    fontSize: 8,
    fontWeight: '850',
    marginTop: 2,
    textAlign: 'center',
    position: 'absolute',
    bottom: -13,
  },
  feedNavigationPanel: {
    position: 'absolute',
    left: 14,
    right: 70,
    bottom: 24,
    flexDirection: 'row',
    gap: 10,
    zIndex: 30,
  },
  navSwipeBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navSwipeBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  navSwipeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },

  // Article Details Overlay Modal layout
  detailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: height * 0.9,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailsCloseBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  detailsCloseText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '800',
  },
  detailsActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsActionEmoji: {
    fontSize: 15,
  },
  detailsScrollBody: {
    flex: 1,
  },
  detailsCoverImage: {
    width: '100%',
    height: 220,
  },
  detailsMetaPadding: {
    padding: 20,
  },
  detailsCategoryPill: {
    backgroundColor: '#EBF5FF',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  detailsCategoryText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 16,
  },
  detailsAuthorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '850',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  authorMeta: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  detailsFullText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 22,
    fontWeight: '550',
  },
  recommendedServicesBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  recommendedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  recommendedCategoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedCategoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  recommendedDesc: {
    fontSize: 11,
    color: '#3B82F6',
    marginBottom: 14,
    lineHeight: 16,
  },
  viewServiceBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewServiceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  relatedHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  relatedCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  relatedCardImg: {
    width: 60,
    height: 50,
    borderRadius: 10,
  },
  relatedCardContent: {
    flex: 1,
  },
  relatedCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  relatedCardDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
