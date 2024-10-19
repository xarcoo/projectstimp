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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{textAlign:'center', width: 200, fontSize: 14, marginBottom: 20 }}>Akan terdapat 5 level yang akan mengharuskan player untuk mengingat posisi-posisi persegi yang diberi warna hijau, setelah beberapa detik akan berubah menjadi warna abu-abu.</Text>
      <Button title="PLAY GAME" onPress={() => router.push('../grid')}></Button>
    </View>
  );
}
