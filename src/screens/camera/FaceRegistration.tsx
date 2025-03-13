import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import Config from "react-native-config";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import CameraComponent from "./components/CameraComponent";
import { fontSizeLarge, smartScale } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";

const FaceRegistration = () => {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext)!;
  const [isFaceRegistered, setIsFaceRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    checkFaceRegistration();
  }, []);

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
    const formData = new FormData();
    formData.append("image", { uri: imagePath, type: "image/jpeg", name: "face.jpg" });
  
    try {
      const response = await axios.post(`${Config.FLASK_API_URL}/register`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
  
      console.log("Upload success:", response.data);  
  
      // Trigger face registration check after a successful registration
      checkFaceRegistration();  // Recheck if the face is registered
  
      setTimeout(() => {
        Alert.alert("Success", "Face Registered!", [
          { text: "OK", onPress: () => navigation.navigate("Nav", { screen: "Home" } as never) },
        ]);
      }, 100);
    } catch (error) {
      console.error("Upload Error:", error); 
  
      setTimeout(() => {
        Alert.alert("Error", "Face registration failed. Please try again.");
      }, 100);
    }
  };
  
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
        <Text style={styles.text}>Your face is already registered!</Text>
      </View>
    );
  }

  return <CameraComponent onCapture={handleCapture} />;
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white },
  text: { color: Colors.bg, fontSize: fontSizeLarge },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { color: "white", fontSize: fontSizeLarge, marginTop: smartScale(10) },
});

export default FaceRegistration;