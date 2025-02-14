import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { BottomTabParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { smartScale } from '../../theme/constants/normalize';
import Ionicons from "@react-native-vector-icons/ionicons";
import { Screen } from 'react-native-screens';

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

const HomeScreen = forwardRef<FlatList, HomeScreenProps>(({ route, onScroll }, ref) => {
  const navigation = useNavigation();

  const renderEventItem = ({ item }: { item: typeof events[0] }) => (
    <View style={styles.eventItem}>
      <Ionicons name="calendar" size={smartScale(50)} color={Colors.bg}/>
      <View style={styles.eventDetails}>
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
        ref={ref}
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        style={styles.eventList}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: smartScale(100) }} // Add padding for hidden nav
      />
    </View>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: '8%',
    marginTop: 20,
  },
  header1: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: 30,
    marginTop: 10,
  },
  container: {
    width: '90%',
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginHorizontal: '15%',
    marginVertical: 8,
    padding: 20,
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventList: {
    width: '90%',
    paddingTop: 5,
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