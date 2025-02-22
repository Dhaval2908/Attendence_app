import React, { useContext, useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fontNormalize, fontSizeLarge, fontSizeSmall, smartScale } from '../../theme/constants/normalize';
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
import moment from 'moment';

interface Event {
  _id: string;
  name: string;
  description: string;
  registeredStudents: string[];
  startTime: Date | string | number;
  endTime: Date | string | number;
}

const HomeScreen = () => {
  const { user, token } = useContext(AuthContext)!;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Fetching location...');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${Config.BASE_URL}/api/events/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Event[] = await response.json();

        if (Array.isArray(data)) {
          const filteredEvents = data.filter(event => event.registeredStudents.includes(user.id));
          setEvents(filteredEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, token]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (info) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${info.coords.latitude}&lon=${info.coords.longitude}`
          );
          const data = await response.json();
          setAddress(data.display_name || 'Address not found');
        } catch (error) {
          console.error('Error fetching address:', error);
          setAddress('Failed to fetch address');
        }
      },
      (error) => setAddress('Location permission denied'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);
  const renderEventItem = ({ item }: { item: Event }) => {
    // Convert timestamps into readable format
    const start = moment(item.startTime).format('MMM DD, YYYY • hh:mm A');
    const end = moment(item.endTime).format('hh:mm A');

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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={events}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Your Location</Text>
          <View style={styles.container}>
            <Ionicons name="location-outline" size={smartScale(34)} color={Colors.primaryColor} />
            <Text style={styles.title}>{address}</Text>
          </View>
          <Text style={styles.header}>Upcoming Events</Text>
        </>
      }
      ListEmptyComponent={
        loading ? <ActivityIndicator size="large" color={Colors.primaryColor} /> : <Text style={styles.noEvents}>No upcoming events</Text>
      }
      renderItem={renderEventItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.scrollContainer}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: Colors.white, paddingBottom: smartScale(30) },
  header: { fontSize: fontSizeLarge, fontWeight: 'bold', margin: smartScale(20) },
  container: { width: '85%', height: smartScale(120), backgroundColor: Colors.white, borderRadius: smartScale(10), margin: smartScale(15), padding: smartScale(34), alignSelf: 'center', shadowColor: Colors.bg, shadowOffset: { width: smartScale(5), height: smartScale(4) }, shadowOpacity: 0.1, shadowRadius: smartScale(4), elevation: 6, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  title: { fontSize: fontNormalize(15) },
  noEvents: { textAlign: 'center', marginTop: smartScale(20), fontSize: fontSizeSmall, color: Colors.primaryColor },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: smartScale(10), margin: smartScale(10), backgroundColor: Colors.white, borderRadius: smartScale(10), elevation: 4 },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: fontSizeLarge, fontWeight: 'bold' },
  eventDescription: { fontSize: fontSizeSmall, marginBottom: smartScale(10) },
  button: { backgroundColor: Colors.secondaryColor, padding: smartScale(10), borderRadius: smartScale(5) },
  buttonText: { color: Colors.primaryColor, fontSize: fontSizeSmall }, eventDate: {
    fontSize: fontSizeSmall,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginTop: smartScale(5)
  },

});
