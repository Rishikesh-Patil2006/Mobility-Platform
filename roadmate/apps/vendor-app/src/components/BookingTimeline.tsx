import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimelineEvent } from '../services/vendorBookingService';

interface BookingTimelineProps {
  timeline: TimelineEvent[];
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ timeline = [] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>⏳ Booking Audit Timeline</Text>
      <View style={styles.list}>
        {timeline.map((event, idx) => {
          const isLast = idx === timeline.length - 1;
          return (
            <View key={event.id || idx} style={styles.row}>
              <View style={styles.lineCol}>
                <View style={[styles.dot, isLast ? styles.dotActive : null]} />
                {!isLast && <View style={styles.verticalLine} />}
              </View>
              <View style={styles.contentCol}>
                <Text style={[styles.title, isLast ? styles.titleActive : null]}>{event.title}</Text>
                <Text style={styles.timestamp}>{event.timestamp}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
  },
  header: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  list: {
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  lineCol: {
    alignItems: 'center',
    width: 20,
    marginRight: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94A3B8',
    marginTop: 2,
  },
  dotActive: {
    backgroundColor: '#2563EB',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
  },
  contentCol: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  titleActive: {
    color: '#1E3A8A',
    fontWeight: '800',
  },
  timestamp: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
});
export default BookingTimeline;
