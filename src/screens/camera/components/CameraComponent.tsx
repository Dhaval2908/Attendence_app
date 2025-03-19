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
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cooldown, setCooldown] = useState(false); // ✅ Added cooldown to prevent fast re-click
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
      }
    })();
  }, []);

  const handleCameraReady = () => setTimeout(() => setIsCameraReady(true), 500); // ✅ Added slight delay

  if (!device) return <View><ActivityIndicator size="large" color="white" /></View>;

  const takePhoto = async () => {
    if (!isFocused || !isCameraReady) return; 

    try {
        await new Promise((resolve) => setTimeout(resolve, 200)); // ✅ Added delay for camera readiness

        if (camera.current) {
            setLoading(true);

            const photo = await camera.current.takePhoto();
            const imagePath = `file://${photo.path}`;

            const faces = await vision.detect(imagePath);
            if (faces.length > 0) {
              console.log(imagePath)
              onCapture(imagePath);
            } else {
                Alert.alert("No Face Detected", "Please try again.");
            }
        }
    } catch (error) {
        console.error("❌ Camera Error:", error);
        Alert.alert("Error", "Something went wrong with the camera!");
    } finally {
        setLoading(false);
    }
};


  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isFocused}
        photo={true}
        onInitialized={handleCameraReady} 
      />
      <View style={styles.overlay}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} disabled={loading}>
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
