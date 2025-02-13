import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App"; // Import navigation type

type Props = StackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { studentId, email } = route.params || {}; // Ensure params exist

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Home Screen</Text>

      <Text style={styles.text}>Student ID: {studentId || "N/A"}</Text>
      <Text style={styles.text}>Email: {email || "N/A"}</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Login")} // Navigate to Login
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
