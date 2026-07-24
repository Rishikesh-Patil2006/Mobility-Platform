import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import {
  fetchNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  fetchActivityTimeline,
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '../services/vendorNotificationCenterService';

export default function NotificationCenterModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('feed'); // feed | timeline | preferences

  const [notifications, setNotifications] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [preferences, setPreferences] = useState({
    reviews: true,
    listings: true,
    tips: true,
    subscription: true,
    verification: true,
    announcements: true,
    general: true,
  });

  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const loadData = async () => {
    const notifs = await fetchNotifications();
    const timeL = await fetchActivityTimeline();
    const prefs = await fetchNotificationPreferences();

    setNotifications(notifs);
    setTimeline(timeL);
    setPreferences(prefs);
  };

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const unreadCount = getUnreadCount(notifications);

  const handleMarkSingleRead = async (id) => {
    const updated = await markAsRead(id);
    setNotifications(updated);
    triggerToast('Marked as read');
  };

  const handleMarkAllRead = async () => {
    const updated = await markAllAsRead();
    setNotifications(updated);
    triggerToast('All notifications marked as read');
  };

  const handleDeleteSingle = async (id) => {
    const updated = await deleteNotification(id);
    setNotifications(updated);
    triggerToast('Notification deleted');
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notification items from your feed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const updated = await clearAllNotifications();
            setNotifications(updated);
            triggerToast('Notifications cleared');
          },
        },
      ]
    );
  };

  const handleTogglePreference = async (key, val) => {
    const updated = await updateNotificationPreferences({ [key]: val });
    setPreferences(updated);
    triggerToast('Notification preference saved');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View>
              <View style={styles.titleWithBadge}>
                <Text style={styles.modalTitle}>🔔 Notification & Activity Center</Text>
                {unreadCount > 0 ? (
                  <View style={styles.unreadCountBadge}>
                    <Text style={styles.unreadCountText}>{unreadCount} Unread</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.modalSub}>Centralized audit history, alerts & notification settings</Text>
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

          {/* Sub-Tab Navigation Bar */}
          <View style={styles.tabBar}>
            {[
              { key: 'feed', label: `🔔 Feed (${unreadCount > 0 ? unreadCount : notifications.length})` },
              { key: 'timeline', label: `📜 Activity Log (${timeline.length})` },
              { key: 'preferences', label: `⚙️ Preferences` },
            ].map((tb) => {
              const active = activeTab === tb.key;
              return (
                <TouchableOpacity
                  key={tb.key}
                  onPress={() => setActiveTab(tb.key)}
                  style={[styles.tabItem, active ? styles.tabItemActive : null]}
                >
                  <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>{tb.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── TAB 1: NOTIFICATIONS FEED ── */}
          {activeTab === 'feed' && (
            <View style={{ flex: 1 }}>
              {/* Batch Action Bar */}
              <View style={styles.batchActionBar}>
                <TouchableOpacity onPress={handleMarkAllRead} style={styles.batchBtn}>
                  <Text style={styles.batchBtnText}>✓ Mark All as Read</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
                  <Text style={styles.clearAllText}>🗑️ Clear All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <View
                      key={notif.id}
                      style={[styles.notifCard, !notif.isRead ? styles.unreadCard : null, { borderLeftColor: notif.accentColor || '#1E3A8A' }]}
                    >
                      <View style={styles.notifHeaderRow}>
                        <View style={styles.notifIconBox}>
                          <Text style={styles.notifIcon}>{notif.icon || '🔔'}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.notifTitle}>{notif.title}</Text>
                          <Text style={styles.notifTime}>{notif.date} · {notif.time}</Text>
                        </View>

                        {!notif.isRead && (
                          <View style={styles.blueDotBadge}>
                            <Text style={styles.blueDotText}>NEW</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.notifMessage}>{notif.message}</Text>

                      <View style={styles.notifActionsRow}>
                        {!notif.isRead && (
                          <TouchableOpacity onPress={() => handleMarkSingleRead(notif.id)} style={styles.actionBtn}>
                            <Text style={styles.actionText}>Mark Read</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => handleDeleteSingle(notif.id)} style={styles.deleteBtn}>
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No notifications in your feed.</Text>
                )}
              </ScrollView>
            </View>
          )}

          {/* ── TAB 2: ACTIVITY TIMELINE ── */}
          {activeTab === 'timeline' && (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionSubHeader}>📜 Platform Audit Activity History</Text>

              {timeline.length > 0 ? (
                timeline.map((act) => (
                  <View key={act.id} style={styles.timelineCard}>
                    <View style={styles.timelineHeaderRow}>
                      <Text style={styles.timelineIcon}>{act.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.timelineTitle}>{act.title}</Text>
                        <Text style={styles.timelineTime}>{act.date} at {act.time}</Text>
                      </View>

                      <View style={styles.statusTag}>
                        <Text style={styles.statusTagText}>{act.status}</Text>
                      </View>
                    </View>

                    <Text style={styles.timelineDesc}>{act.description}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No activity history recorded.</Text>
              )}
            </ScrollView>
          )}

          {/* ── TAB 3: PREFERENCES ── */}
          {activeTab === 'preferences' && (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionSubHeader}>⚙️ Notification Channel Settings</Text>

              {[
                { key: 'reviews', label: 'Customer Reviews', desc: 'Alert when a customer posts a review', icon: '⭐' },
                { key: 'listings', label: 'Listings & Services', desc: 'Alert when listing status changes', icon: '📋' },
                { key: 'tips', label: 'Educational Tips & Care', desc: 'Alert when tips are published or approved', icon: '🛠️' },
                { key: 'subscription', label: 'Subscription Expiry', desc: 'Alert for annual plan expiry advisories', icon: '💳' },
                { key: 'verification', label: 'Business Verification', desc: 'Alert when shop documents are verified', icon: '✅' },
                { key: 'announcements', label: 'Super Admin Announcements', desc: 'Alert for platform marketing boosts', icon: '📢' },
                { key: 'general', label: 'System & General Updates', desc: 'Platform system maintenance notifications', icon: '🔔' },
              ].map((pref) => (
                <View key={pref.key} style={styles.prefRow}>
                  <Text style={styles.prefIcon}>{pref.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prefTitle}>{pref.label}</Text>
                    <Text style={styles.prefDesc}>{pref.desc}</Text>
                  </View>
                  <Switch
                    value={!!preferences[pref.key]}
                    onValueChange={(val) => handleTogglePreference(pref.key, val)}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={preferences[pref.key] ? '#1E3A8A' : '#94A3B8'}
                  />
                </View>
              ))}
            </ScrollView>
          )}
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
    maxHeight: '94%',
    height: '94%',
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
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  unreadCountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unreadCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2.5,
    borderColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#1E3A8A',
    fontWeight: '900',
  },
  batchActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  batchBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  batchBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  clearAllBtn: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearAllText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#991B1B',
  },
  notifCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  unreadCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#93C5FD',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notifIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: {
    fontSize: 14,
  },
  notifTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  notifTime: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  blueDotBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  blueDotText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },
  notifMessage: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
    marginBottom: 8,
  },
  notifActionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 6,
  },
  actionBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  sectionSubHeader: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  timelineTime: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  statusTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#166534',
  },
  timelineDesc: {
    fontSize: 11.5,
    color: '#475569',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  prefIcon: {
    fontSize: 18,
  },
  prefTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  prefDesc: {
    fontSize: 10.5,
    color: '#64748B',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 30,
  },
});
