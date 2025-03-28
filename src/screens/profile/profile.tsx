import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { fontNormalize, fontSizeLarge, fontSizeMedium, fontSizeSmall, smartScale } from '../../theme/constants/normalize';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../../theme/colors';
import Config from "react-native-config";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useFeedbackModal } from '../../utils/useFeedbackModal';
import * as ImagePicker from 'react-native-image-picker';

interface Profile {
  fullName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  country: string;
  profileImage: string;
}

const ProfileScreen = () => {
  const { user, logout, token } = useContext(AuthContext)!;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | undefined>(''); 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { showModal, ModalComponent } = useFeedbackModal();

  const showModal_custom = (message: string, type: string) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(navigation);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      showModal("Failed to logout. Please try again.", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${Config.BASE_URL}/api/profile/`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const userData: Profile = response.data;
        setProfile(userData);
        setPhoneNumber(userData.phoneNumber ?? '');  
        setCountry(userData.country ?? '');  
        setProfileImage(userData.profileImage ?? '');  
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`${Config.BASE_URL}/api/profile/update`, {
        phoneNumber,
        country,
        profileImage,
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setProfile(response.data);
      setEditing(false);
      showModal("Profile updated successfully!", "success");
    } catch (error) {
      console.error('Error updating profile:', error);
      showModal("Failed to update profile.", "error");
    }
  };

  const handleImagePick = () => {
    if (!editing) return;
    showModal_custom("Choose an option", "success");
  };

  const openImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primaryColor} style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.topHeader}>Profile</Text>
        <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
          <Ionicons name={editing ? "close-outline" : "create-outline"} size={smartScale(24)} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={smartScale(100)} color={Colors.primaryColor} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <ProfileInfo label="Student ID" value={profile?.studentId || 'N/A'} />
        <ProfileInfo label="Full Name" value={profile?.fullName || 'Not provided'} />
        <ProfileInfo label="Email" value={profile?.email || 'No email'} />
        <EditableField label="Phone Number" value={phoneNumber} setValue={setPhoneNumber} editing={editing} />
        <EditableField label="Country" value={country} setValue={setCountry} editing={editing} />
      </View>
      {editing ? (
      <View style={styles.buttonContainer}>
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
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    ) : (
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
    )}


      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={hideModal}>
      <TouchableWithoutFeedback onPress={hideModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={openImagePicker} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Select Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setProfileImage('')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Remove Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

    </ScrollView>
  );
};

const ProfileInfo = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const EditableField = ({ label, value, setValue, editing }: { label: string; value: string; setValue: (val: string) => void; editing: boolean }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoLabel}>{label}</Text>
    {editing ? (
      <TextInput value={value} onChangeText={setValue} placeholder={label} style={styles.textInput} />
    ) : (
      <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: smartScale(15),
  },
  editButton: {
    padding: smartScale(10),
    backgroundColor: Colors.lightGray,
    borderRadius: smartScale(10),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: smartScale(20),
  },
  profileImage: {
    width: smartScale(120),
    height: smartScale(120),
    borderRadius: smartScale(60),
    borderWidth: 2,
    borderColor: Colors.primaryColor,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingBottom: smartScale(30),
  },
  icon: {
    alignSelf: 'center',
    marginLeft: smartScale(8),  // Optional: Adds spacing between text and icon
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',  // Adjust width to fit the buttons nicely
    alignSelf: 'center',
    marginTop: smartScale(20),
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
    alignSelf: 'center',
    fontSize: fontNormalize(16),
    marginRight: smartScale(8),
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
    margin: smartScale(10),
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
  textInput: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    fontSize: fontNormalize(16),
    paddingVertical: smartScale(5),
  },
  
  modalButtonContainer: {
    width: '70%',
    marginTop: smartScale(15),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    width: smartScale(300),
    borderRadius: smartScale(15),
    padding: smartScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fontSizeMedium,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: smartScale(10),
  },
  modalMessage: {
    fontSize: fontSizeLarge,
    color: Colors.black,
    marginBottom: smartScale(20),
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: smartScale(10),
    paddingHorizontal: smartScale(20),
    borderRadius: smartScale(25),
    marginBottom: smartScale(10),
    alignItems: 'center',

  },
  modalButtonText: {
    color: Colors.white,
    alignItems: 'center',
    fontSize: fontSizeMedium,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: smartScale(12),
    paddingHorizontal: smartScale(20),
    marginTop:smartScale(5),
    borderRadius: smartScale(25),
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.black,
    fontSize: fontSizeMedium,
    fontWeight: '600',
  }
  
});

export default ProfileScreen;
