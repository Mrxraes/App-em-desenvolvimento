import { Stack, Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { DataProvider } from "../../context/DataContext";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // tabs é para barra de navegação
    // stack cria uma sobreposição

    <DataProvider>
      <Stack screenOptions={{
          headerShown: false,
          animation: "fade",
      
        }} >
      
      <Stack.Screen 
        name="DadosPessoais">
      </Stack.Screen>

    

      </Stack>
    </DataProvider>
  );
}
