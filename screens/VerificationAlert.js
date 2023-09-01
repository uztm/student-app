import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const VerificationAlert = ({ code, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(onClose);
      }, 6000); // Hide after 4 seconds
    }
  }, [fadeAnim, visible, onClose]);

  return (
    visible && (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.textView}>
        <Text style={styles.text}>Verification Code: {code}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    
    backgroundColor: '#5730FB',
    width: 220,
    textAlign: 'center',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default VerificationAlert;
