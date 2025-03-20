import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/signup/signup";
import LoginScreen from "./screens/login/login";
import BottomTabNavigator from "./screens/home/components/BottomNavBar";
import { RootStackParamList } from "./navigation/types";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import FaceAttendance from "./screens/camera/FaceAttendance";
import SplashScreen from "./screens/splash/splash";
import { EventsProvider } from "./context/EventsContext";
import { LocationProvider } from "./context/LocationContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, token } = useContext(AuthContext)!;
  console.log(user)
  console.log(token)
  // if (user === null && token === null) {
  //   // Show loading spinner while checking authentication status
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color={Colors.primaryColor} />
  //     </View>
  //   );
  // }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 4 seconds
  }, []);

  // Show SplashScreen
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator

        initialRouteName={token ? "Nav" : "Login"}


        // initialRouteName="Nav"


        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>

            <Stack.Screen name="Nav" component={BottomTabNavigator} />
            <Stack.Screen name="FaceAttendance" component={FaceAttendance} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (

    <AuthProvider>
      <LocationProvider>
        <EventsProvider>
          <AppNavigator />
        </EventsProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
