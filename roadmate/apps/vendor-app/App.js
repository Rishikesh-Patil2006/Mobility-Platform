import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { VendorProfileProvider } from './src/context/VendorProfileContext';
import VendorAppNavigator from './src/navigation/VendorAppNavigator';

export default function App() {
  return (
    <VendorProfileProvider>
      <NavigationContainer>
        <VendorAppNavigator />
      </NavigationContainer>
    </VendorProfileProvider>
  );
}
