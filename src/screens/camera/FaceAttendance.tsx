import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "./components/CameraComponent";
import { useNavigation, useRoute } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { smartScale, fontSizeLarge } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";
import LottieView from "lottie-react-native";
import { useEvents } from "../../context/EventsContext"; 
import { pingServer, retryRequest } from "../../utils/apiutils";
import { useFeedbackModal } from "../../utils/useFeedbackModal";



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
  const { refreshEvents } = useEvents(); 

  // Modal state
  const { showModal, ModalComponent } = useFeedbackModal()

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
  useEffect(() => {
      if (isSuccess) {
        setTimeout(() => {
          setIsSuccess(false);
          navigation.goBack(); // Navigate back after success
        }, 2000); // 2-second delay
      }
    }, [isSuccess]);
  const handleCapture = async (imagePath: string) => {
    try {
      setIsUploading(true);
      const serverActive = await pingServer();
        const { lat, lng }: any = await getLocation();
        // const lat: any = 42.317314
        // const lng: any = -83.038551
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

        console.log(" Attendance FormData:", formData);

        const response = await retryRequest(() => 
          axios.post(`${Config.FLASK_API_URL}/mark_attendance`, formData, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          })
      );

        console.log("  Attendance Response:", response.data);

        if (response.status === 200 || response.status === 201) {
          setIsSuccess(true); // Show success animation
          setIsUploading(false);
          showModal("Attendance marked successfully!", "success");
          await refreshEvents();
          
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
          <Text style={styles.processingText}>Please wait...</Text>
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
        {/* {  navigation.goBack()} */}
        </View>
      );
    }

  return (
    <View style={{ flex: 1 }}>
    <CameraComponent onCapture={handleCapture} />
    {/* model showing */}
    {ModalComponent}
    </View>
);
};

const styles = StyleSheet.create({
  animationContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white },
  animation: { width: smartScale(200), height: smartScale(200) },
  processingText: { color: Colors.bg, fontSize: fontSizeLarge, marginTop: smartScale(10) },
})
export default FaceAttendance;
