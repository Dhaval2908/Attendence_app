import React, { useContext } from "react";
import { Alert } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "././components/CameraComponent";

const FaceAttendance = () => {
  const { token } = useContext(AuthContext)!;

  const handleCapture = async (imagePath: string) => {
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/api/mark-attendance`,
        { image: imagePath },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert("Success", "Attendance Marked!");
      } else {
        Alert.alert("Error", "Attendance Failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not mark attendance.");
    }
  };

  return <CameraComponent onCapture={handleCapture} />;
};

export default FaceAttendance;
