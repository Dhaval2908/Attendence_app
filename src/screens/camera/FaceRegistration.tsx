import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Animated, Easing, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "./components/CameraComponent";
import { fontSizeLarge, fontSizeMedium, fontSizeSmall, smartScale } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";
import LottieView from "lottie-react-native";

const FaceRegistration = () => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext)!;
  const [isFaceRegistered, setIsFaceRegistered] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for animation
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    checkFaceRegistration();
  }, []);
  
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
        navigation.goBack(); // Navigate back after success
      }, 2000); // 2-second delay
    }
  }, [isSuccess]);

  const checkFaceRegistration = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/check-face`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFaceRegistered(response.data.registered);
    } catch (error) {
      console.error("Face Check Error:", error);
      setIsFaceRegistered(false);
    }
  };


  const showModal = (message: string, type: string) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
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


  const handleCapture = async (imagePath: string) => {
    setIsUploading(true); 

    const formData = new FormData();
    formData.append("image", { uri: imagePath, type: "image/jpeg", name: "face.jpg" });

    try {
      const response = await axios.post(`${Config.FLASK_API_URL}/register`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        timeout: 10000
      });

      console.log("Upload success:", response.data);

      if (response.status === 201) {
        setIsSuccess(true); // Show success animation
        setIsUploading(false);
        showModal("Face registered successfully!", "success");
      }

      checkFaceRegistration(); // Recheck registration status
    } catch (error) {
      setIsUploading(false);
      console.error("Upload Error:", error);
      showModal("Face registration failed. Please try again.", "error");
    }
  };

  //Show processing animation when image is uploading
  if (isUploading) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../../assets/process.json")} // Processing animation
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.processingText}>Processing...</Text>
      </View>
    );
  }
  if (isSuccess) {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../../assets/success.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Text style={styles.processingText}>Done</Text>
      </View>
    );
  }

  if (isFaceRegistered === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Checking face registration...</Text>
      </View>
    );
  }

  if (isFaceRegistered) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Your face is registered!</Text>
      </View>
    );
  }

  return (
  <View style={{ flex: 1 }}>
  <CameraComponent onCapture={handleCapture} />
  <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={hideModal}>
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
              <Text style={styles.modalTitle}>{modalType === "success" ? "Success!" : "Oops!"}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white },
  text: { color: Colors.bg, fontSize: fontSizeLarge },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { color: "white", fontSize: fontSizeLarge, marginTop: smartScale(10) },
  animationContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  animation: { width: 200, height: 200 },
  processingText: { color: Colors.bg, fontSize: fontSizeLarge, marginTop: smartScale(10) },
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

export default FaceRegistration;
