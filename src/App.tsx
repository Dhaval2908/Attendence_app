import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/signup/signup";
import LoginScreen from "./screens/login/login";
import BottomTabNavigator from "./screens/home/componant/BottomNavBar";
import { RootStackParamList } from "./navigation/types";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "./theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
 const { user,token } = useContext(AuthContext)!;
console.log(user )
console.log(token)
  // if (user === null && token === null) {
  //   // Show loading spinner while checking authentication status
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color={Colors.primaryColor} />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={!token ? "Nav" : "Login"}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <Stack.Screen name="Nav" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
