import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionProvider } from './src/screen/transaction/component/TransactionContext';
import HomeScreen from './src/screen/home/HomeScreen';
import TransactionScreen from './src/screen/transaction/TransactionScreen';
import BeneficiaryScreen from './src/screen/beneficiary/BeneficiaryScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Transaction" component={TransactionScreen} />
          <Stack.Screen name="Beneficiary" component={BeneficiaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
};

export default App;
