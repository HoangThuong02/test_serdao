import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useTransactions } from './component/TransactionContext';


interface Props {
  navigation: any;
}

const TransactionScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const { addTransaction } = useTransactions();

  const handleTransaction = () => {
    if (!amount || !name || !iban) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    const accountDetails = { name, iban };
    addTransaction(parseFloat(amount), accountDetails);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Transaction</Text>
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
        style={styles.input}
        onChangeText={setIban}
        value={iban}
        placeholder="Recipient IBAN"
        placeholderTextColor="#999"
      />
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
});

export default TransactionScreen;
