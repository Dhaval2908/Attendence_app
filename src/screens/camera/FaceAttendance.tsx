import React, { useContext } from "react";
import { Alert } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "./components/CameraComponent";
import { useRoute } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";


type RouteParams = {
  eventId: string;
};

const FaceAttendance = () => {
  const { token } = useContext(AuthContext)!;
  const route = useRoute();
  const { eventId } = route.params as RouteParams;  // Get eventId from navigation

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
        const { lat, lng }: any = await getLocation();
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
        });

        console.log("✅ Attendance Response:", response.data);

        if (response.data.success) {
            Alert.alert("Success", "Attendance Marked!");
        } else {
            Alert.alert("Error", response.data.message || "Attendance Failed.");
        }
    } catch (error: any) {
        console.error("❌ Error marking attendance:", error);
        Alert.alert("Error", `Could not mark attendance.\n${error.message || JSON.stringify(error)}`);
    }
};
  

  return <CameraComponent onCapture={handleCapture} />;
};

export default FaceAttendance;
