import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Colors } from "../../theme/colors";
import { RootStackParamList } from "../../navigation/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Geolocation from '@react-native-community/geolocation';
const ProfileScreen: React.FC = () => {
  // const { user, logout } = AuthProvider();
  const { user,logout } = useContext(AuthContext)!;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [address,setAddress] = useState("")

  const handleLogout = async () => {
    await logout(navigation) // Clear context and storage
  };
  Geolocation.getCurrentPosition(async(info) =>
     {console.log(info)
      console.log(info.coords.latitude)
      console.log(info.coords.longitude)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${info.coords.latitude}&lon=${info.coords.longitude}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
          
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Failed to fetch address");
      }
      
     });
     console.log(address)
  // if (!user) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.noUserText}>No user data found.</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Dummy Circle for Profile Picture */}
      <View style={styles.dummyCircle}>
        <Text style={styles.initials}>
          {user?.email[0].toUpperCase()}
        </Text>
      </View>
      
      <Text style={styles.name}>{user?.email}</Text>
      <Text style={styles.role}>{user?.role}</Text>
      <Text style={styles.role}>{address}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
        <Ionicons name="log-out-outline" size={20} color={Colors.bg} />
      </TouchableOpacity>
      
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    padding: 20,
  },
  dummyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  initials: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  role: {
    fontSize: 18,
    color: Colors.bg,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.bg,
    fontSize: 16,
    marginRight: 10,
  },
  noUserText: {
    fontSize: 20,
    color: Colors.bg,
  },
});
