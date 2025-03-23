import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "./components/CameraComponent";
import { fontSizeLarge, smartScale } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";
import LottieView from "lottie-react-native";
import { pingServer, retryRequest } from "../../utils/apiutils";
import { useFocusEffect } from "@react-navigation/native";
import { useFeedbackModal } from "../../utils/useFeedbackModal";

const FaceRegistration = () => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext)!;
  const [isFaceRegistered, setIsFaceRegistered] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for animation
  // Modal state
  const { showModal, ModalComponent } = useFeedbackModal()

  useFocusEffect(
    React.useCallback(() => {
      checkFaceRegistration();  //   Runs every time the screen is focused
    }, [])
  );
  
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

  const handleCapture = async (imagePath: string) => {
    setIsUploading(true); 
    const serverActive = await pingServer();
    const formData = new FormData();
    formData.append("image", { uri: imagePath, type: "image/jpeg", name: "face.jpg" });

    try {
      const response = await retryRequest(() => 
        axios.post(`${Config.FLASK_API_URL}/register`, formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        })
    );

      console.log("Upload success:", response.data);

      if (response.status === 201) {
        setIsSuccess(true); // Show success animation
        setIsUploading(false);
        showModal("Face registered successfully!", "success");
        checkFaceRegistration(); // Recheck registration status
      }

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
  {ModalComponent}
  </View>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white },
  text: { color: Colors.bg, fontSize: fontSizeLarge },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.black },
  loadingText: { color: Colors.white, fontSize: fontSizeLarge, marginTop: smartScale(10) },
  animationContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white },
  animation: { width: smartScale(200), height: smartScale(200) },
  processingText: { color: Colors.bg, fontSize: fontSizeLarge, marginTop: smartScale(10) },
});

export default FaceRegistration;
