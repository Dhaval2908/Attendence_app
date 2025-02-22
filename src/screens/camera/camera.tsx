// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import Ionicons from '@react-native-vector-icons/ionicons';

// const CameraScreen = ({ navigation }) => {
//   const devices = useCameraDevices();
//   const cameraRef = useRef(null);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [angleIndex, setAngleIndex] = useState(0);
//   const [isCapturing, setIsCapturing] = useState(false);
  
//   const angles = ['Front', 'Left', 'Right', 'Top', 'Bottom'];

//   useEffect(() => {
//     // Ask for camera permission
//     (async () => {
//       const status = await Camera.requestCameraPermission();
//       if (status !== 'authorized') {
//         alert('Camera permission denied');
//         navigation.goBack();
//       }
//     })();
//   }, []);

//   const capturePhoto = async () => {
//     if (cameraRef.current && !isCapturing) {
//       setIsCapturing(true);
//       const photo = await cameraRef.current.takePhoto();
//       setCapturedImages([...capturedImages, { uri: `file://${photo.path}`, angle: angles[angleIndex] }]);

//       if (angleIndex < angles.length - 1) {
//         setAngleIndex(angleIndex + 1); // Move to the next angle
//       } else {
//         uploadImages(); // Upload after last angle
//       }
//       setIsCapturing(false);
//     }
//   };

//   const uploadImages = async () => {
//     const formData = new FormData();
//     capturedImages.forEach((img, index) => {
//       formData.append(`image_${index}`, {
//         uri: img.uri,
//         name: `face_${angles[index]}.jpg`,
//         type: 'image/jpeg',
//       });
//     });

//     try {
//       const response = await fetch('http://your-backend-url.com/upload', {
//         method: 'POST',
//         body: formData,
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       const result = await response.json();
//       alert('Upload successful!');
//     } catch (error) {
//       console.error('Upload failed:', error);
//     }
//   };

//   if (!devices.front) return <Text>No Camera Found</Text>;

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={cameraRef}
//         device={devices.front}
//         isActive={true}
//         photo={true}
//         style={styles.camera}
//       />
//       <Text style={styles.angleText}>Capture: {angles[angleIndex]} Face</Text>

//       <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
//         <Ionicons name="camera-outline" size={40} color="white" />
//       </TouchableOpacity>

//       <View style={styles.previewContainer}>
//         {capturedImages.map((img, index) => (
//           <Image key={index} source={{ uri: img.uri }} style={styles.previewImage} />
//         ))}
//       </View>
//     </View>
//   );
// };

// export default CameraScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   camera: { flex: 1 },
//   angleText: { color: 'white', fontSize: 18, textAlign: 'center', marginVertical: 10 },
//   captureButton: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     backgroundColor: 'red',
//     borderRadius: 50,
//     padding: 15,
//   },
//   previewContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
//   previewImage: { width: 50, height: 50, marginHorizontal: 5, borderRadius: 10 },
// });
