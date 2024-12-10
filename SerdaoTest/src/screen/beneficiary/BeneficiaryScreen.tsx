import { Alert, StyleSheet, Text, TextInput, View, Button, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import IBAN from 'iban';

interface Props {
    navigation: any;
}

const BeneficiaryScreen = (props: Props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [iban, setIban] = useState('');
    const [ibanValid, setIbanValid] = useState<boolean | null>(null);

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

        if (!ibanValid) {
            ToastAndroid.show('Invalid IBAN. Please enter a valid one.', ToastAndroid.SHORT);
            return;
        }

        ToastAndroid.show(`Add new beneficiary successfully!`, ToastAndroid.SHORT);
        props.navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Beneficiary</Text>
            <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="First Name"
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                onChangeText={setLastName}
                value={lastName}
                placeholder="Last Name"
                placeholderTextColor="#999"
            />
            <TextInput
                style={[styles.input, ibanValid === false ? { borderColor: 'red' } : {}]}
                onChangeText={handleIbanChange}
                value={iban}
                placeholder="IBAN"
                placeholderTextColor="#999"
            />
            {ibanValid === false && (
                <Text style={styles.errorText}>IBAN is invalid. Please correct it.</Text>
            )}
            <Button
                disabled={!firstName || !lastName || !iban ? true : false}
                title="Add new beneficiary"
                onPress={handleTransaction}
            />

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
    errorText: {
        color: 'red',
        marginTop: 8,
    },
});

export default BeneficiaryScreen;
