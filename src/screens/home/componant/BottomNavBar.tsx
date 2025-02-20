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
import { fontSizeSmall, smartScale } from '../../../theme/constants/normalize';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const route = useRoute();
  const params = route.params || {};

  return (
    <View style = {styles.screen}>
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: Colors.bg,
        tabBarStyle: {  
          borderTopWidth: 0, // Remove top border
          height: smartScale(60), // Set height of tab bar
          margin: smartScale(1),
          // borderRadius: smartScale(15),
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: fontSizeSmall, 
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={params}
        options={{
          tabBarIcon: ({ color,size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Report" 
        component={ReportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        initialParams={params}
        options={{
          tabBarIcon: ({ color,size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color, size}) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    </View>
  );
};

export default BottomTabNavigator;


const styles = StyleSheet.create({
  screen: {
    flex:1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.white_bg
  },})