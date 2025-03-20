import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import Events from './components/event';
import Map from './components/map';
import { fontNormalize, fontSizeSmall, smartScale } from '../../theme/constants/normalize';
import { useEvents } from '../../context/EventsContext';  
import CategoryButtons from './components/CategoryButtons';
import { useLocation } from '../../context/LocationContext';

const HomeScreen = () => {
  const navigation = useNavigation(); 
  const { events, refreshEvents, loading: eventsLoading } = useEvents();
  const { fetchLocation } = useLocation();

  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Upcoming' | 'Ongoing' | 'Past'>('Upcoming');

  const faceAttendance = (eventId: string) => {
    navigation.navigate("FaceAttendance", { eventId });
  };

  useEffect(() => {
    handleInitialLoad();
  }, []);

  const handleInitialLoad = async () => {
    setLocationLoading(true);
    await fetchLocation();
    setLocationLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);  
    await Promise.all([
      fetchLocation(),
      refreshEvents()
    ]);
    setRefreshing(false);
  }, []);

  // Filter events based on selected category
  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    if (selectedCategory === 'Upcoming') {
      return eventStart > now;
    } else if (selectedCategory === 'Ongoing') {
      return eventStart <= now && eventEnd >= now;
    } else if (selectedCategory === 'Past') {
      return eventEnd < now;
    }

    return false;
  });

  return (
    <FlatList
      style={styles.container}
      data={filteredEvents}
      keyExtractor={(item) => item._id.toString()}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Your Location</Text>

          {locationLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : (
            <Map />
          )}

          <Text style={styles.header}>Events</Text>
          <CategoryButtons
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}  
          />

          {/* ✅ Only one spinner during refresh */}
          {(refreshing || eventsLoading) && (
            <ActivityIndicator size="large" color="#3b82f6" />
          )}
        </>
      }
      renderItem={({ item }) => (
        <Events
          events={[item]}    
          onRefresh={refreshEvents} 
          onClockIn={faceAttendance} 
          selectedCategory={selectedCategory}
          loading={false}    // ✅ No spinner inside `<Events />`
          refreshing={false} // ✅ No spinner inside `<Events />`
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3b82f6']}
        />
      }
      ListEmptyComponent={
        eventsLoading ? null : <Text style={styles.noEvents}>No events found</Text>
      }
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { 
    fontSize: fontNormalize(23), 
    fontWeight: 'bold', 
    marginHorizontal: smartScale(20), 
    marginTop: smartScale(20) 
  },
  noEvents: {
    textAlign: 'center',
    marginTop: smartScale(20),
    fontSize: fontSizeSmall,
    color: Colors.primaryColor,
  },
});
