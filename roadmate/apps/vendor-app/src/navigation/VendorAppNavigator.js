import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorAuthNavigator from './VendorAuthNavigator';
import VendorDashboardScreen from '../screens/VendorDashboardScreen';
import PendingApprovalScreen from '../screens/PendingApprovalScreen';

const Stack = createNativeStackNavigator();

export default function VendorAppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={VendorAuthNavigator} />
      <Stack.Screen name="Main" component={VendorDashboardScreen} />
      <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
    </Stack.Navigator>
  );
}
