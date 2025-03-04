import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native"; // ✅ Moved inside the component
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Config from 'react-native-config';
import Events from './components/event';
import Map from './components/map';
import { IEvent } from '../../navigation/types';


interface EventWithClockIn extends IEvent {
  isClockInAllowed: boolean;
}


const HomeScreen = () => {
  const navigation = useNavigation(); // ✅ Now inside the component
  const { user, token } = useContext(AuthContext)!;
  const [events, setEvents] = useState<IEvent[]>(() => []);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const response = await fetch(`${Config.BASE_URL}/api/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        const filteredEvents = data.filter(event => event.registeredStudents.includes(user.id)).map(event => ({
          ...event,
          isClockInAllowed: checkClockInAllowed(event.startTime,),
        }));
        setEvents(filteredEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to check if Clock In is allowed (within 5 minutes before event start)
  const checkClockInAllowed = (eventStartTime: string): boolean => {
    const now = new Date();
    const eventStart = new Date(eventStartTime);

    // Check if event date matches the current date
    const isSameDate = now.toDateString() === eventStart.toDateString();

    // Calculate the difference in minutes
    const differenceInMinutes = (eventStart.getTime() - now.getTime()) / (1000 * 60);

    // Return true only if same date and within 5 minutes before the event start time
    return isSameDate && differenceInMinutes <= 5 && differenceInMinutes >= 0;
  };

  useEffect(() => {
    fetchEvents();
  }, [user, token]);

  const faceAttendance = (eventId: string) => {
    navigation.navigate("FaceAttendance", { eventId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Location</Text>
      <Map />
      <Text style={styles.header}>Upcoming Events</Text>
      <Events events={events} loading={loading} onRefresh={fetchEvents} refreshing={refreshing} onClockIn={faceAttendance} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { fontSize: 20, fontWeight: 'bold', margin: 20 },
});
