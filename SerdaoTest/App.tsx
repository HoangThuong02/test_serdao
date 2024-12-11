import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionProvider } from './src/screen/transaction/component/TransactionContext';
import HomeScreen from './src/screen/home/HomeScreen';
import TransactionScreen from './src/screen/transaction/TransactionScreen';
import AddBeneficiaryScreen from './src/screen/beneficiary/AddBeneficiaryScreen';
import DataBeneficiaryScreen from './src/screen/beneficiary/DataBeneficiaryScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


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
