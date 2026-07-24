import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Image, Alert, Dimensions } from 'react-native';

const quickReplies = [
  'Thank you so much for choosing our workshop! Drive safe! 🚗',
  'We appreciate your 5-star review and kind words! 🙏',
  'Thank you for your valuable feedback! We look forward to serving you again.',
  'We appreciate your review. We are continuously improving our service lounge.',
];

export default function ReviewManagementModal({ visible, reviews, ratingMetrics, onSaveReply, onDeleteReply, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState('All'); // All | 5 | 4 | 3 | 2 | 1
  const [replyFilter, setReplyFilter] = useState('All'); // All | With Reply | Without Reply
  const [sortBy, setSortBy] = useState('Newest');

  // Replying state
  const [activeReplyingReviewId, setActiveReplyingReviewId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleStartReply = (review) => {
    setActiveReplyingReviewId(review.id);
    setReplyInputText(review.vendorReply ? review.vendorReply.replyText : '');
  };

  const handleCancelReply = () => {
    setActiveReplyingReviewId(null);
    setReplyInputText('');
  };

  const handleConfirmSaveReply = async (reviewId) => {
    if (!replyInputText.trim()) {
      return Alert.alert('Empty Reply', 'Please enter a reply before saving.');
    }
    await onSaveReply(reviewId, replyInputText.trim());
    setActiveReplyingReviewId(null);
    setReplyInputText('');
    triggerToast('Reply saved and synced!');
  };

  const handleConfirmDeleteReply = (reviewId) => {
    Alert.alert(
      'Delete Vendor Reply',
      'Are you sure you want to delete your reply to this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Reply',
          style: 'destructive',
          onPress: async () => {
            await onDeleteReply(reviewId);
            triggerToast('Reply deleted.');
          },
        },
      ]
    );
  };

  const handleCopyReview = (text) => {
    triggerToast('Review text copied to clipboard!');
  };

  const handleShareReview = () => {
    triggerToast('Share link generated!');
  };

  const handleReportReview = (name) => {
    Alert.alert('Report Review', `Flagged review from ${name} for Super Admin moderation review.`, [{ text: 'OK' }]);
  };

  // Filter & Sort
  const filteredReviews = (reviews || [])
    .filter((r) => {
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        (r.customerName || '').toLowerCase().includes(q) ||
        (r.serviceName || '').toLowerCase().includes(q) ||
        (r.reviewText || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (starFilter !== 'All' && String(r.rating) !== String(starFilter)) return false;

      if (replyFilter === 'With Reply' && (!r.vendorReply || !r.vendorReply.replyText)) return false;
      if (replyFilter === 'Without Reply' && r.vendorReply && r.vendorReply.replyText) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'Oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const safeRatingMetrics = ratingMetrics || {
    averageRating: 4.8,
    totalReviews: (reviews || []).length,
    breakdown: { 5: 4, 4: 1, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 80, 4: 20, 3: 0, 2: 0, 1: 0 },
    responseRate: '100%',
    avgResponseTime: '< 2 Hrs',
    monthlyReviews: (reviews || []).length,
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>⭐ Reviews & Reputation Hub</Text>
              <Text style={styles.modalSub}>Manage customer feedback, replies & rating analytics</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Toast Notification */}
          {toastMsg ? (
            <View style={styles.toast}>
              <Text style={styles.toastText}>✓ {toastMsg}</Text>
            </View>
          ) : null}

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Rating Distribution Banner */}
            {safeRatingMetrics && (
              <View style={styles.metricsCard}>
                <View style={styles.metricsTopRow}>
                  <View style={styles.ratingScoreCol}>
                    <Text style={styles.bigScore}>{safeRatingMetrics.averageRating}</Text>
                    <Text style={styles.scoreStars}>⭐⭐⭐⭐⭐</Text>
                    <Text style={styles.totalReviewsLbl}>{safeRatingMetrics.totalReviews} Total Reviews</Text>
                  </View>

                  <View style={styles.barsCol}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = safeRatingMetrics.percentages?.[star] || 0;
                      const cnt = safeRatingMetrics.breakdown?.[star] || 0;
                      return (
                        <View key={star} style={styles.barRow}>
                          <Text style={styles.barStarLbl}>{star}★</Text>
                          <View style={styles.barTrack}>
                            <View style={[styles.barFill, { width: `${pct}%` }]} />
                          </View>
                          <Text style={styles.barCountLbl}>{cnt}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Review Analytics Matrix */}
                <View style={styles.analyticsMatrix}>
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticVal}>{safeRatingMetrics.responseRate}</Text>
                    <Text style={styles.analyticLbl}>Response Rate</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticVal}>{safeRatingMetrics.avgResponseTime}</Text>
                    <Text style={styles.analyticLbl}>Avg Response</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticVal}>{safeRatingMetrics.monthlyReviews}</Text>
                    <Text style={styles.analyticLbl}>Monthly Reviews</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Search & Control Filter Bar */}
            <View style={styles.filterSection}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search reviews by customer name, service..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Star Filter Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                <Text style={styles.chipLabel}>Stars:</Text>
                {['All', '5', '4', '3', '2', '1'].map((st) => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setStarFilter(st)}
                    style={[styles.chip, starFilter === st ? styles.chipActive : null]}
                  >
                    <Text style={[styles.chipText, starFilter === st ? styles.chipTextActive : null]}>
                      {st === 'All' ? 'All Stars' : `${st} ★`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Reply Status Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipRow, { marginTop: 6 }]}>
                <Text style={styles.chipLabel}>Status:</Text>
                {['All', 'With Reply', 'Without Reply'].map((rf) => (
                  <TouchableOpacity
                    key={rf}
                    onPress={() => setReplyFilter(rf)}
                    style={[styles.chip, replyFilter === rf ? styles.chipActive : null]}
                  >
                    <Text style={[styles.chipText, replyFilter === rf ? styles.chipTextActive : null]}>{rf}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Reviews List */}
            <Text style={styles.sectionHeaderTitle}>💬 Customer Reviews ({filteredReviews.length})</Text>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev) => {
                const isReplyingThis = activeReplyingReviewId === rev.id;

                return (
                  <View key={rev.id} style={styles.reviewCard}>
                    {/* Header Row */}
                    <View style={styles.revHeaderRow}>
                      <Image
                        source={{ uri: rev.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
                        style={styles.avatar}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.customerName}>{rev.customerName}</Text>
                        <Text style={styles.serviceTag}>{rev.serviceName}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.starRatingText}>{renderStars(rev.rating)}</Text>
                        <Text style={styles.dateText}>{rev.date}</Text>
                      </View>
                    </View>

                    {/* Customer Review Text */}
                    <Text style={styles.reviewText}>"{rev.reviewText}"</Text>

                    {/* Vendor Existing Reply */}
                    {rev.vendorReply && rev.vendorReply.replyText && !isReplyingThis ? (
                      <View style={styles.vendorReplyBox}>
                        <Text style={styles.replyHeader}>🏪 Vendor Response ({rev.vendorReply.date}):</Text>
                        <Text style={styles.replyBodyText}>{rev.vendorReply.replyText}</Text>
                      </View>
                    ) : null}

                    {/* Inline Reply Input Box */}
                    {isReplyingThis && (
                      <View style={styles.replyEditorBox}>
                        <Text style={styles.replyEditorTitle}>
                          {rev.vendorReply ? '📝 Edit Response to Customer' : '💬 Write Official Vendor Response'}
                        </Text>

                        {/* Quick Response Chips */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplyRow}>
                          {quickReplies.map((qr, i) => (
                            <TouchableOpacity key={i} onPress={() => setReplyInputText(qr)} style={styles.qrChip}>
                              <Text style={styles.qrChipText} numberOfLines={1}>{qr}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        <TextInput
                          style={styles.replyInput}
                          multiline
                          value={replyInputText}
                          onChangeText={setReplyInputText}
                          placeholder="Type your official response to this customer..."
                        />

                        <View style={styles.replyEditorActionRow}>
                          <TouchableOpacity onPress={handleCancelReply} style={styles.cancelReplyBtn}>
                            <Text style={styles.cancelReplyText}>Cancel</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleConfirmSaveReply(rev.id)} style={styles.saveReplyBtn}>
                            <Text style={styles.saveReplyText}>Save & Sync Reply</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Action Toolbar Row */}
                    {!isReplyingThis && (
                      <View style={styles.actionRow}>
                        <TouchableOpacity onPress={() => handleStartReply(rev)} style={styles.actionBtn}>
                          <Text style={styles.actionBtnText}>
                            {rev.vendorReply ? '📝 Edit Reply' : '💬 Reply'}
                          </Text>
                        </TouchableOpacity>

                        {rev.vendorReply ? (
                          <TouchableOpacity onPress={() => handleConfirmDeleteReply(rev.id)} style={styles.deleteActionBtn}>
                            <Text style={styles.deleteActionText}>🗑️ Delete Reply</Text>
                          </TouchableOpacity>
                        ) : null}

                        <TouchableOpacity onPress={() => handleCopyReview(rev.reviewText)} style={styles.actionBtn}>
                          <Text style={styles.actionBtnText}>📋 Copy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleShareReview} style={styles.actionBtn}>
                          <Text style={styles.actionBtnText}>🔗 Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleReportReview(rev.customerName)} style={styles.actionBtn}>
                          <Text style={styles.actionBtnText}>🚩 Report</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No reviews match your selected filter criteria.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '92%',
    height: '92%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  toastText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  metricsCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },
  metricsTopRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  ratingScoreCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  bigScore: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
  },
  scoreStars: {
    fontSize: 11,
    marginVertical: 2,
  },
  totalReviewsLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  barsCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barStarLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    width: 20,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#EAB308',
  },
  barCountLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    width: 16,
    textAlign: 'right',
  },
  analyticsMatrix: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 10,
  },
  analyticItem: {
    alignItems: 'center',
  },
  analyticVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  analyticLbl: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
  },
  filterSection: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  clearIcon: {
    fontSize: 12,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  chipRow: {
    gap: 6,
    alignItems: 'center',
  },
  chipLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
  },
  chip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  chipActive: {
    backgroundColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  sectionHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  revHeaderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  serviceTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  starRatingText: {
    fontSize: 11,
  },
  dateText: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  vendorReplyBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderColor: '#1E3A8A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  replyHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  replyBodyText: {
    fontSize: 11.5,
    color: '#1E293B',
    lineHeight: 16,
  },
  replyEditorBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  replyEditorTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  quickReplyRow: {
    gap: 6,
    marginBottom: 8,
  },
  qrChip: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    maxWidth: 220,
  },
  qrChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  replyInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 8,
    fontSize: 11.5,
    color: '#0F172A',
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  replyEditorActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelReplyBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelReplyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  saveReplyBtn: {
    flex: 2,
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveReplyText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'white',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 4,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
  },
  actionBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  deleteActionBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 20,
  },
});
