import React, { useRef, useEffect } from 'react';
import { useRoute, useNavigationState } from '@react-navigation/native';
import HomeScreen from '../home';
import ProfileScreen from '../../profile/profile';
import ReportScreen from '../../report/report';
import { BottomTabParamList } from '../../../navigation/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@react-native-vector-icons/ionicons";
import { Colors } from '../../../theme/colors';
import { fontSizeContent, smartScale } from '../../../theme/constants/normalize';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import FaceRegistration from '../../camera/FaceRegistration';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const { width: screenWidth } = Dimensions.get('window');

const BottomTabNavigator = () => {
  const route = useRoute();
  const params = route.params || {};
  const translateX = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(smartScale(40))).current; // Initial width of the indicator
  const tabState = useNavigationState(state => state);
  const activeIndex = tabState?.routes[tabState.index]?.state?.index || tabState?.index || 0;

  useEffect(() => {
    const numberOfTabs = 4;
    const tabWidth = screenWidth / numberOfTabs;
    const indicatorWidth = smartScale(40);
    const offset = (tabWidth - indicatorWidth) / 2;
    const newPosition = activeIndex * tabWidth + offset;

    // Stretch the line during animation
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: newPosition,
        useNativeDriver: true,
        bounciness: 12,
        speed: 12,
      }),
      Animated.sequence([
        Animated.timing(widthAnim, {
          toValue: smartScale(60), // Stretch width
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: smartScale(40), // Return to original width
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [activeIndex]);

  return (
    <View style={styles.screen}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: Colors.bg,
          tabBarStyle: {
            borderTopWidth: 0.1,
            height: smartScale(60),
            margin: smartScale(1),
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
              <View style={styles.iconContainer}>
                <Ionicons name="home" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Report"
          component={ReportScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons name="clipboard" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={params}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Face"
          component={FaceRegistration}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons name="camera" size={size} color={color} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>

      <Animated.View
        style={[
          styles.activeIndicator,
          { transform: [{ translateX }] }
        ]}
      />
    </View>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: smartScale(60),
    height: smartScale(3),
    width: smartScale(40),
    backgroundColor: Colors.primaryColor,
    borderRadius: smartScale(2),
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});