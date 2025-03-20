import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useLocation } from '../../../context/LocationContext';
import { smartScale, fontNormalize } from '../../../theme/constants/normalize';
import { Colors } from '../../../theme/colors';

const Map = () => {
  const { address, loading, error } = useLocation();

  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={smartScale(34)} color={Colors.primaryColor} />
      {loading ? (
        <ActivityIndicator size="small" color={Colors.primaryColor} />
      ) : (
        <Text style={[styles.title, error && styles.errorText]}>
          {error ? error : address}
        </Text>
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    width: '85%',
    height: smartScale(120),
    backgroundColor: Colors.white,
    borderRadius: smartScale(10),
    margin: smartScale(15),
    padding: smartScale(34),
    alignSelf: 'center',
    shadowColor: Colors.bg,
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: fontNormalize(15),
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
