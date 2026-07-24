import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image, Alert, Dimensions } from 'react-native';
import { useVendorProfile } from '../../context/VendorProfileContext';
import {
  fetchTips,
  saveTip,
  deleteTip,
  changeTipStatus,
} from '../../services/vendorTipService';
import TipManagementModal from '../../components/TipManagementModal';
import EmptyState from '../../components/EmptyState';

const { width } = Dimensions.get('window');

const tipsCategories = [
  'All',
  'Vehicle Care',
  'Maintenance Tips',
  'Seasonal Tips',
  'Fuel Saving',
  'Battery Care',
  'Tyre Care',
  'Engine Care',
  'Driving Safety',
  'EV Tips',
];

const sortOptions = ['Newest', 'Oldest', 'Most Viewed', 'Highest CTR'];

export default function VendorTipsTab() {
  const { profile } = useVendorProfile();

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Search, Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Statuses'); // All Statuses | Published | Draft | Archived
  const [sortBy, setSortBy] = useState('Newest');

  // Modals
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTips(profile?.vendorId || 'vendor-1');
      setTips(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // ── CRUD ACTIONS ──
  const handleOpenCreate = () => {
    setEditingTip(null);
    setTipModalOpen(true);
  };

  const handleOpenEdit = (tip) => {
    setEditingTip(tip);
    setTipModalOpen(true);
  };

  const handleSaveTip = async (tipData) => {
    const saved = await saveTip(tipData);
    if (editingTip) {
      setTips((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      triggerToast('Article updated!');
    } else {
      setTips((prev) => [saved, ...prev]);
      triggerToast(saved.status === 'Published' ? '🚀 Article published live!' : 'Draft article saved.');
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    const updated = await changeTipStatus(id, newStatus);
    if (updated) {
      setTips((prev) => prev.map((t) => (t.id === id ? updated : t)));
      triggerToast(`Article status changed to ${newStatus}`);
    }
  };

  const handleDeleteTip = (id, title) => {
    Alert.alert(
      'Delete Article',
      `Are you sure you want to delete "${title}"? This will remove it permanently.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTip(id);
            setTips((prev) => prev.filter((t) => t.id !== id));
            triggerToast('Article deleted.');
          },
        },
      ]
    );
  };

  // Computed Analytics Summary
  const totalArticles = tips.length;
  const totalViews = tips.reduce((acc, t) => acc + (t.analytics?.views || 0), 0);
  const publishedCount = tips.filter((t) => t.status === 'Published').length;

  // Filter & Sort Logic
  const filteredTips = tips
    .filter((tip) => {
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        (tip.title || '').toLowerCase().includes(q) ||
        (tip.shortDescription || '').toLowerCase().includes(q) ||
        (tip.category || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeCategory !== 'All' && tip.category !== activeCategory) return false;

      if (activeStatusFilter === 'Published' && tip.status !== 'Published') return false;
      if (activeStatusFilter === 'Draft' && tip.status !== 'Draft') return false;
      if (activeStatusFilter === 'Archived' && tip.status !== 'Archived') return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortBy === 'Oldest') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      if (sortBy === 'Most Viewed') return (b.analytics?.views || 0) - (a.analytics?.views || 0);
      if (sortBy === 'Highest CTR') return parseFloat(b.analytics?.ctr || 0) - parseFloat(a.analytics?.ctr || 0);
      return 0;
    });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛠 Content Publishing Platform</Text>
        <Text style={styles.headerSubtitle}>
          Publish educational care guides, maintenance tips & analyze customer engagement
        </Text>

        {/* Executive Analytics Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{totalArticles}</Text>
            <Text style={styles.statLbl}>Articles</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{publishedCount}</Text>
            <Text style={styles.statLbl}>Published</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{totalViews}</Text>
            <Text style={styles.statLbl}>Total Views</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search published tips & articles..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Filter Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {tipsCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryChip, activeCategory === cat ? styles.categoryChipActive : null]}
            >
              <Text style={[styles.categoryText, activeCategory === cat ? styles.categoryTextActive : null]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Toast Alert */}
      {toastMsg ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ {toastMsg}</Text>
        </View>
      ) : null}

      {/* Control Bar: Status Filter & Sort */}
      <View style={styles.controlBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusScroll}>
          {['All Statuses', 'Published', 'Draft', 'Archived'].map((st) => (
            <TouchableOpacity
              key={st}
              onPress={() => setActiveStatusFilter(st)}
              style={[styles.statusChip, activeStatusFilter === st ? styles.statusChipActive : null]}
            >
              <Text style={[styles.statusChipText, activeStatusFilter === st ? styles.statusChipTextActive : null]}>
                {st}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingTop: 6 }}>
          <Text style={styles.sortLabel}>Sort By:</Text>
          {sortOptions.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSortBy(s)}
              style={[styles.sortBtn, sortBy === s ? styles.sortBtnActive : null]}
            >
              <Text style={[styles.sortBtnText, sortBy === s ? styles.sortBtnTextActive : null]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {filteredTips.length > 0 ? (
          filteredTips.map((tip) => {
            const isPublished = tip.status === 'Published';
            const isDraft = tip.status === 'Draft';

            return (
              <View key={tip.id} style={styles.articleCard}>
                <Image source={{ uri: tip.thumbnailImage }} style={styles.articleImage} resizeMode="cover" />

                <View style={styles.articleBody}>
                  {/* Category & Status Header */}
                  <View style={styles.metaRow}>
                    <View style={styles.catBadge}>
                      <Text style={styles.catText}>{tip.category}</Text>
                    </View>

                    <View style={[styles.statusBadge, isPublished ? styles.badgePublished : isDraft ? styles.badgeDraft : styles.badgeArchived]}>
                      <Text style={[styles.statusText, isPublished ? styles.textPublished : isDraft ? styles.textDraft : styles.textArchived]}>
                        ● {tip.status}
                      </Text>
                    </View>
                  </View>

                  {/* Title & Summary */}
                  <Text style={styles.articleTitle}>{tip.title}</Text>
                  <Text style={styles.articleSummary} numberOfLines={2}>{tip.shortDescription}</Text>

                  {/* Per-Article Content Analytics */}
                  <View style={styles.analyticsRow}>
                    <View style={styles.analyticCol}>
                      <Text style={styles.analyticVal}>👁️ {tip.analytics?.views || 0}</Text>
                      <Text style={styles.analyticLbl}>Views</Text>
                    </View>
                    <View style={styles.analyticCol}>
                      <Text style={styles.analyticVal}>📈 {tip.analytics?.ctr || '0.0%'}</Text>
                      <Text style={styles.analyticLbl}>CTR</Text>
                    </View>
                    <View style={styles.analyticCol}>
                      <Text style={styles.analyticVal}>❤️ {tip.analytics?.likes || 0}</Text>
                      <Text style={styles.analyticLbl}>Likes</Text>
                    </View>
                    <View style={styles.analyticCol}>
                      <Text style={styles.analyticVal}>🔗 {tip.analytics?.shares || 0}</Text>
                      <Text style={styles.analyticLbl}>Shares</Text>
                    </View>
                  </View>

                  {/* Dates Row */}
                  <View style={styles.dateRow}>
                    <Text style={styles.dateText}>📅 Published: {tip.createdDate}</Text>
                    <Text style={styles.dateText}>✏️ Updated: {tip.lastUpdated}</Text>
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => setSelectedArticle(tip)} style={styles.actionBtn}>
                      <Text style={styles.actionText}>👁️ Read</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleOpenEdit(tip)} style={styles.actionBtn}>
                      <Text style={styles.actionText}>📝 Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleChangeStatus(tip.id, isPublished ? 'Draft' : 'Published')}
                      style={styles.actionBtn}
                    >
                      <Text style={styles.actionText}>{isPublished ? '🔒 Unpublish' : '🚀 Publish'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleChangeStatus(tip.id, 'Archived')}
                      style={styles.actionBtn}
                    >
                      <Text style={styles.actionText}>📦 Archive</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDeleteTip(tip.id, tip.title)} style={styles.deleteBtn}>
                      <Text style={styles.deleteText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            title="No Articles Found"
            description={searchQuery ? 'No tips match your search filter.' : 'Tap the floating (+) button below to create your first educational tip.'}
          />
        )}
      </ScrollView>

      {/* Floating Action Button (+) */}
      <TouchableOpacity onPress={handleOpenCreate} style={styles.fabBtn} activeOpacity={0.88}>
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabLabel}>Create Tip</Text>
      </TouchableOpacity>

      {/* Add / Edit Tip Modal */}
      <TipManagementModal
        visible={tipModalOpen}
        initialTip={editingTip}
        vendorId={profile?.vendorId || 'vendor-1'}
        onSave={handleSaveTip}
        onClose={() => setTipModalOpen(false)}
      />

      {/* Full Article Preview Modal */}
      <Modal visible={!!selectedArticle} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '88%' }]}>
            {selectedArticle && (
              <View style={{ flex: 1 }}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalHeaderTitle} numberOfLines={1}>{selectedArticle.title}</Text>
                  <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                  <Image source={{ uri: selectedArticle.coverImage || selectedArticle.thumbnailImage }} style={styles.modalBannerImage} resizeMode="cover" />

                  <Text style={styles.detailTitle}>{selectedArticle.title}</Text>

                  <View style={styles.detailMetaRow}>
                    <Text style={styles.catBadgeText}>{selectedArticle.category}</Text>
                    <Text style={styles.dateText}>Published: {selectedArticle.createdDate}</Text>
                  </View>

                  <View style={styles.detailAnalyticsBox}>
                    <Text style={styles.analyticsTitle}>📊 Customer Engagement Analytics</Text>
                    <Text style={styles.analyticsDetail}>
                      👁️ {selectedArticle.analytics?.views || 0} Views  ·  📈 {selectedArticle.analytics?.ctr || '0%'} CTR  ·  ❤️ {selectedArticle.analytics?.likes || 0} Likes  ·  🔗 {selectedArticle.analytics?.shares || 0} Shares
                    </Text>
                  </View>

                  <Text style={styles.detailContent}>{selectedArticle.detailedContent}</Text>
                </ScrollView>
              </View>
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
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: 'white',
  },
  statLbl: {
    fontSize: 10,
    color: '#BFDBFE',
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
  },
  clearIcon: {
    fontSize: 13,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categoryChipActive: {
    backgroundColor: 'white',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BFDBFE',
  },
  categoryTextActive: {
    color: '#1E3A8A',
  },
  controlBar: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusScroll: {
    gap: 6,
  },
  statusChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusChipActive: {
    backgroundColor: '#1E3A8A',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  statusChipTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    alignSelf: 'center',
  },
  sortBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  sortBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A8A',
  },
  sortBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  sortBtnTextActive: {
    color: '#1E3A8A',
    fontWeight: '800',
  },
  scrollPadding: {
    padding: 16,
    paddingBottom: 90,
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 14,
  },
  articleImage: {
    width: '100%',
    height: 120,
  },
  articleBody: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  catText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgePublished: {
    backgroundColor: '#DCFCE7',
  },
  badgeDraft: {
    backgroundColor: '#FEF3C7',
  },
  badgeArchived: {
    backgroundColor: '#F3E8FF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textPublished: {
    color: '#166534',
  },
  textDraft: {
    color: '#92400E',
  },
  textArchived: {
    color: '#6B21A8',
  },
  articleTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    lineHeight: 19,
  },
  articleSummary: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  analyticCol: {
    alignItems: 'center',
  },
  analyticVal: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  analyticLbl: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
  },
  actionBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#334155',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 12,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 6,
  },
  fabLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '900',
  },
  toast: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  toastText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 10,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  modalBannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  detailMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  detailAnalyticsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  analyticsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 2,
  },
  analyticsDetail: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  detailContent: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    whiteSpace: 'pre-line',
  },
});
