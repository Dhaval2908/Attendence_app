// FeedbackModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Animated,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
} from "react-native";
import { smartScale, fontSizeMedium, fontSizeSmall } from "../theme/constants/normalize";
import { Colors } from "../theme/colors";

export type FeedbackModalProps = {
  visible: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, message, type, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animation value when hidden
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>{type === "success" ? "Success!" : "Oops!"}</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: fontSizeMedium,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: smartScale(10),
  },
  modalMessage: {
    fontSize: fontSizeSmall,
    color: Colors.bg,
    marginBottom: smartScale(20),
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: smartScale(10),
    paddingHorizontal: smartScale(20),
    borderRadius: smartScale(25),
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: fontSizeMedium,
  },
});

export default FeedbackModal;
