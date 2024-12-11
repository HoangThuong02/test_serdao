import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Switch } from 'react-native';
import { useTransactions } from './component/TransactionContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import IBAN from 'iban';

interface Props {
  navigation: any;
}

const TransactionScreen = (props: Props) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const { addTransaction } = useTransactions();
  const [ibanValid, setIbanValid] = useState<boolean | null>(null);
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  // Format IBAN 4 characters 😎
  const formatIban = (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    const formattedValue = cleanValue.match(/.{1,4}/g)?.join(' ') || '';
    return formattedValue.toUpperCase();
  };

  const handleIbanChange = (text: string) => {
    if (isSimpleMode) {
      const cleanText = text.replace(/\s/g, '').toUpperCase();
      const firstTwoChars = cleanText.slice(0, 2);

      if (/^[A-Z]{2}/.test(firstTwoChars)) {
        const formattedText = formatIban(cleanText.slice(0, 34));
        setIban(formattedText);
        setIbanValid(true);
      } else {
        const formattedText = formatIban(cleanText);
        setIban(formattedText);
        setIbanValid(false);
      }
    } else {
      const formattedText = formatIban(text);
      setIban(formattedText);
      setIbanValid(IBAN.isValid(text));
    }
  };

  const handleTransaction = () => {
    if (!amount || !name || !iban) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    const accountDetails = { name, iban };
    addTransaction(parseFloat(amount), accountDetails);
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Transaction</Text>
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
        style={[styles.input, ibanValid === false ? { borderColor: 'red' } : {}]}
        onChangeText={handleIbanChange}
        value={iban}
        placeholder="Recipient IBAN"
        placeholderTextColor="#999"
      />
      {/* Add simple mode for easy testing IBAN 💕 */}
      <View style={styles.switchContainer}>
        <Text>Use Simple IBAN Handling (For test easy)</Text>
        <Switch
          value={isSimpleMode}
          onValueChange={setIsSimpleMode}
        />
      </View>
      {ibanValid === false && (
        <Text style={styles.errorText}>IBAN is invalid. Please correct it.</Text>
      )}
      <Button title="Submit Transaction" onPress={handleTransaction} />
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
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginVertical: 8,
  },
});

export default TransactionScreen;
