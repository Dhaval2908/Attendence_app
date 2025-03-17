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
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorModal("Please enter both email and password.");
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
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        // Server errors (4xx, 5xx)
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid request. Please check your input.";
            break;
          case 401:
          case 403:
            errorMessage = "Invalid credentials. Please try again.";
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = "Server is currently unavailable. Please try again later.";
            break;
          default:
            errorMessage = "Unexpected error occurred. Please try again.";
            break;
        }
      } else if (error.request) {
        // No response received (network issues)
        console.log(error.request)
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        // Other unexpected issues
        errorMessage = "An unknown error occurred. Please try again.";
      }

      showErrorModal(errorMessage);
      setEmail(""); // Clear fields
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorModal = (message: string) => {
    setModalErrorMessage(message);
    setModalVisible(true);
    fadeIn();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    setModalVisible(false);
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

      {/* Custom Error Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={hideModal}>
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
              <Text style={styles.modalTitle}>Oops!</Text>
              <Text style={styles.modalMessage}>{modalErrorMessage}</Text>
              <TouchableOpacity onPress={hideModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Okay</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    width: smartScale(300),
    borderRadius: smartScale(15),
    padding: smartScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: fontSizeMedium,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: smartScale(10),
  },
  modalMessage: {
    fontSize: fontSizeSmall,
    color: Colors.bg,
    marginBottom: smartScale(20),
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: smartScale(10),
    paddingHorizontal: smartScale(20),
    borderRadius: smartScale(10),
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: fontSizeMedium,
  },
});

export default LoginScreen;
