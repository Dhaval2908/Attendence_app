import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Config from 'react-native-config';
import Events from './components/event';
import Map from './components/map';
import { IEvent } from '../../navigation/types';
import { fontNormalize, smartScale } from '../../theme/constants/normalize';

interface EventWithClockIn extends IEvent {
  isClockInAllowed: boolean;
}

const HomeScreen = () => {
  const navigation = useNavigation(); 
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
        const filteredEvents = data.filter(event => {return event.registeredStudents.includes(user.id);}).map(event => ({
          ...event,
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
      <Text style={styles.header}>Events</Text>
      <Events events={events} loading={loading} onRefresh={fetchEvents} refreshing={refreshing} onClockIn={faceAttendance} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { fontSize: fontNormalize(23), fontWeight: 'bold', marginHorizontal: smartScale(20),marginTop:smartScale(20) },
});
