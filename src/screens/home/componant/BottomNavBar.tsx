// navigation/BottomTabNavigator.tsx
import React from 'react';
import { useRoute } from '@react-navigation/native';
import HomeScreen from '../home';
import ProfileScreen from '../../profile/profile';
import ReportScreen from '../../report/report';
import MoreScreen from '../../more/more';
import { BottomTabParamList } from '../../../navigation/types';
// navigation/BottomTabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Update the icon import to use community version
import Ionicons from "@react-native-vector-icons/ionicons";
import { Colors } from '../../../theme/colors';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const route = useRoute();
  const params = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: Colors.bg,
        tabBarStyle: {
          borderTopWidth: 2, // Remove top border
          height: 60, // Set height of tab bar
          paddingBottom: 10, // Adjust padding
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={params}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        initialParams={params}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Report" 
        component={ReportScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ellipsis-horizontal" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;