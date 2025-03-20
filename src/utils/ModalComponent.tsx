import React from 'react';
import { 
  Modal, View, Text, TouchableOpacity, Animated, StyleSheet 
} from 'react-native';
import { Colors } from '../theme/colors'
import { smartScale, fontSizeMedium, fontSizeSmall } from '../theme/constants/normalize';

interface ModalComponentProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ visible, message, type, onClose }) => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.modalTitle, type === 'error' && styles.errorTitle]}>
            {type === 'success' ? '✅ Success!' : '❌ Error'}
          </Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Okay</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    width: smartScale(300),
    borderRadius: smartScale(15),
    padding: smartScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: fontSizeMedium,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: smartScale(10),
  },
  errorTitle: {
    color: 'red',
  },
  modalMessage: {
    fontSize: fontSizeSmall,
    color: Colors.bg,
    marginBottom: smartScale(20),
    textAlign: 'center',
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
