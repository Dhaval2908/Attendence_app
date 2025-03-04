  import React, { useRef, useState, useEffect, useContext } from "react";
  import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
  import { Camera, useCameraDevices } from "react-native-vision-camera";
  import vision from "@react-native-ml-kit/face-detection";  // ✅ ML Kit Import
  import axios from "axios";
  import Config from "react-native-config";
  import { useNavigation } from "@react-navigation/native";  // ✅ Import Navigation
  import { AuthContext } from "../../context/AuthContext";

  const CameraScreen = () => {
    const navigation = useNavigation();
    const devices = useCameraDevices();
    const device = devices.find((d) => d.position === "front");
    const camera = useRef<Camera>(null);
    const [loading, setLoading] = useState(false);
    const { token, user } = useContext(AuthContext)!;
    const [isFaceRegistered, setIsFaceRegistered] = useState<boolean | null>(null); // ✅ Check registration state

    useEffect(() => {
      (async () => {
        const permission = await Camera.requestCameraPermission();
        if (permission !== "granted") {
          Alert.alert("Permission Denied", "Camera access is required.");
        }
      })();

      checkFaceRegistration(); // ✅ Check if face is already registered
    }, []);

    const checkFaceRegistration = async () => {
      try {
        console.log("Checking face registration...");
        const response = await axios.get(`${Config.BASE_URL}/api/check-face`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("Face Check API Response:", response.data);
    
        if (response.data.registered === true) {
          setIsFaceRegistered(true);
        } else {
          setIsFaceRegistered(false);
        }
      } catch (error) {
        console.error("Face Check Error:", error);
        setIsFaceRegistered(false);
      }
    };
    
    useEffect(() => {
      (async () => {
        const permission = await Camera.requestCameraPermission();
        if (permission !== "granted") {
          Alert.alert("Permission Denied", "Camera access is required.");
        }
      })();
    
      checkFaceRegistration(); // ✅ Moved inside useEffect to execute properly
    }, []);
    

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
        <View style={styles.registeredContainer}>
          <Text style={styles.registeredText}>Your face is already registered!</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Nav", { screen: "Home" } as never)}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!device) return <Text>Camera not available</Text>;

    const takePhoto = async () => {
      try {
        if (camera.current) {
          setLoading(true);
          const photo = await camera.current.takePhoto();
          const imagePath: string = `file://${photo.path}`;
    
          try {
            const faces = await vision.detect(imagePath);
            if (faces.length > 0) {
              const uploadSuccess = await uploadImage(imagePath);
              if (uploadSuccess) {
                Alert.alert("Success", "✅ Face detected & uploaded!", [
                  { text: "OK", onPress: () => navigation.navigate("Nav", { screen: "Home" } as never) },
                ]);
              } else {
                Alert.alert("Upload Failed", "Face detected, but image upload failed.");
              }
            } else {
              Alert.alert("No Face Detected", "Please try again.");
            }
          } catch (error) {
            console.error("Face Detection Error:", error);
            Alert.alert("Error", "Face detection failed!");
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Camera Error:", error);
        Alert.alert("Error", "Something went wrong with the camera!");
        setLoading(false);
      }
    };
    
    const uploadImage = async (imagePath: string) => {
      const formData = new FormData();
      formData.append("image", {
        uri: imagePath,
        type: "image/jpeg",
        name: "face.jpg",
      });
    
      try {
        const response = await axios.post(`${Config.BASE_URL}/api/upload/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        console.log("Upload Response:", response.data);
        return true;
      } catch (error) {
        console.error("Upload Error:", error);
        return false;
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    },
    loadingText: {
      color: "white",
      fontSize: 18,
      marginTop: 10,
    },
    registeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    },
    registeredText: {
      color: "green",
      fontSize: 20,
      fontWeight: "bold",
    },
    backButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: "#007bff",
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
  });

  export default CameraScreen;
