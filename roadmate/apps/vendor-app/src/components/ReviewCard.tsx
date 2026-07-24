import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ReviewItem } from '../services/vendorReviewService';

interface ReviewCardProps {
  review: ReviewItem;
  onOpenReply: (review: ReviewItem) => void;
  onDeleteReply: (reviewId: string) => void;
  onTogglePin: (reviewId: string) => void;
  onToggleResolve: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onOpenReply,
  onDeleteReply,
  onTogglePin,
  onToggleResolve,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <View style={[styles.card, review.isPinned ? styles.cardPinned : null]}>
      {/* Pinned / Resolved Header Indicators */}
      <View style={styles.topBadgeRow}>
        {review.isPinned && (
          <View style={styles.pinBadge}>
            <Text style={styles.pinBadgeText}>📌 Pinned Review</Text>
          </View>
        )}
        {review.isResolved && (
          <View style={styles.resolvedBadge}>
            <Text style={styles.resolvedText}>✓ Resolved</Text>
          </View>
        )}
      </View>

      {/* Main Review Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: review.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{review.customerName}</Text>
          <Text style={styles.stars}>{renderStars(review.rating)}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.menuTrigger}>
          <Text style={styles.menuDots}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Review Details */}
      <Text style={styles.reviewText}>"{review.reviewText}"</Text>

      <View style={styles.metaRow}>
        <Text style={styles.serviceBadge}>🔧 {review.serviceName}</Text>
        <Text style={styles.bookingId}>#{review.bookingId}</Text>
        <Text style={styles.dateText}>🕒 {review.reviewDate}</Text>
      </View>

      {/* Vendor Reply Block */}
      {review.vendorReply ? (
        <View style={styles.replyBox}>
          <View style={styles.replyHeader}>
            <Text style={styles.replyTitle}>🏪 Your Response ({review.vendorReply.replyDate}):</Text>
            <TouchableOpacity onPress={() => onDeleteReply(review.id)}>
              <Text style={styles.deleteReplyText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.replyContent}>"{review.vendorReply.replyText}"</Text>
          <TouchableOpacity onPress={() => onOpenReply(review)} style={styles.editReplyBtn}>
            <Text style={styles.editReplyText}>✏️ Edit Response</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => onOpenReply(review)} style={styles.replyCtaBtn} activeOpacity={0.8}>
          <Text style={styles.replyCtaText}>💬 Reply to Customer Feedback</Text>
        </TouchableOpacity>
      )}

      {/* Actions Menu */}
      {menuOpen && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              onTogglePin(review.id);
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuItemText}>{review.isPinned ? '📌 Unpin Review' : '📌 Pin Review'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              onToggleResolve(review.id);
            }}
            style={[styles.menuItem, styles.borderTop]}
          >
            <Text style={styles.menuItemText}>{review.isResolved ? '✓ Mark Unresolved' : '✓ Mark Resolved'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              onOpenReply(review);
            }}
            style={[styles.menuItem, styles.borderTop]}
          >
            <Text style={styles.menuItemText}>✏️ Write / Edit Reply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  cardPinned: {
    borderColor: '#2563EB',
    backgroundColor: '#FAF5FF',
  },
  topBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  pinBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  pinBadgeText: {
    color: 'white',
    fontSize: 9.5,
    fontWeight: '800',
  },
  resolvedBadge: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  resolvedText: {
    color: '#166534',
    fontSize: 9.5,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  stars: {
    fontSize: 11,
    marginTop: 1,
  },
  menuTrigger: {
    padding: 4,
  },
  menuDots: {
    fontSize: 13,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  reviewText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  serviceBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  bookingId: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
    marginLeft: 'auto',
  },
  replyBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
    marginTop: 4,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  deleteReplyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  replyContent: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 16,
  },
  editReplyBtn: {
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  editReplyText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  replyCtaBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  replyCtaText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  menuOverlay: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    elevation: 6,
    zIndex: 999,
    width: 170,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItemText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#374151',
  },
});
export default ReviewCard;
