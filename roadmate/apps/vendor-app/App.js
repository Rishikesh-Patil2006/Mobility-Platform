import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import VendorAppNavigator from './src/navigation/VendorAppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <VendorAppNavigator />
    </NavigationContainer>
  );
}
