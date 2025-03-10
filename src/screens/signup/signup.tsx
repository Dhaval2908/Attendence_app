import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  Easing,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { StackScreenProps } from "@react-navigation/stack";
import Config from "react-native-config";
import { Colors } from "../../theme/colors";
import { fontSizeMedium, fontSizeSmall, headerHeight, headerPadding, headerWidth, smartScale } from "../../theme/constants/normalize";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: { studentId: string; email: string };
};

type Props = StackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [role, setRole] = useState("student"); // Default to student
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showModal = (message: string, type: string) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
    fadeIn();
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };


  // Email domain validation function
  const isValidEmailDomain = (email: string) => {
    const allowedDomains = ["uwindsor.ca"]; // List of allowed domains
    const emailDomain = email.split('@')[1];
    return allowedDomains.includes(emailDomain);
  };

  
  const handleSignUp = async () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      showModal("Passwords do not match.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showModal("Passwords do not match.", "error");
      return;
    }

    if (!isValidEmailDomain(email)) {
      showModal("Please use a valid domain.", "error");
      return;
    }

    setLoading(true);

    try {
      // Call API
      console.log(`${Config.BASE_URL}/api/auth/signup`)
      const response = await fetch(`${Config.BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          studentId: role === "student" ? studentId : undefined,
          fullName,
          password,
          role: "student",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showModal("Account created successfully. Please log in.", "success");
        navigation.navigate("Login");
      } else {
        showModal(data.error || "Something went wrong.", "error");
      }
    } catch (error) {
      showModal("Failed to connect to the server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/images/6343845.jpg")} style={styles.logo} />

      {/* Role Selection */}
      {/* <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === "student" && styles.roleButtonSelected]}
          onPress={() => setRole("student")}
        >
          <Text style={role === "student" ? styles.roleTextSelected : styles.roleText}>
            Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === "admin" && styles.roleButtonSelected]}
          onPress={() => setRole("admin")}
        >
          <Text style={role === "admin" ? styles.roleTextSelected : styles.roleText}>
            Admin
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* Conditionally Show Student ID */}
      {role === "student" && (
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          placeholderTextColor="#555"
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="numeric"
        />
      )}

      {/* Full Name */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#555"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry={!isPasswordVisible1}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible1(!isPasswordVisible1)}>
          <Ionicons name={isPasswordVisible1 ? "eye" : "eye-off"} size={smartScale(22)} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#555"
          secureTextEntry={!isPasswordVisible2}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible2(!isPasswordVisible2)}>
          <Ionicons name={isPasswordVisible2 ? "eye" : "eye-off"} size={smartScale(22)} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Already have an account */}
      <View style={styles.loginContainer}>
        <Text style={styles.text}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}> Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Error Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={hideModal}>
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
              <Text style={styles.modalTitle}>Oops!</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
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

export default SignUpScreen;


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
    borderRadius: smartScale(20)
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: headerPadding,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: smartScale(20),
    paddingVertical: headerPadding,
    alignItems: "center",
    marginHorizontal: smartScale(5),
  },
  roleButtonSelected: {
    backgroundColor: Colors.primaryColor,
  },
  roleText: {
    color: Colors.primaryColor,
    fontSize: fontSizeMedium,
  },
  roleTextSelected: {
    color: Colors.white,
    fontSize: fontSizeMedium,
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
    marginBottom: smartScale(12),
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
    marginTop: smartScale(6),
  },
  buttonText: {
    color: Colors.white,
    fontSize: fontSizeMedium,
  },
  loginContainer: {
    flexDirection: "row",
  },
  text: {
    fontSize: fontSizeSmall,
    color: Colors.bg,
    
  },
  loginText: {
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
    borderRadius: smartScale(25),
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: fontSizeMedium,
  },
});
