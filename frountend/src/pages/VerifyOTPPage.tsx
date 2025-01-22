import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Define navigation props
type VerifyOTPPageNavigationProp = StackNavigationProp<RootStackParamList, 'VerifyOTP'>;

type Props = {
  navigation: VerifyOTPPageNavigationProp;
  route: { params: { phoneNumber: string } };
};

const VerifyOTPPage: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Handle OTP change in individual input fields
  const handleOtpChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < otp.length - 1 && text) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP submission
  const handleSubmit = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const payload = { phoneNumber, otp: otpString };

      const response = await axios.post(
        'https://learn-flip-groups-lloyd.trycloudflare.com/api/auth/verify-otp',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        console.log('OTP verified successfully!');
        Alert.alert('Success', 'OTP verified successfully!');
        navigation.navigate('Home'); // Ensure 'Home' is the correct screen name
      } else {
        console.log('OTP verification failed:', response.data.message);
        Alert.alert('Error', response.data.message || 'Failed to verify OTP.');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Request failed.'
        : 'An unknown error occurred.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.input, digit && styles.inputFilled]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: 40,
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#333',
  },
  inputFilled: {
    backgroundColor: '#555',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyOTPPage;
