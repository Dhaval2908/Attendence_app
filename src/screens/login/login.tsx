import React, { useContext, useState } from "react";
import { Colors } from "../../theme/colors";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Config from "react-native-config";
import { fontSizeMedium, fontSizeSmall, headerHeight, headerPadding, headerWidth, smartScale } from "../../theme/constants/normalize";
import { RootStackParamList } from "../../navigation/types";
import { AuthContext } from "../../context/AuthContext";

// Define the navigation parameter types
// type RootStackParamList = {
//   Login: undefined;
//   SignUp: undefined;
//   // Home: undefined;
//   Nav: undefined;
// };

// Type for the props of this screen
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState("khunt2@uwindsor.ca");
  const [password, setPassword] = useState("Dhaval@123");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const response = await axios.post(`${Config.BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Response Data:", response.data);

      if (response.status === 200) {
        // Alert.alert("Success", "Logged in successfully!");
        await login(response.data)
        navigation.navigate("Nav"); // Navigate to Home screen
      } else {
        Alert.alert("Error", "Invalid credentials.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        Alert.alert("Error", error.response.data.error || "Invalid credentials.");
      } else if (error.request) {
        // Request was made but no response
        Alert.alert("Error", "No response from server. Check your network.");
      } else {
        // Something else happened
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Uni_logo.png")}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        // placeholder="Email"
        placeholder="khunt2@uwindsor.ca"
        placeholderTextColor="#555"
        // value={email}
        value="khunt2@uwindsor.ca"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          // placeholder="Password"
          placeholder="Dhaval@123"
          placeholderTextColor="#555"
          secureTextEntry={!isPasswordVisible}
          // value={password}
          value="Dhavl@123"
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={smartScale(22)}
            color={Colors.primaryColor}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>Forgot Password?</Text>

      <View style={styles.signupContainer}>
        <Text style={styles.text}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: smartScale(20),
  },
  logo: {
    width: smartScale(120),
    height: smartScale(120),
    marginBottom: smartScale(18),
    borderRadius: smartScale(20)
  },
  input: {
    width: headerWidth,
    height: headerHeight,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    borderRadius: smartScale(15),
    paddingHorizontal: headerPadding,
    marginBottom: headerPadding,
    fontSize: fontSizeMedium,
    color: Colors.bg,
  },
  passwordContainer: {
    flexDirection: "row",
    width: headerWidth,
    height: headerHeight,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    borderRadius: smartScale(15),
    alignItems: "center",
    paddingHorizontal: headerPadding,
    marginBottom: smartScale(18),
  },
  passwordInput: {
    flex: 1,
    fontSize: fontSizeMedium,
    color: Colors.bg,
  },
  button: {
    width: headerWidth,
    height: headerHeight,
    backgroundColor: Colors.secondaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: smartScale(30),
    marginBottom: smartScale(12),
  },
  buttonText: {
    color: Colors.bg,
    fontSize: fontSizeMedium,
  },
  forgotPassword: {
    color: Colors.primaryColor,
    fontSize: fontSizeSmall,
    marginBottom: smartScale(2),
    marginLeft: smartScale(20),
    alignSelf: "flex-start",
  },
  signupContainer: {
    flexDirection: "row",
    marginLeft: smartScale(20),
    alignSelf: "flex-start",
  },
  text: {
    fontSize: fontSizeSmall,
    color: Colors.bg,
  },
  signupText: {
    fontSize: fontSizeSmall,
    color: Colors.primaryColor,
  },
});
