import React, { useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import HomeScreen from '../home';
import ProfileScreen from '../../profile/profile';
import ReportScreen from '../../report/report';
import MoreScreen from '../../more/more';
import { BottomTabParamList } from '../../../navigation/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@react-native-vector-icons/ionicons";
import { Colors } from '../../../theme/colors';
import { fontSizeContent, fontSizeExtraSmall, fontSizeSmall, headerWidth, smartScale } from '../../../theme/constants/normalize';
import { Animated, StyleSheet, View } from 'react-native';
import CameraScreen from '../../camera/camera';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const route = useRoute();
  const params = route.params || {};
  const tabBarAnimation = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.animatedTab, { 
        transform: [{ translateY: tabBarAnimation }] 
      }]}>

      </Animated.View>
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: Colors.bg,
        tabBarStyle: {  
          borderTopWidth: 0.1, // Remove top border
          height: smartScale(60), // Set height of tab bar
          margin: smartScale(1),
          // borderRadius: smartScale(15),
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: fontSizeContent, 
          fontFamily: 'Poppins'
        },
      }}
    >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          initialParams={params}
          options={{
            tabBarIcon: ({ color, size }) => (
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="More" 
          component={MoreScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ellipsis-horizontal" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
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
    flex: 1,
  },
  tabBar: {

    height: smartScale(65),
    backgroundColor: Colors.white,
    shadowColor: Colors.bg,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,
    elevation: 22,
  },
  animatedTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});