// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/signup/signup";
import LoginScreen from "./screens/login/login";
import { RootStackParamList } from "./navigation/types";
import BottomTabNavigator from "./screens/home/componant/BottomNavBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Nav" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}