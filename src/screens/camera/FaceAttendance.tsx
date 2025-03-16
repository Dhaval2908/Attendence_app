import React, { useContext, useEffect, useState } from "react";
import { Alert, Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "./components/CameraComponent";
import { useNavigation, useRoute } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { smartScale, fontSizeMedium, fontSizeSmall, fontSizeLarge } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";
import LottieView from "lottie-react-native";


type RouteParams = {
  eventId: string;
};

const FaceAttendance = () => {
  const { token } = useContext(AuthContext)!;
  const route = useRoute();
  const { eventId } = route.params as RouteParams;
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
      if (isSuccess) {
        setTimeout(() => {
          setIsSuccess(false);
          navigation.goBack(); // Navigate back after success
        }, 2000); // 2-second delay
      }
    }, [isSuccess]);

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
  

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: parseFloat(position.coords.latitude.toFixed(5)),
            lng: parseFloat(position.coords.longitude.toFixed(5)),
          });
        },
        (error) => {
          reject(error);
        },
      );
    });
  };
  
  const handleCapture = async (imagePath: string) => {
    try {
      setIsUploading(true);
        // const { lat, lng }: any = await getLocation();
        const lat: any = 42.317314
        const lng: any = -83.038551
        console.log("🚀 Capturing Attendance with Location");

        console.log("lati:", lat);
        console.log("long:", lng);

        const formData = new FormData();
        formData.append("eventId", eventId);
        formData.append("latitude", lat);
        formData.append("longitude", lng);
        formData.append("image", {
            uri: imagePath,
            type: "image/jpeg",
            name: "attendance.jpg",
        });

        console.log("📤 Attendance FormData:", formData);

        const response = await axios.post(`${Config.FLASK_API_URL}/mark_attendance`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          // timeout: 10000,
        });

        console.log("✅ Attendance Response:", response.data);

        if (response.status === 200 || response.status === 201) {
          setIsSuccess(true); // Show success animation
          setIsUploading(false);
          showModal("Attendance marked successfully!", "success");
            // Alert.alert("Success", "Attendance Marked!");
        } 
    } catch (error: any) {
        setIsUploading(false);
        if (error.response) {
          // Handle errors from the backend
          const { status, data } = error.response;
    
          switch (status) {
            case 400:
              showModal(data.error || "Bad Request", "error");
              break;
            case 401:
              showModal(data.error || "Unauthorized - Token expired or invalid", "error");
              break;
            case 403:
              showModal(data.error || "Forbidden - Location or Face verification failed", "error");
              break;
            case 404:
              showModal(data.error || "Not Found - User or Event not found", "error");
              break;
            case 500:
              showModal(data.error || "Internal Server Error. Please try again later.", "error");
              break;
            default:
              showModal("Something went wrong. Please try again.", "error");
          }
        } else if (error.request) {
          // No response received from the server
          showModal("Server not responding. Please try again later.", "error");
        } else {
          // Something else happened
          showModal("An unexpected error occurred.", "error");
        }
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
          <Text style={styles.processingText}>Verifying...</Text>
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
          <Text style={styles.processingText}>Done...</Text>
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
})
export default FaceAttendance;
