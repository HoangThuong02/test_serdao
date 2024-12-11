import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Switch, ToastAndroid } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IBAN from 'iban';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTransactions } from './hooks/useTransactions';

interface Props {
  navigation: any;
  route: any;
}

const TransactionScreen = (props: Props) => {
  const [balance, setBalance] = useState(1000);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const { addTransaction } = useTransactions();
  const [ibanValid, setIbanValid] = useState<boolean | null>(null);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('@amount');

        if (storedBalance) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(1000);
          try {
            await AsyncStorage.setItem('@amount', '1000');
          } catch (error) {
            console.error('Error saving data', error);
          }
        }
      } catch (error) {
        console.error('Error loading balance from AsyncStorage', error);
        setBalance(1000);
      }
    };

    loadBalance();
  }, []);

  useEffect(() => {
    if (props.route.params?.beneficiary) {
      const { firstName, lastName, iban } = props.route.params.beneficiary;
      setName(`${firstName} ${lastName}`);
      setIban(iban);
      setIbanValid(IBAN.isValid(iban));
    }
  }, [props.route.params?.beneficiary]);

  const formatIban = (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    const formattedValue = cleanValue.match(/.{1,4}/g)?.join(' ') || '';
    return formattedValue.toUpperCase();
  };

  const handleIbanChange = (text: string) => {
    const formattedText = formatIban(text);
    setIban(formattedText);
    setIbanValid(IBAN.isValid(text));

  };

  const handleTransaction = () => {
    const accountDetails = { name, iban };
    addTransaction(parseFloat(amount), accountDetails);
    ToastAndroid.show(`The transaction was successful`, ToastAndroid.SHORT);
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Transaction</Text>

      <Text style={styles.balanceNumber}>${balance.toFixed(2)}</Text>
      <Text style={styles.balanceText}>Current balance</Text>

      <TouchableOpacity
        style={styles.viewSelect}
        onPress={() => props.navigation.navigate('DataBeneficiary')}
      >
        <Text>Select Beneficiary</Text>
        <Icon name="caret-down" size={20} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount}
        keyboardType="numeric"
        placeholder="Enter amount"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Recipient Name"
        placeholderTextColor="#999"
      />

      <TextInput
        style={[styles.input, ibanValid === false ? { borderColor: 'red' } : {}, { marginBottom: 20 }]}
        onChangeText={handleIbanChange}
        value={iban}
        placeholder="Recipient IBAN"
        placeholderTextColor="#999"
      />

      {ibanValid === false && (
        <Text style={styles.errorText}>IBAN is invalid. Please correct it.</Text>
      )}
      {parseFloat(amount) > balance && (
        <Text style={styles.errorText}>Insufficient balance</Text>
      )}
      <Button
        disabled={!amount || !name || !iban || parseFloat(amount) > balance ? true : false}
        title="Submit Transaction"
        onPress={handleTransaction}
        color={'#569F8B'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  balanceNumber: {
    fontSize: 22,
    fontWeight: '600',
    marginHorizontal: 12
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
    marginHorizontal: 12,
    color: 'gray'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    width: '90%',
    paddingHorizontal: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  viewSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    width: '90%',
    paddingHorizontal: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default TransactionScreen;
