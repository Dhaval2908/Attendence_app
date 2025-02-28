import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Geolocation from '@react-native-community/geolocation';
import { smartScale, fontNormalize } from '../../../theme/constants/normalize';
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
          reject(error);
        },
      );
    });
  };

  useEffect(() => {
    const updateAddress = async () => {
      try {
        const { lat, lng }: any = await getLocation();
        const fetchedAddress = await fetchAddress(lat, lng);
        setAddress(fetchedAddress);
      } catch (error) {
        setAddress('Location unavailable');
      } finally {
        setLoading(false);
      }
    };

    updateAddress();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={smartScale(34)} color={Colors.primaryColor} />
      {loading ? <ActivityIndicator size="small" color={Colors.primaryColor} /> : <Text style={styles.title}>{address}</Text>}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: { width: '85%', height: smartScale(120), backgroundColor: Colors.white, borderRadius: smartScale(10), margin: smartScale(15), padding: smartScale(34), alignSelf: 'center', shadowColor: Colors.bg, shadowOffset: { width: smartScale(5), height: smartScale(4) }, shadowOpacity: 0.1, shadowRadius: smartScale(4), elevation: 6, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  title: { fontSize: fontNormalize(15) },
});
