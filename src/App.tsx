import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "./screens/signup/signup";
import LoginScreen from "././screens/login/login";
import HomeScreen from "././screens/home/home";


// Define the navigation parameter types
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: { studentId: string; email: string } | undefined; // Make params optional
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}