import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import the pages
import EnterPhonePage from '../pages/EnterPhonePage'; // Ensure the correct path
import VerifyOTPPage from '../pages/VerifyOTPPage';   // Ensure the correct path
import HomePage from '../pages/HomePage';           // Ensure the correct path

// Define the RootStackParamList for type safety
export type RootStackParamList = {
  EnterPhone: undefined; // No params required for EnterPhonePage
  VerifyOTP: { phoneNumber: string }; // Pass phoneNumber to VerifyOTPPage
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#1e1e2d', // Unique pattern: Dark purple-blue background
        borderTopWidth: 2,
        borderTopColor: '#6200ee', // Purple border line
        elevation: 5,
      },
      tabBarActiveTintColor: '#fff', // Bright white for active icons
      tabBarInactiveTintColor: '#aaa', // Light gray for inactive icons
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomePage}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="EmergencyCall"
      component={HomePage} // Replace with actual EmergencyCallPage when available
      options={{
        tabBarLabel: 'Emergency',
        tabBarIcon: ({ color, size }) => <Icon name="call" color={color} size={size} />,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{ headerShown: false }} // Disable header for all pages
    >
      {/* Enter Phone Page */}
      <Stack.Screen name="EnterPhone" component={EnterPhonePage} />

      {/* Verify OTP Page */}
      <Stack.Screen name="VerifyOTP" component={VerifyOTPPage} />

      {/* Home Page with Bottom Tabs */}
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
