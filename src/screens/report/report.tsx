import React, { useEffect, useState, useContext, useCallback } from "react";
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, 
  ScrollView, RefreshControl, Animated, Easing
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { AuthContext } from "../../context/AuthContext"; // Get token from context
import { EventsContext } from "../../context/EventsContext"; // Use event data
import Config from "react-native-config"; // For backend URL
import { IEvent } from "../../navigation/types";  // ✅ Use IEvent

const ReportScreen = () => {
  const { token } = useContext(AuthContext)!; // Get auth token
  const { events, refreshEvents } = useContext(EventsContext)!; // Get events & refresh function from context
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
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
    const event: IEvent | undefined = events.find(
      (e: IEvent) => new Date(e.startTime).toISOString().split('T')[0] === day.dateString
    ); // ✅ Ensure correct type
    if (event) {
      setSelectedEvent(event);
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
      <Text style={styles.title}>📊 Attendance Report</Text>

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
            <Text style={styles.modalText}>Event: {selectedEvent?.name}</Text>
            <Text style={styles.modalText}>Description: {selectedEvent?.description}</Text>
            <TouchableOpacity onPress={() => {
              Animated.timing(modalAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }).start(() => setModalVisible(false));
            }} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16, color: "#333" },
  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  box: { width: "48%", padding: 16, borderRadius: 12, elevation: 3, marginBottom: 10 },
  label: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  value: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 4 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 15, width: "80%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10 },
  modalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  closeButton: { marginTop: 10, padding: 10, backgroundColor: "#3b82f6", borderRadius: 8 },
  closeText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ReportScreen;