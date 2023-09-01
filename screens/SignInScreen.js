import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import { Octicons, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import VerificationAlert from './VerificationAlert';



export default function SignInScreen({ users, onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignIn = () => {
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      if (!showVerification) {
        const code = generateVerificationCode();
        setGeneratedCode(code);
        setShowVerification(true);
        setVerificationCode('');
        setAlertVisible(true);
      } else if (verificationCode.length === 6) {
        const isCodeCorrect = validateVerificationCode(verificationCode);
        if (isCodeCorrect) {
          onSignIn(user);
        } else {
          Alert.alert('Incorrect verification code');
        }
      } else {
        Alert.alert('Please enter a 6-digit verification code');
      }
    } else {
      Alert.alert('Incorrect username or password');
    }
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startResendCountdown = () => {
    setResendDisabled(true);
    setResendCountdown(60);

    const interval = setInterval(() => {
      setResendCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setResendDisabled(false);
    }, 60000);
  };

  const resendVerificationCode = () => {
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setVerificationCode('');
    setAlertVisible(true);
    startResendCountdown();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const verificationInputs = useRef(Array(6).fill(null));

  const focusPreviousInput = (index) => {
    if (index > 0) {
      verificationInputs.current[index - 1].focus();

      const updatedCode = verificationCode.split('');
      updatedCode[index - 1] = '';
      setVerificationCode(updatedCode.join(''));
    }
  };

  const focusNextInput = (index) => {
    if (index < 5) {
      verificationInputs.current[index + 1].focus();
    }
  };

  const validateVerificationCode = (code) => {
    const user = users.find((user) => user.username === username && user.password === password);
    return user && code === generatedCode;
  };

  useEffect(() => {
    validateAndSignIn();
  }, [verificationCode]);

  useEffect(() => {
    if (resendCountdown > 0 && resendDisabled) {
      const interval = setInterval(() => {
        setResendCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendCountdown, resendDisabled]);

  const validateAndSignIn = () => {
    if (verificationCode.length === 6) {
      const isCodeCorrect = validateVerificationCode(verificationCode);
      if (isCodeCorrect) {
        const user = users.find((user) => user.username === username && user.password === password);
        if (user) {
          onSignIn(user);
        } else {
          Alert.alert('Incorrect username or password');
        }
      } else {
        Alert.alert('Incorrect verification code');
      }
    }
  };

  const usernameInputRef = useRef(null);

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };


  return (
    <TouchableWithoutFeedback onPress={hideKeyboard}>
    <View style={styles.container}>
      <View style={styles.containerWrp}>
        <ImageBackground source={require('../assets/Register.png')} resizeMode="cover" style={styles.imageBackground}>

          {alertVisible && (
            <VerificationAlert code={generatedCode} visible={alertVisible} onClose={handleCloseAlert} />
          )}
          {!showVerification ? (

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#5730FB', fontSize: 28, fontWeight: 'bold', marginBottom: 50 }}>Tizimga kirish</Text>
              <View>
                <Text style={styles.inputText}>Telefon raqam:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    ref={usernameInputRef}
                  />
                </View>
                <Text style={styles.inputText}>Parol:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                  />
                </View>
              </View>
            </View>
          ) : (
            <>
              <Text style={{ color: '#5730FB', fontSize: 28, fontWeight: 'bold', marginBottom: 50 }}>Raqamni tekshirish</Text>
              <View style={styles.verificationContainer}>

                {Array.from({ length: 6 }).map((_, index) => (
                  <TextInput
                    key={index}
                    style={styles.verificationInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    onChangeText={(text) => {
                      const updatedCode = verificationCode.split('');
                      updatedCode[index] = text;
                      setVerificationCode(updatedCode.join(''));

                      if (text && index < 5) {
                        focusNextInput(index);
                      }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') {
                        focusPreviousInput(index);
                      }
                    }}
                    ref={(input) => (verificationInputs.current[index] = input)}
                  />
                ))}
              </View>
              </>
          )}

          {/* Resend Button */}
          {showVerification && !resendDisabled && (
            <TouchableOpacity style={styles.resendButton} onPress={resendVerificationCode}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="reload" size={22} color="#5730FB" />
                <Text style={styles.resendButtonText}>Qayta yuborish</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Countdown Timer */}
          {showVerification && resendDisabled && (
            <Text style={styles.countdownText}>Kodni qayta yuborish {resendCountdown} seconds</Text>
          )}

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>{showVerification ? 'Tekshirish' : 'Kirish'}</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.infoContainer}>
      <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>Biz haqimizda:</Text>
      <View style={{flexDirection: 'row', width: '35%', justifyContent: 'space-around'}}>
      <FontAwesome5 name="instagram" size={28} color="#fff" />
      <FontAwesome5 name="telegram" size={28} color="#fff" />
      <MaterialCommunityIcons name="web" size={28} color="#fff" />
      </View>
      <Text style={{color: '#fff', fontWeight: 'bold', textAlign: 'center', top: 5}}>Foydalanuvchi shartlari bilan <Text style={{color: '#FF9900'}}>tanishuv</Text></Text>
      </View>
    </View>
  </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#5730FB',
  },
  infoContainer:{
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 40
  },
  containerWrp: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    overflow: 'hidden',
  },
  imageBackground: {
    // flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#F0F2F4',
    borderRadius: 10,
    padding: 15,
    width: 280,
  },
  inputText: {
    fontWeight: 'bold',
    color: '#5730FB',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#5730FB',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,

  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: 20,
  },
  verificationInput: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
    width: 45,
    borderColor: '#5730FB',
  },
  resendButton: {
    // backgroundColor: '#5730FB',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  resendButtonText: {
    color: '#5730FB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  countdownText: {
    marginTop: 10,
    color: '#5730FB',
    fontSize: 14,
  },
});


SignInScreen.navigationOptions = {
  headerTitle: 'Sign In',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  headerRight: () => (
    <Octicons name="apps" size={24} color="#5730FB" style={{ marginRight: 15 }} />
  ),
};
