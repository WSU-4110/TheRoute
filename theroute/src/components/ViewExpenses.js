//ViewExpensesScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';

export default function ViewExpensesScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    axios.get('http://127.0.0.1:8000/api/expenses/')
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        setErrorMessage('Error fetching expenses');
      });
  };

  const deleteExpense = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/expenses/delete_expense/${id}/`)
      .then(response => {
        alert('Expense deleted successfully');
        fetchExpenses(); // Refresh the list
      })
      .catch(error => {
        setErrorMessage('Error deleting expense');
      });
  };

  return (
    <View>
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} - {item.amount} ({item.category})</Text>
            <Button title="Delete" onPress={() => deleteExpense(item.id)} />
          </View>
        )}
      />
      <Button title="Add New Expense" onPress={() => navigation.navigate('AddExpense')} />
    </View>
  );
}
