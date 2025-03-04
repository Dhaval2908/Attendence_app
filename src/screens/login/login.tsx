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
  ActivityIndicator,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Config from "react-native-config";
import { fontSizeMedium, fontSizeSmall, headerHeight, headerPadding, headerWidth, smartScale } from "../../theme/constants/normalize";
import { RootStackParamList } from "../../navigation/types";
import { AuthContext } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${Config.BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        await login(response.data);
        navigation.navigate("Nav");
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded but with an error status (4xx, 5xx, etc.)
        if (error.response.status === 401 || error.response.status === 403) {
          // Unauthorized or Forbidden - likely invalid credentials
          setError("Invalid credentials. Please try again.");
        } else if (error.response.status >= 500) {
          // Internal Server Error, Bad Gateway, etc.
          setError("Server error. Please try again later.");
        } else {
          // Other client error (like 404 - unlikely for login, but let's handle it)
          setError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        // No response received at all (network error, timeout, etc.)
        setError("Network error. Please check your internet connection.");
      } else {
        // Other unexpected errors (could be parsing issues, unknown Axios errors, etc.)
        setError("Unexpected error occurred. Please try again.");
      }
      setEmail(""); // Clear fields
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Uni_logo.png")}
        style={styles.logo}
      />
      {error && (
      <Text style={styles.errorText}>{error}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          disabled={isLoading}
        >
          <Ionicons
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={smartScale(22)}
            color={Colors.primaryColor}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>Forgot Password?</Text>

      <View style={styles.signupContainer}>
        <Text style={styles.text}>Don’t have an account?</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate("SignUp")}
          disabled={isLoading}
        >
          <Text style={styles.signupText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  errorText: {
    color: Colors.error || "red", // Replace with your theme's error color if available
    marginBottom: smartScale(8),
    fontSize: fontSizeSmall,
    textAlign: "center",
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
  disabledButton: {
    backgroundColor: Colors.bg,
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

export default LoginScreen;