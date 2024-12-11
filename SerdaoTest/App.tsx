import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionProvider } from './src/context/TransactionContext';

import TransactionScreen from './src/features/transaction/TransactionScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/features/home/HomeScreen';
import AddBeneficiaryScreen from './src/features/beneficiary/AddBeneficiaryScreen';
import DataBeneficiaryScreen from './src/features/beneficiary/DataBeneficiaryScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TransactionProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            <Stack.Screen name="Beneficiary" component={AddBeneficiaryScreen} />
            <Stack.Screen name="DataBeneficiary" component={DataBeneficiaryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </GestureHandlerRootView>
  );
};

export default App;
