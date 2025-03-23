import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { smartScale } from "../../theme/constants/normalize";
import { Colors } from "../../theme/colors";

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
    backgroundColor: Colors.white, 
  },
  animation: {
    width: smartScale(200),
    height: smartScale(200),
  },
});

export default SplashScreen;
