import React from 'react';
import { useRoute } from '@react-navigation/native';
import HomeScreen from '../home';
import ProfileScreen from '../../profile/profile';
import ReportScreen from '../../report/report';
import MoreScreen from '../../more/more';
import { BottomTabParamList } from '../../../navigation/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@react-native-vector-icons/ionicons";
import { Colors } from '../../../theme/colors';
import { fontSizeExtraSmall, headerWidth, smartScale } from '../../../theme/constants/normalize';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const route = useRoute();
  const params = route.params || {};

  return (
    <View style={styles.screen}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: Colors.bg,
          tabBarStyle: styles.tabBar,  // Apply floating style
          tabBarLabelStyle: {
            fontSize: fontSizeExtraSmall, 
          },
          tabBarIconStyle: { marginTop:smartScale(5) }
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
    position: 'absolute',
    bottom: smartScale(20),  // Lift tab bar above the bottom
    width: '90%',
    marginHorizontal: "5%",
    height: smartScale(65),
    backgroundColor: Colors.white,
    borderRadius: smartScale(25),  // Rounded edges for floating effect
    shadowColor: Colors.bg,
    shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 22,
  },
});
