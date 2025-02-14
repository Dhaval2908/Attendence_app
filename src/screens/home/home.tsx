// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../navigation/types';

type HomeScreenRouteProp = RouteProp<BottomTabParamList, 'Home'>;

const HomeScreen = ({ route }: { route: HomeScreenRouteProp }) => {
  const { studentId, email } = route.params || {};
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      {studentId && <Text>Student ID: {studentId}</Text>}
      {email && <Text>Email: {email}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;