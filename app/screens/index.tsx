import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuth} from "./authContext";
import { Button } from "@rneui/base";
import Animated, { SlideInDown, SlideInLeft, SlideInRight, SlideInUp, ZoomInDown, ZoomInUp } from "react-native-reanimated";

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
      <Animated.Text style={{textAlign:'center', width: 500, fontSize: 30, marginBottom: 20 }} entering={ZoomInUp.duration(1000)}>
        Akan terdapat <b>5 level</b> yang akan mengharuskan player untuk mengingat posisi-posisi persegi yang diberi warna <Text style={{ color: 'lightgreen' }}><b>hijau</b></Text>, setelah beberapa detik akan berubah menjadi warna <Text style={{ color: 'grey' }}><b>abu-abu</b></Text>.
      </Animated.Text>
      <Animated.View entering={ZoomInDown.duration(1000)}>
        <Button title="PLAY GAME" style={{ width: 200 }} titleStyle={{ fontWeight: 'bold' }} buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)', borderRadius: 3, }} onPress={() => router.push('../grid')}></Button>
      </Animated.View>
      </View>
  );
}
