import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import { Colors } from '../../../theme/colors/index';
import { fontSizeLarge, fontSizeSmall, smartScale } from '../../../theme/constants/normalize';
import { IEvent } from '../../../navigation/types';

interface EventsProps {
  events: IEvent[];
  loading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
  onClockIn: (eventId: string) => void; // ✅ Added onClockIn function prop
}

const Events: React.FC<EventsProps> = ({ events, loading, onRefresh, refreshing, onClockIn }) => {
  const renderEventItem = ({ item }: { item: IEvent }) => {
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
        <TouchableOpacity 
          style={[styles.button, { opacity: item.isClockInAllowed ? 1 : 0.5 }]} onPress={() => onClockIn(item._id)} disabled={!item.isClockInAllowed} >
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return ( // ✅ Make sure return is inside the function
    <FlatList
      data={events}
      ListEmptyComponent={
        loading ? <ActivityIndicator size="large" color={Colors.primaryColor} /> : <Text style={styles.noEvents}>No upcoming events</Text>
      }
      renderItem={renderEventItem}
      keyExtractor={(item) => item._id}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default Events;

const styles = StyleSheet.create({
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: smartScale(10), margin: smartScale(10), backgroundColor: Colors.white, borderRadius: smartScale(10), elevation: 4 },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: fontSizeLarge, fontWeight: 'bold' },
  eventDescription: { fontSize: fontSizeSmall, marginBottom: smartScale(10) },
  button: { backgroundColor: Colors.secondaryColor, padding: smartScale(10), borderRadius: smartScale(5) },
  buttonText: { color: Colors.primaryColor, fontSize: fontSizeSmall },
  eventDate: { fontSize: fontSizeSmall, fontWeight: '600', color: Colors.primaryColor, marginTop: smartScale(5) },
  noEvents: { textAlign: 'center', marginTop: smartScale(20), fontSize: fontSizeSmall, color: Colors.primaryColor },
});
