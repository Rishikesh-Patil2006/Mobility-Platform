import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorLandingScreen from '../screens/VendorLandingScreen';
import VendorLoginScreen from '../screens/VendorLoginScreen';
import VendorRegisterScreen from '../screens/VendorRegisterScreen';
import VendorOtpScreen from '../screens/VendorOtpScreen';

const Stack = createNativeStackNavigator();

export default function VendorAuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="VendorLanding">
      <Stack.Screen name="VendorLanding" component={VendorLandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VendorLogin" component={VendorLoginScreen} />
      <Stack.Screen name="VendorRegister" component={VendorRegisterScreen} />
      <Stack.Screen name="VendorOtp" component={VendorOtpScreen} />
    </Stack.Navigator>
  );
}
