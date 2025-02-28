import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import vision from "@react-native-ml-kit/face-detection";
import { useIsFocused } from "@react-navigation/native";

interface CameraComponentProps {
  onCapture: (imagePath: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "front");
  const camera = useRef<Camera>(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused(); // ✅ Ensure the screen is active before alerts

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission !== "granted") {
        setTimeout(() => Alert.alert("Permission Denied", "Camera access is required."), 100);
      }
    })();
  }, []);

  if (!device) return <View><ActivityIndicator size="large" color="white" /></View>;

  const takePhoto = async () => {
    if (!isFocused) return; // ✅ Prevent alerts when screen is inactive

    try {
      if (camera.current) {
        setLoading(true);
        const photo = await camera.current.takePhoto();
        const imagePath: string = `file://${photo.path}`;

        console.log("📸 Photo taken at:", imagePath);

        const faces = await vision.detect(imagePath);
        console.log("👀 Faces detected:", faces.length);

        if (faces.length > 0) {
          console.log("✅ Face detected, calling onCapture...");
          onCapture(imagePath);
        } else {
          console.log("❌ No face detected, attempting to show alert...");
          setTimeout(() => {
            if (isFocused) {
              Alert.alert("No Face Detected", "Please try again.");
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("❌ Camera Error:", error);
      setTimeout(() => {
        if (isFocused) {
          Alert.alert("Error", "Something went wrong with the camera!");
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={styles.camera} device={device} isActive={true} photo={true} />
      <View style={styles.overlay}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.innerCircle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});

export default CameraComponent;
