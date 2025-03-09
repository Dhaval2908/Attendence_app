
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import { Colors } from '../../../theme/colors/index';
import { fontNormalize, fontSizeLarge, fontSizeSmall, smartScale } from '../../../theme/constants/normalize';
import { IEvent } from '../../../navigation/types';

interface EventsProps {
  events: IEvent[];
  loading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
  onClockIn: (eventId: string) => void; // ✅ Added onClockIn function prop
}

const Events: React.FC<EventsProps> = ({ events, loading, onRefresh, refreshing, onClockIn }) => {
  const currentTime = moment(); // Get current time
  const [selectedCategory, setSelectedCategory] = useState<'Upcoming' | 'Ongoing' | 'Past'>('Upcoming'); // Initial category

  // Function to categorize events
  const categorizeEvents = (event: IEvent) => {
    const start = moment(event.startTime);
    const end = moment(event.endTime);

    if (currentTime.isBefore(start)) {
      return 'Upcoming'; // Event hasn't started yet
    } else if (currentTime.isBetween(start, end)) {
      return 'Ongoing'; // Event is currently happening
    } else {
      return 'Past'; // Event has ended
    }
  };

  // Filter events based on category
  const upcomingEvents = events.filter((event) => categorizeEvents(event) === 'Upcoming');
  const ongoingEvents = events.filter((event) => categorizeEvents(event) === 'Ongoing');
  const pastEvents = events.filter((event) => categorizeEvents(event) === 'Past');

  // Render event item for FlatList
  const renderEventItem = ({ item }: { item: IEvent }) => {
    const start = moment(item.startTime).format('MMM DD, YYYY • hh:mm A');
    const end = moment(item.endTime).format('hh:mm A');
    const category = categorizeEvents(item); // Get the category (Upcoming, Ongoing, or Past)

    return (
      <View style={styles.eventItem}>
        <View style={styles.eventDetails}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primaryColor} />
            <Text style={styles.eventTitle}>{item.name}</Text>
          </View>
          <Text style={styles.eventDescription}>{item.description}</Text>
          <Text style={styles.eventDate}>{`${start} - ${end}`}</Text>
        </View>
        {category !== 'Past' && (
          <TouchableOpacity style={styles.button} onPress={() => onClockIn(item._id)}>
            <Text style={styles.buttonText}>Clock In</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Determine which events to display based on selectedCategory
  const eventsToDisplay = selectedCategory === 'Upcoming' ? upcomingEvents : selectedCategory === 'Ongoing' ? ongoingEvents : pastEvents;

  return (
    <View style={styles.container}>
      {/* Category buttons */}
      <View style={styles.categoryButtons}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'Upcoming' && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory('Upcoming')}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === 'Upcoming' && styles.selectedCategoryButtonText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'Ongoing' && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory('Ongoing')}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === 'Ongoing' && styles.selectedCategoryButtonText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'Past' && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory('Past')}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === 'Past' && styles.selectedCategoryButtonText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      ) : (
        <>
          {eventsToDisplay.length > 0 ? (
            <FlatList
              data={eventsToDisplay}
              renderItem={renderEventItem}
              keyExtractor={(item) => item._id}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <Text style={styles.noEvents}>No events found</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: smartScale(20) },
  categoryButtons: {
    marginVertical: smartScale(5),
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align buttons to the left
  },
  categoryButton: {
    marginRight: smartScale(10), // Space between buttons
    paddingVertical: smartScale(8),
    paddingHorizontal: smartScale(8),
    borderRadius: smartScale(20),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black, // Black border for non-selected buttons
  },
  categoryButtonText: {
   fontSize: fontNormalize(13),
   color: Colors.black,
  },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: smartScale(10), marginVertical: smartScale(10), marginHorizontal: smartScale(6),backgroundColor: Colors.white, borderRadius: smartScale(10), elevation: 4 },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: fontSizeLarge, fontWeight: 'bold' },
  eventDescription: { fontSize: fontSizeSmall, marginBottom: smartScale(10) },
  button: {
    backgroundColor: Colors.secondaryColor,
    padding: smartScale(10),
    borderRadius: smartScale(5),
  },
  buttonText: { color: Colors.primaryColor, fontSize: fontSizeSmall },
  eventDate: {
    fontSize: fontSizeSmall,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginTop: smartScale(5),
  },
  noEvents: {
    textAlign: 'center',
    marginTop: smartScale(20),
    fontSize: fontSizeSmall,
    color: Colors.primaryColor,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,  // Highlight selected button with the primary color
  },
  selectedCategoryButtonText: {
    color: Colors.white,  // Change text color to white for selected button
  },
});

export default Events;
