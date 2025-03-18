import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator, 
  Alert, Animated, Easing, Modal, TouchableWithoutFeedback, TouchableOpacity 
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Geolocation from '@react-native-community/geolocation';
import { smartScale, fontNormalize, fontSizeMedium, fontSizeSmall } from '../../../theme/constants/normalize';
import { Colors } from '../../../theme/colors';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const fetchAddress = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || 'Address not found';
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Failed to fetch address';
  }
};

const Map = () => {
  const [address, setAddress] = useState<string>('Fetching location...');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showModal = (message: string, type: string) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    setModalVisible(false);
    setLoading(true); // Show loader again before rechecking location
    updateAddress(); // Recheck GPS when modal is dismissed
  };

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: parseFloat(position.coords.latitude.toFixed(5)),
            lng: parseFloat(position.coords.longitude.toFixed(5)),
          });
        },
        (error) => {
          switch (error.code) {
            case 1:
              reject('Permission denied');
              break;
            case 2:
              showModal("Please enable live location", "error");
              reject('GPS is turned off or unavailable');
              break;
            case 3:
              reject('Location request timed out');
              break;
            default:
              reject('Unknown location error');
          }
        },
      );
    });
  };

  const updateAddress = async () => {
    try {
      const { lat, lng }: any = await getLocation();
      console.log("lat:", lat);
      console.log("lng:", lng);
      const fetchedAddress = await fetchAddress(lat, lng);
      setAddress(fetchedAddress);
    } catch (error) {
      setAddress('Location unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateAddress();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={smartScale(34)} color={Colors.primaryColor} />
      {loading ? <ActivityIndicator size="small" color={Colors.primaryColor} /> : <Text style={styles.title}>{address}</Text>}
      
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={hideModal}>
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
              <Text style={styles.modalTitle}>{modalType === "success" ? "Success!" : "Oops!"}</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Okay</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: { 
    width: '85%', height: smartScale(120), backgroundColor: Colors.white, 
    borderRadius: smartScale(10), margin: smartScale(15), padding: smartScale(34), 
    alignSelf: 'center', shadowColor: Colors.bg, shadowOffset: { width: smartScale(5), height: smartScale(4) }, 
    shadowOpacity: 0.1, shadowRadius: smartScale(4), elevation: 6, 
    justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 
  },
  title: { fontSize: fontNormalize(15) },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    width: smartScale(300),
    borderRadius: smartScale(15),
    padding: smartScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: fontSizeMedium,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: smartScale(10),
  },
  modalMessage: {
    fontSize: fontSizeSmall,
    color: Colors.bg,
    marginBottom: smartScale(20),
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: smartScale(10),
    paddingHorizontal: smartScale(20),
    borderRadius: smartScale(25),
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: fontSizeMedium,
  },
});
