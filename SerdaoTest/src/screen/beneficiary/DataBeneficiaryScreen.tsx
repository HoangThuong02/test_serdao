import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Beneficiary {
    id: string;
    firstName: string;
    lastName: string;
    iban: string;
}

const DataBeneficiaryScreen: React.FC = () => {
    const [data, setData] = useState<Beneficiary[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        try {
            const storedData = await AsyncStorage.getItem('@beneficiary');
            if (storedData) {
                console.log('JSON.parse(storedData)', JSON.parse(storedData));

                setData(JSON.parse(storedData) as Beneficiary[]);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSearch = (text: string): void => {
        setSearchText(text);
    };

    const filteredData = data.filter((item) =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchText.toLowerCase())
    );

    const confirmDelete = (item: Beneficiary): void => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete ${item.firstName} ${item.lastName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteItem(item) },
            ]
        );
    };

    const deleteItem = async (itemToDelete: Beneficiary): Promise<void> => {
        const updatedData = data.filter((item) => item.iban !== itemToDelete.iban);
        setData(updatedData);
        await AsyncStorage.setItem('@beneficiary', JSON.stringify(updatedData));
    };

    const renderItem = ({ item }: { item: Beneficiary }): JSX.Element => (
        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDelete(item)}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            )}
        >
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.itemIBAN}>{item.iban}</Text>
            </View>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                value={searchText}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 1,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemIBAN: {
        fontSize: 14,
        color: 'black',
        marginTop: 4,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginBottom: 8,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
    },
});

export default DataBeneficiaryScreen;
