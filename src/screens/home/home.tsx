import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import { fontSizeLarge, fontSizeMedium, smartScale } from '../../theme/constants/normalize';
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import Geolocation from '@react-native-community/geolocation';
import { BottomTabParamList } from '../../navigation/types';
import { RouteProp } from '@react-navigation/native';

interface HomeScreenProps {
  route: RouteProp<BottomTabParamList, 'Home'>;
  onScroll?: (event: any) => void;
}

const events = [
  { id: '1', name: 'Event 1', description: 'This is the first event.' },
  { id: '2', name: 'Event 2', description: 'This is the second event.' },
  { id: '3', name: 'Event 3', description: 'This is the third event.' },
  { id: '4', name: 'Event 4', description: 'This is the fourth event.' },
];

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext)!;
  const [address, setAddress] = useState('Fetching location...');

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(
  //     async (info) => {
  //       try {
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${info.coords.latitude}&lon=${info.coords.longitude}`
  //         );
  //         const data = await response.json();
  //         setAddress(data.display_name || 'Address not found');
  //       } catch (error) {
  //         console.error('Error fetching address:', error);
  //         setAddress('Failed to fetch address');
  //       }
  //     },
  //     (error) => setAddress('Location permission denied'),
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // }, []);
  Geolocation.getCurrentPosition(async(info) =>
    {console.log(info)
     console.log(info.coords.latitude)
     console.log(info.coords.longitude)
     try {
       const response = await fetch(
         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${info.coords.latitude}&lon=${info.coords.longitude}`
       );
       const data = await response.json();
       if (data && data.display_name) {
         setAddress(data.display_name);
         
       } else {
         setAddress("Address not found");
       }
     } catch (error) {
       console.error("Error fetching address:", error);
       setAddress("Failed to fetch address");
     }
     
    });
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
    <ScrollView contentContainerStyle={styles.scrollContainer}showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Your Location</Text>
      <View style={styles.container}>
      <Ionicons name="location-outline" size={40} color={Colors.primaryColor} style={{ marginLeft: 15 }} />
        <Text style={styles.title}>{address}</Text>
      </View>

      <Text style={styles.header1}>Upcoming Events</Text>
      <FlatList
        ref={ref}
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        style={styles.eventList}
        contentContainerStyle={{ paddingBottom: smartScale(50) }} // Extra padding for smooth scrolling
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingBottom: smartScale(30),
  },
  header: {
    fontSize: 24,
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
    width: smartScale(310),
    height: smartScale(140),
    backgroundColor: Colors.white,
    borderRadius: smartScale(15),
    margin: smartScale(15),
    padding: smartScale(34),
    // paddingVertical : smartScale(35),
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection : 'row',
    gap: 10,
  },
  title: {
<<<<<<< HEAD
    fontSize: fontSizeMedium,

=======
    fontSize: 20,
    fontWeight: 'bold',
>>>>>>> e72d86a4a99c1dd541bb3075bbc2740cd2ad93e0
  },
  eventList: {
    width: '90%',
    paddingTop: 5,
<<<<<<< HEAD
    margin:'auto'
=======
>>>>>>> e72d86a4a99c1dd541bb3075bbc2740cd2ad93e0
  },
  eventItem: {
    width: '97%',
    height: 80,
    backgroundColor: Colors.white,
    borderRadius: 10,
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
    marginVertical: 10,
    paddingHorizontal: '5%',
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: Colors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
});

export default HomeScreen;