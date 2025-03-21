import React, { useContext, useState } from "react";
import { Colors } from "../../theme/colors";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Config from "react-native-config";
import { fontSizeMedium, fontSizeSmall, headerHeight, headerPadding, headerWidth, smartScale } from "../../theme/constants/normalize";
import { RootStackParamList } from "../../navigation/types";
import { AuthContext } from "../../context/AuthContext";
import { useFeedbackModal } from "../../utils/useFeedbackModal";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Modal state
  const { showModal, ModalComponent } = useFeedbackModal()

  const handleLogin = async () => {
    if (!email || !password) {
      showModal("Please enter both email and password.","error");
      return;
    }

    setIsLoading(true);

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
        // Server errors (4xx, 5xx)
        switch (error.response.status) {
          case 400:
            showModal("Invalid request. Please check your input.","error");
            break;
          case 401:
          case 403:
            showModal("Invalid credentials. Please try again.","error");
            break;
          case 500:
          case 502:
          case 503:
            showModal("Server is currently unavailable. Please try again later.","error");
            break;
          default:
            showModal("Unexpected error occurred. Please try again.","error");
            break;
        }
      } else if (error.request) {
        // No response received (network issues)
        console.log(error.request)
        showModal("Network error. Please check your internet connection.","error");
      } else {
        // Other unexpected issues
        showModal("An unknown error occurred. Please try again.","error")
      }
      setEmail(""); // Clear fields
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/6343845.jpg")} style={styles.logo} />
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
          <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={smartScale(22)} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>Forgot Password?</Text>

      <View style={styles.signupContainer}>
        <Text style={styles.text}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} disabled={isLoading}>
          <Text style={styles.signupText}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* model showing */}
      {ModalComponent}

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
    width: smartScale(200),
    height: smartScale(200),
    marginBottom: smartScale(18),
    borderRadius: smartScale(20),
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
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: smartScale(30),
    marginBottom: smartScale(12),
  },
  disabledButton: {
    backgroundColor: Colors.bg,
  },
  buttonText: {
    color: Colors.white,
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
