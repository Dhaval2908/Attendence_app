import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Events from './components/event';
import Map from './components/map';
import { fontNormalize, smartScale } from '../../theme/constants/normalize';
import { useEvents } from '../../context/EventsContext';  

const HomeScreen = () => {
  const navigation = useNavigation(); 
  const { events, refreshEvents } = useEvents();  // ✅ Now using events from context
  const [refreshing, setRefreshing] = useState(false);

  const faceAttendance = (eventId: string) => {
    navigation.navigate("FaceAttendance", { eventId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Location</Text>
      <Map />
      <Text style={styles.header}>Events</Text>

      {events.length > 0 ? (
        <Events events={events} onRefresh={refreshEvents} refreshing={refreshing} onClockIn={faceAttendance} loading={false} />
      ) : (
        <ActivityIndicator size="large" color="#3b82f6" />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { fontSize: fontNormalize(23), fontWeight: 'bold', marginHorizontal: smartScale(20), marginTop: smartScale(20) },
});
