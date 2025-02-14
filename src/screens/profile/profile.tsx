// screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../navigation/types';

type ProfileScreenRouteProp = RouteProp<BottomTabParamList, 'Profile'>;

const ProfileScreen = ({ route }: { route: ProfileScreenRouteProp }) => {
  const { userId } = route.params || {};
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {userId && <Text>User ID: {userId}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProfileScreen;