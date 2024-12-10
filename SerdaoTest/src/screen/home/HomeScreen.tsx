import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useTransactions } from '../transaction/component/TransactionContext';

interface Props {
  navigation: any;
}

const HomeScreen = ({ navigation }: Props): JSX.Element => {
  const { transactions, balance } = useTransactions();

  const renderItem = ({ item }: ListRenderItemInfo<typeof transactions[number]>) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Transaction ID: {item.id}</Text>
      <Text style={styles.itemText}>Amount: ${item.amount.toFixed(2)}</Text>
      <Text style={styles.itemText}>To: {item.account.name}</Text>
      <Text style={styles.itemText}>IBAN: {item.account.iban}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Current Balance: ${balance.toFixed(2)}</Text>
      <Button
        title="Add Transaction"
        onPress={() => navigation.navigate('Transaction')}
      />
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No transactions available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  listContainer: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
