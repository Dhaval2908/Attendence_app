import React, { useEffect, useState, useContext, useCallback } from "react";
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, 
  ScrollView, RefreshControl, Animated, Easing,
  Dimensions
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { AuthContext } from "../../context/AuthContext"; // Get token from context
import { EventsContext } from "../../context/EventsContext"; // Use event data
import Config from "react-native-config"; // For backend URL
import { IEvent } from "../../navigation/types";  // ✅ Use IEvent
import { fontNormalize, smartScale } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";

// Get the screen height dynamically
const { height: screenHeight } = Dimensions.get('window');

// Define the maximum height as half of the screen height
const maxEventHeight = screenHeight / 2;


const ReportScreen = () => {
  const { token } = useContext(AuthContext)!; // Get auth token
  const { events, refreshEvents } = useContext(EventsContext)!; // Get events & refresh function from context
  const [selectedEvents, setSelectedEvents] = useState<IEvent[]>([]); // Store multiple events
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ Track refresh state
  const modalAnim = useState(new Animated.Value(0))[0];

  // Fetch attendance statistics
  const fetchAttendanceStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${Config.BASE_URL}/api/attendance/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAttendanceStats(data);
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStats();
  }, [token]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshEvents(), fetchAttendanceStats()]); // Refresh events & stats
    setRefreshing(false);
  }, [refreshEvents]);

  // Handle calendar day press
  const handleDayPress = (day: DateData) => {
    const eventsForTheDay = events.filter(
      (e: IEvent) => new Date(e.startTime).toISOString().split('T')[0] === day.dateString
    ); // Get all events for the selected day
    if (eventsForTheDay.length > 0) {
      setSelectedEvents(eventsForTheDay); // Store multiple events
      setModalVisible(true);
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Attendance Report</Text>

      {/* Pull-to-refresh wrapper */}
      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <View style={styles.statsContainer}>
            <View style={[styles.box, { backgroundColor: "#3b82f6" }]}>
              <Text style={styles.label}>Total Events</Text>
              <Text style={styles.value}>{events.length}</Text>
            </View>
            <View style={[styles.box, { backgroundColor: "#22c55e" }]}>
              <Text style={styles.label}>Present</Text>
              <Text style={styles.value}>{attendanceStats.present}</Text>
            </View>
            <View style={[styles.box, { backgroundColor: "#ef4444" }]}>
              <Text style={styles.label}>Absent</Text>
              <Text style={styles.value}>{attendanceStats.absent}</Text>
            </View>
            <View style={[styles.box, { backgroundColor: "#eab308" }]}>
              <Text style={styles.label}>Late</Text>
              <Text style={styles.value}>{attendanceStats.late}</Text>
            </View>
          </View>
        )}

        {/* Calendar with marked events */}
        <Calendar
          markedDates={events.reduce((acc: Record<string, any>, event: IEvent) => {
            const eventDate = new Date(event.startTime).toISOString().split('T')[0];
            acc[eventDate] = { selected: true, marked: true, selectedColor: "#3b82f6" };
            return acc;
          }, {})}
          onDayPress={handleDayPress}
        />
      </ScrollView>

      {/* Event Modal with Animation */}
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: modalAnim }] }]}> 
            <Text style={styles.modalText}>
              Events on {selectedEvents[0] ? new Date(selectedEvents[0].startTime).toISOString().split('T')[0] : ""}
            </Text>
            
            {/* ✅ Wrap in ScrollView for scrolling */}
            <ScrollView 
              style={{ maxHeight: maxEventHeight, width: "100%" }} 
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.eventContainer}>
                {selectedEvents.map((event, index) => (
                  <View key={index} style={styles.eventBox}>
                    <Text style={styles.eventName}>Event: {event.name}</Text>
                    <Text style={styles.eventDescription}>Description: {event.description}</Text>
                    <Text style={styles.eventTime}>Time: {new Date(event.startTime).toLocaleTimeString()}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              onPress={() => {
                Animated.timing(modalAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => setModalVisible(false));
              }} 
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: smartScale(15),
    backgroundColor: Colors.white,
  },
  eventContainer: {
    width: "100%",
    padding: smartScale(10),
    overflow: 'scroll',  // Enables scrolling if content exceeds maxHeight
  },
  eventBox: {
    padding: smartScale(15),
    marginBottom: smartScale(15),
    backgroundColor: Colors.white_bb,  // Light gray background for event box
    borderRadius: smartScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: smartScale(5),
    borderWidth: 1,
    borderColor: "#e5e7eb",  // Light border color
  },
  eventName: {
    fontSize: fontNormalize(18),
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: smartScale(5),
  },
  eventDescription: {
    fontSize: fontNormalize(16),
    color: Colors.bg,
    marginBottom: smartScale(5),
  },
  eventTime: {
    fontSize: fontNormalize(14),
    color: Colors.primaryColor,
    marginBottom: smartScale(5),
  },
  title: {
    fontSize: fontNormalize(22),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: smartScale(15),
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: smartScale(20),
  },
  box: {
    width: "45%",
    margin: smartScale(8),
    padding: smartScale(15),
    borderRadius: smartScale(20),
    elevation: 0,
    marginBottom: smartScale(15),
  },
  label: {
    color: Colors.white,
    fontSize: fontNormalize(16),
    fontWeight: "bold",
  },
  value: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "900",
    marginTop: smartScale(5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: smartScale(30),
    borderRadius: smartScale(20),
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: smartScale(10),
  },
  modalText: {
    fontSize: fontNormalize(18),
    fontWeight: "bold",
    marginBottom: smartScale(10),
    textAlign: "center",
  },
  eventItem: {
    marginBottom: smartScale(15),
  },
  closeButton: {
    marginTop: smartScale(10),
    paddingHorizontal: smartScale(20),
    paddingVertical: smartScale(10),
    backgroundColor: "#3b82f6",
    borderRadius: smartScale(20),
  },
  closeText: {
    color: Colors.white,
    fontSize: fontNormalize(16),
    fontWeight: "bold",
  },
});

export default ReportScreen;