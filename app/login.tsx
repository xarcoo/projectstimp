import * as React from 'react';
import { Card,Button }  from "@rneui/base";
import { View, StyleSheet, Text,TextInput } from 'react-native';
import { useAuth } from './screens/authContext';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

function Login () {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async () => {
    if (password === '1234') {
      try {
        await AsyncStorage.setItem('username', username);
        alert('Login successful');
        login();
        router.replace('/screens');
      } catch (e) {
        console.error('Error saving data to AsyncStorage', e);
      }
    } else {
      alert('Username or password is incorrect');
    }
  };
    
  return (
    <Card>
      <Card.Title>Silakan Login</Card.Title>
      <Card.Divider/>
      <View style={styles.viewRow}>
        <Text>Username </Text>
        <TextInput style={styles.input} onChangeText={(text) => setUsername(text)} value={username} />
      </View>
      <View style={styles.viewRow}>
        <Text>Password </Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(text) => setPassword(text)} value={password} />
      </View>
      <View style={styles.viewRow}>
        <Button style={styles.button} titleStyle={{ fontWeight: 'bold' }} buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)', borderRadius: 3, }} title="Submit" onPress={()=>{doLogin()}} />
      </View>
    </Card>
  );
}

export default Login;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    height: 40,
    width: 200,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    paddingRight: 50,
    margin: 3
  }
});
  