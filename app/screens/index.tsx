import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth} from "./authContext";
import { Button } from "@rneui/base";
import Animated, { BounceInUp, ZoomInDown, ZoomInUp } from "react-native-reanimated";

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
      <Animated.View style={styles.card} entering={BounceInUp.duration(1500)}>
        <Animated.Text style={{textAlign:'center', fontSize: 20, fontFamily: 'verdana', }} entering={ZoomInUp.duration(1000)}>
          Game terdiri dari <b>5 level</b> yang mengharuskan player untuk mengingat posisi-posisi persegi berwarna <Text style={{ color: 'lime' }}>hijau</Text>, 
          yang setelah beberapa detik akan berubah menjadi warna <Text style={{ color: 'silver' }}>abu-abu</Text>. Player perlu menekan persegi yang sebelumnya berwarna 
          <Text style={{ color: 'lime' }}> hijau</Text>. Jika player menekan persegi yang salah, maka game akan langsung berakhir, dan persegi yang ditekan akan
          berubah menjadi warna <Text style={{ color: 'red' }}>merah</Text>.
        </Animated.Text>
      </Animated.View>
      <Animated.View entering={ZoomInDown.duration(1000)}>
        <Button title="PLAY GAME" style={{ width: 200, }} titleStyle={{ fontWeight: 'bold' }} buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)', borderRadius: 3, }} onPress={() => router.push('../grid')}></Button>
      </Animated.View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    padding: 16,
    marginVertical: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});