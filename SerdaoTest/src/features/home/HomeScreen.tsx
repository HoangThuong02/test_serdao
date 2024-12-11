import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTransactions } from '../transaction/hooks/useTransactions';

interface Props {
  navigation: any;
}

const HomeScreen = (props: Props): JSX.Element => {
  const { transactions, balance } = useTransactions();
  const reversedDataTransactions = [...transactions].reverse();

  const renderItem = ({ item }: ListRenderItemInfo<typeof transactions[number]>) => (
    <View style={styles.item}>
      <Text style={styles.itemTextID}>ID: {item.id}</Text>
      <View style={styles.viewRowBtn}>
        <Text style={styles.itemTextName}>{item.account.name}</Text>
        <Text style={styles.itemTextAmount}>-${item.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemTextIBAN}>IBAN: {item.account.iban}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.balanceNumber}>${balance.toFixed(2)}</Text>
      <Text style={styles.balanceText}>Current balance</Text>
      <View style={styles.viewRowBtn}>
        <View style={styles.viewColumnBtn}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => props.navigation.navigate('Transaction')}
          >
            <Icon name='bank' size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.titleBtn}>
            Add Transaction
          </Text>
        </View>

        <View style={styles.viewColumnBtn}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => props.navigation.navigate('Beneficiary')}
          >
            <Icon name='user-plus' size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.titleBtn}>
            Add New Beneficiary
          </Text>
        </View>

      </View>

      <Text style={styles.historyTxt}>
        History transactions
      </Text>

      {transactions.length > 0 ? (
        <FlatList
          data={reversedDataTransactions}
          showsVerticalScrollIndicator={false}
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
  item: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemTextID: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  itemTextName: {
    flex: 3,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  itemTextAmount: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  itemTextIBAN: {
    fontSize: 14,
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
  viewRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    backgroundColor: '#569F8B',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  viewColumnBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBtn: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8
  },
  historyTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20
  }
});

export default HomeScreen;
