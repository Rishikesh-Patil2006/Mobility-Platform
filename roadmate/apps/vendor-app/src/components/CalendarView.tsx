import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BookingItem } from '../services/vendorBookingService';
import BookingCard from './BookingCard';

interface CalendarViewProps {
  bookings: BookingItem[];
  onSelectBooking: (b: BookingItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  bookings = [],
  onSelectBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate next 14 days list
  const datesList = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() + i * 86400000);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = i === 0;

    // Count bookings on this day
    const dayBookings = bookings.filter((b) => b.bookingDate === iso);

    return {
      iso,
      dayName,
      dayNum,
      isToday,
      bookingCount: dayBookings.length,
    };
  });

  const selectedDayBookings = bookings.filter((b) => b.bookingDate === selectedDate);

  return (
    <View style={styles.container}>
      {/* Date Carousel Selector */}
      <Text style={styles.title}>📆 Schedule Calendar View</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateCarousel}>
        {datesList.map((item) => {
          const isSelected = selectedDate === item.iso;
          return (
            <TouchableOpacity
              key={item.iso}
              onPress={() => setSelectedDate(item.iso)}
              style={[
                styles.dateCard,
                isSelected ? styles.dateCardSelected : null,
                item.isToday ? styles.dateCardToday : null,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayName, isSelected ? styles.textSelected : null]}>
                {item.dayName}
              </Text>
              <Text style={[styles.dayNum, isSelected ? styles.textSelected : null]}>
                {item.dayNum}
              </Text>
              {item.bookingCount > 0 && (
                <View style={[styles.dotBadge, isSelected ? styles.dotBadgeSelected : null]}>
                  <Text style={[styles.dotText, isSelected ? styles.dotTextSelected : null]}>
                    {item.bookingCount} slot{item.bookingCount > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Booked Slots Details for selected date */}
      <View style={styles.slotsSection}>
        <Text style={styles.sectionHeader}>
          Bookings for {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate} ({selectedDayBookings.length})
        </Text>

        {selectedDayBookings.length > 0 ? (
          selectedDayBookings.map((b) => (
            <BookingCard key={b.id} booking={b} onPressDetails={() => onSelectBooking(b)} />
          ))
        ) : (
          <View style={styles.emptySlotBox}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No bookings scheduled for this date.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dateCarousel: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  dateCard: {
    width: 64,
    height: 74,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  dateCardToday: {
    borderColor: '#2563EB',
  },
  dateCardSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  dayName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 2,
  },
  textSelected: {
    color: 'white',
  },
  dotBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  dotBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  dotTextSelected: {
    color: 'white',
  },
  slotsSection: {
    marginTop: 6,
  },
  sectionHeader: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
  },
  emptySlotBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
export default CalendarView;
