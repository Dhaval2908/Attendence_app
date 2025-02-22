import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { fontNormalize, fontSizeLarge, smartScale } from '../../theme/constants/normalize';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../../theme/colors';
import Config from "react-native-config";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

interface Profile {
  fullName: string;
  studentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
}

const ProfileScreen = () => {
  const { user, logout, token } = useContext(AuthContext)!;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simply clear local authentication state
      await logout(navigation);
      
      // Reset navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${Config.BASE_URL}/api/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primaryColor} style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.topHeader}>Profile</Text>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={smartScale(100)} color={Colors.primaryColor} />
        <Text style={styles.profileName}>{profile?.fullName || 'Guest'}</Text>
      </View>
      <View style={styles.sectionContainer}>
        <ProfileInfo label="Student ID" value={profile?.studentId || 'N/A'} />
        <ProfileInfo label="Full Name" value={profile?.fullName || 'Not provided'} />
        <ProfileInfo label="Email" value={profile?.email || 'No email'} />
        <ProfileInfo label="Phone Number" value={profile?.phoneNumber || 'Not provided'} />
        <ProfileInfo label="Country" value={profile?.country || 'Not specified'} />
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Text style={styles.buttonText}>Logout</Text>
            <Ionicons 
              name="log-out-outline" 
              size={smartScale(20)} 
              style={styles.icon} 
            />
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const ProfileInfo: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// Keep your existing StyleSheet

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingBottom: smartScale(30),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: smartScale(30),
  },
  topHeader: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: smartScale(10),
  },
  profileName: {
    fontSize: fontSizeLarge,
    fontWeight: 'bold',
    marginTop: smartScale(10),
  },
  sectionContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: smartScale(20),
    padding: smartScale(15),
    backgroundColor: Colors.white,
    borderRadius: smartScale(10),
    shadowColor: Colors.bg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: smartScale(8),
  },
  infoLabel: {
    fontSize: fontNormalize(16),
  },
  infoValue: {
    fontSize: fontNormalize(16),
    fontWeight: '500',
  },
  button: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: 'center',
    backgroundColor: Colors.secondaryColor,
    borderRadius: smartScale(20),
    marginTop: smartScale(20),
    width: smartScale(110),
    height: smartScale(50),
  },
  buttonText: {
    color: Colors.bg,
    alignSelf:'center',
    fontSize: fontNormalize(16),
    marginRight: smartScale(8),
  },
  icon:{
    alignSelf:'center',
  },
});

export default ProfileScreen;