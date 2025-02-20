import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { fontNormalize, fontSizeLarge, fontSizeMedium, fontSizeSmall, smartScale } from '../../theme/constants/normalize';
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import Geolocation from '@react-native-community/geolocation';

interface Event {
  id: string;
  name: string;
  description: string;
}

const events: Event[] = [
  { id: '1', name: 'Event 1', description: 'This is the first event.' },
  { id: '2', name: 'Event 2', description: 'This is the second event.' },
  { id: '3', name: 'Event 3', description: 'This is the third event.' },
  { id: '4', name: 'Event 4', description: 'This is the fourth event.' },
  { id: '5', name: 'Event 5', description: 'This is the fourth event.' },
];

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext)!;
  const [address, setAddress] = useState('Fetching location...');

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (info) => {
        console.log(info);
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

    const renderEventItem = ({ item }: { item: Event }) => (
      <View style={styles.eventItem}>
        <View style={styles.eventDetails}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primaryColor} />
            <Text style={styles.eventTitle}>{item.name}</Text>
          </View>
          <Text style={styles.eventDescription}>{item.description}</Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={() => console.log(`Navigating to ${item.id}`)}>
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <FlatList
      data={[]}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Your Location</Text>
          <View style={styles.container}>
            <Ionicons name="location-outline" size={smartScale(34)} color={Colors.primaryColor} />
            <Text style={styles.title}>{address}</Text>
          </View>

          <Text style={styles.header1}>Upcoming Events</Text>
        </>
      }
      ListFooterComponent={
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.eventList}
        />
      }
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    />
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingBottom: smartScale(30),
  },
  header: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    marginHorizontal: smartScale(30),
    marginTop: smartScale(20),
  },
  header1: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    marginHorizontal: smartScale(30),
    marginTop: smartScale(5),
  },
  container: {
    width: '85%',
    height: smartScale(120),
    backgroundColor: Colors.white,
    borderRadius: smartScale(10),
    margin: smartScale(15),
    padding: smartScale(34),
    paddingVertical : smartScale(35),
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: smartScale(5), height: smartScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: smartScale(4),
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection : 'row',
    gap: 10,
  },
  title: {
    fontSize: fontNormalize(15),

  },
  eventList: {
    width: '85%',
    paddingTop: smartScale(5),
    margin:'auto'
  },
  eventItem: {
    width: '85%',
    height: smartScale(80),
    backgroundColor: Colors.white,
    borderRadius: smartScale(10),
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '10%',
    alignItems: 'center',
    marginVertical: smartScale(8),
    paddingHorizontal: '5%',
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  eventTitle: {
    fontSize: fontNormalize(18),
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: fontSizeSmall,
    marginBottom: smartScale(10),
  },
  button: {
    width: smartScale(90),
    height: smartScale(35),
    backgroundColor: Colors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: smartScale(30),
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: fontSizeMedium,
  },
});