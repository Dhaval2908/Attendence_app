import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/splash2.json')} // Lottie JSON file
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Or any background color you want
  },
  animation: {
    width: 200,  // Adjust width and height to fit your design
    height: 200,
  },
});

export default SplashScreen;
