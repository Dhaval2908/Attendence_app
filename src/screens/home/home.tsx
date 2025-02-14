import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // For navigation
import { fontNormalize, fontSizeLarge, fontSizeMedium, smartScale } from '../../theme/constants/normalize';
import { Colors } from '../../theme/colors';
import Ionicons from "@react-native-vector-icons/Ionicons";

interface Event {
  id: string;
  name: string;
  description: string;
}

const events: Event[] = [
  { id: '1', name: 'Event 1', description: 'This is the first event.' },
  { id: '2', name: 'Event 2', description: 'This is the second event.' },
  { id: '3', name: 'Event 3', description: 'This is the third event.' },
  { id: '4', name: 'Event 3', description: 'This is the third event.' },
  // Add more events as needed
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToEventDetails = (eventId: string) => {
    // Fix the navigation type error by explicitly typing the screen name and parameters
    // navigation.navigate('EventDetails', { eventId });
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetails}>
      {/* <Ionicons name="calendar" /> */}
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Clock In</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Your Location</Text>
      <View style={styles.container}>
        <Text style={styles.title}>This is a basic container for map!</Text>
      </View>
      <Text style={styles.header1}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        style={styles.eventList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: '8%',
    marginTop: smartScale(20),
  },
  header1: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: smartScale(30),
    marginTop: smartScale(10),
  },
  container: {
    width: '90%',
    height: smartScale(200),
    backgroundColor: Colors.white,
    borderRadius: smartScale(15),
    marginHorizontal: '15%',
    marginVertical: smartScale(8),
    padding: smartScale(20),
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: smartScale(5), height: smartScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: smartScale(4),
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
  },
  eventList: {
    width: '90%',
    paddingTop: smartScale(5),
  },
  eventItem: {
    width: '97%',
    height: smartScale(80),
    backgroundColor: Colors.white,
    borderRadius: smartScale(10),
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: smartScale(5), height: smartScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: smartScale(4),
    elevation: 6,
    flexDirection: 'row',  // Aligns button and details in a row
    justifyContent: 'space-between',  //space between details and button
    marginHorizontal:'10%',
    alignItems: 'center',  // Center content vertically
    marginVertical:smartScale(10),
    paddingHorizontal: '5%'
  },
  eventDetails: {
    flex: 1,  // Take up available space for event name and description
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: fontSizeMedium,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: fontSizeMedium,
    marginBottom: smartScale(10),
  },
  button: {
      width: smartScale(100),
      height: smartScale(40),
      backgroundColor: Colors.secondaryColor,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: smartScale(30),
      marginBottom: smartScale(12),
    },
    buttonText: {
      color: Colors.primaryColor,
      fontSize: fontSizeMedium,
    },
});

export default HomeScreen;