import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { AuthProvider, useAuth} from "./authContext";

export default function Index() {
  const [username, setUsername] = useState<string>('');
  const { logout } = useAuth();

  const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        setUsername(value); 
      } else {
        setUsername('');
        logout();
      }
    } catch (e) {
      console.error('Error reading username from AsyncStorage', e);
      setUsername(''); 
      logout();
    }
  };

  useEffect(() => {
    cekLogin()
  }, [username]);

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('username')
      alert('logged out');
      logout();
    } catch (e) {
    } 
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{username}</Text>
      <Button title="START" onPress={() => router.push('../grid')}></Button>
      <Button title="LOG OUT" onPress={()=>doLogout()}></Button>
    </View>
  );
}
