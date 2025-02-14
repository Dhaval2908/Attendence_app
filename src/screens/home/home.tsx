import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // For navigation
import { fontNormalize, fontSizeLarge, fontSizeMedium, smartScale } from '../../theme/constants/normalize';
import { Colors } from '../../theme/colors';

interface Event {
  id: string;
  name: string;
  description: string;
}

const events: Event[] = [
  { id: '1', name: 'Event 1', description: 'This is the first event.' },
  { id: '2', name: 'Event 2', description: 'This is the second event.' },
  { id: '3', name: 'Event 3', description: 'This is the third event.' },
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
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Button 
        title="View Details" 
        onPress={() => navigateToEventDetails(item.id)} // Navigate to EventDetailsScreen
      />
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
    backgroundColor: Colors.white_bg,
  },
  header: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: smartScale(30),
    marginTop: smartScale(20),
  },header1: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: smartScale(30),
    marginTop: smartScale(5),
  },
  container: {
    width: smartScale(310),
    height: smartScale(200),
    backgroundColor: Colors.white,
    borderRadius: smartScale(15),
    margin: smartScale(15),
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
    width: '100%',
    paddingTop: smartScale(20),
  },
  eventItem: {
    backgroundColor: Colors.white,
    borderRadius: smartScale(10),
    margin: smartScale(10),
    padding: smartScale(15),
    shadowColor: Colors.bg,
    shadowOffset: { width: smartScale(5), height: smartScale(4) },
    shadowOpacity: 0.1,
    shadowRadius: smartScale(4),
    elevation: 5,
  },
  eventTitle: {
    fontSize: fontSizeMedium,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: fontSizeMedium,
    marginBottom: smartScale(10),
  },
});

export default HomeScreen;
