import { Alert, StyleSheet, Text, TextInput, View, Button, ToastAndroid, Switch } from 'react-native';
import React, { useState } from 'react';
import IBAN from 'iban';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    navigation: any;
}

const AddBeneficiaryScreen = (props: Props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [iban, setIban] = useState('');
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

    // add new beneficiary and save it 😍
    const handleAddNew = async () => {
        if (!ibanValid) {
            ToastAndroid.show('Invalid IBAN. Please enter a valid one.', ToastAndroid.SHORT);
            return;
        }

        try {
            const storedData = await AsyncStorage.getItem('@beneficiary');
            const parsedData = storedData ? JSON.parse(storedData) : [];

            const newId = parsedData.length > 0
                ? parsedData[parsedData.length - 1].id + 1
                : 1;

            const accountDetails = { id: newId, firstName, lastName, iban };

            const updatedData = [...parsedData, accountDetails];

            await AsyncStorage.setItem('@beneficiary', JSON.stringify(updatedData));
            ToastAndroid.show(` 🎉🎉 Add new beneficiary successfully 🎉🎉`, ToastAndroid.SHORT);

            props.navigation.goBack();
        } catch (error) {
            ToastAndroid.show(`Error! Please try again ❗`, ToastAndroid.SHORT);
            console.error('Error saving data', error);
        }
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
            {/* Add simple mode for easy testing IBAN */}
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
            <Button
                disabled={!firstName || !lastName || !iban ? true : false}
                title="Add new beneficiary"
                onPress={handleAddNew}
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

export default AddBeneficiaryScreen;
