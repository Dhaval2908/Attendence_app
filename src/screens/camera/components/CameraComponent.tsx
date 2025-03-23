import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import vision from "@react-native-ml-kit/face-detection";
import { useIsFocused } from "@react-navigation/native";
import { useFeedbackModal } from "../../../utils/useFeedbackModal";
import { smartScale } from "../../../theme/constants/normalize";
import { Colors } from "../../../theme/colors";

interface CameraComponentProps {
  onCapture: (imagePath: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "front");
  const camera = useRef<Camera>(null);

  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const isFocused = useIsFocused();
  const { showModal, ModalComponent } = useFeedbackModal()


  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission !== "granted") {
        showModal("Permission Denied, Camera access is required.","error");
      }
    })();
  }, []);

  const handleCameraReady = () => setTimeout(() => setIsCameraReady(true), 200);

  if (!device) return <View><ActivityIndicator size="large" color="white" /></View>;

  const takePhoto = async () => {
    if (!isFocused || !isCameraReady) return; 

    try {
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (camera.current) {
            setLoading(true);

            const photo = await camera.current.takePhoto();
            const imagePath = `file://${photo.path}`;

            const faces = await vision.detect(imagePath);
            if (faces.length > 0) {
              console.log(imagePath)
              onCapture(imagePath);
            } else {
                showModal("No Face Detected. Please try again.", "error");
            }
        }
    } catch (error) {
        console.error("❌ Camera Error:", error);
        showModal("Something went wrong with the camera!","error")
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
      {ModalComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: smartScale(80),
    height: smartScale(80),
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: smartScale(60),
    height: smartScale(60),
    borderRadius: smartScale(30),
    backgroundColor: "white",
  },
});

export default CameraComponent;
