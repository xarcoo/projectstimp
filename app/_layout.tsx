import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./screens/authContext";

function RootLayout() {
  const { isLoggedIn } = useAuth(); // Get logged-in status
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("./login");
    } else {
      router.replace("/screens/");
    }
  }, [isLoggedIn]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "160421050 - 160421110", headerBackVisible: false }} />
      <Stack.Screen name="screens" options={{ headerShown: false }} />
      <Stack.Screen name="grid" options={{ title: "Game" }} />
      <Stack.Screen name="hasil" options={{ title: 'Hasil', headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  )
}
