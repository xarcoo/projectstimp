import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './authContext';
import Index from './index';
import Highscore from './highscore';
import Logout from './logout';

const Drawer = createDrawerNavigator();

function DrawerLayout() {
  const [username, setUsername] = useState<string>('');

  const getUsername = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (username !== null) {
        setUsername(username); 
      } else {
        setUsername('');
      }
    } catch (e) {
      console.error('Error reading username from AsyncStorage', e);
    }
  };

  useEffect(() => {
    getUsername()
  }, [username]);

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Index} options={{ drawerLabel: "Home", title: username }} />
      <Drawer.Screen name="Highscore" component={Highscore} options={{ drawerLabel: "Highscore" }} />
      <Drawer.Screen name="Log Out" component={Logout} options={{ drawerLabel: 'Log Out' }} />
    </Drawer.Navigator>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <DrawerLayout />
    </AuthProvider>
  )
}
