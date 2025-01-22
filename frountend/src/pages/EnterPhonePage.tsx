import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust the path if needed

// Define navigation prop type
type EnterPhonePageNavigationProp = StackNavigationProp<RootStackParamList, 'EnterPhone'>;

type Props = {
  navigation: EnterPhonePageNavigationProp;
};

const EnterPhonePage: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false); // For loading state

  const handlePhoneNumberChange = (text: string) => {
    // Automatically add +91 to the phone number if not already present
    let formattedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (!formattedText.startsWith('91')) {
      setPhoneNumber('+91' + formattedText); // Add +91 if not present
    } else {
      setPhoneNumber('+' + formattedText); // Ensure it starts with +91
    }
  };

  const handleSubmit = async () => {
    if (phoneNumber.trim().length !== 13) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number with country code (+91).');
      return;
    }

    try {
      setLoading(true);
      
      // Ensure phone number is passed correctly in the body
      const response = await axios.post('https://learn-flip-groups-lloyd.trycloudflare.com/api/auth/send-otp', {
        phoneNumber: phoneNumber.trim(), // Correctly passing the phone number field
      });

      // Check API response
      if (response.data.success) {
        Alert.alert('Success', 'OTP sent successfully!');
        navigation.navigate('VerifyOTP', { phoneNumber });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);

      if (axios.isAxiosError(error)) {
        // Axios specific error handling
        if (error.response) {
          // Request made and server responded
          Alert.alert('Error', `Server responded with status code: ${error.response.status}`);
          console.log('Response:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          Alert.alert('Error', 'No response received from the server. Please check your internet connection.');
          console.log('Request:', error.request);
        } else {
          // Something happened in setting up the request
          Alert.alert('Error', `Error in setting up the request: ${error.message}`);
        }
      } else {
        // Non-Axios error
        Alert.alert('Error', `Unexpected error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')} // Replace with your app logo path
        style={styles.logo}
      />
      <Text style={styles.title}>Enter Your Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        maxLength={13} // Account for +91 and the 10-digit phone number
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Submit'}</Text>
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
    backgroundColor: '#121212', // Dark background
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Light text color for dark theme
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#333', // Dark background for input
    color: '#fff', // Light text color
    marginBottom: 20,
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

export default EnterPhonePage;
