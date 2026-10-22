import { Tabs } from 'expo-router';
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
      <Tabs  initialRouteName="index" screenOptions={{
          headerShown: false,
          animation: "fade",
      
        }} >
      
          <Tabs.Screen name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={color}
              />
            )
          }}>
          </Tabs.Screen>
          <Tabs.Screen name="Transacoes"
          options={{
            title: 'Transações',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="swap-horizontal-outline"
                size={size}
                color={color}
              />
            )
          }}>
          </Tabs.Screen>
          <Tabs.Screen name="Relatorios"
          options={{
            title: 'Relatórios',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="pie-chart-outline"
                size={size}
                color={color}
              />
            )
          }}>
          </Tabs.Screen>
          <Tabs.Screen name="Categorias"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="grid-outline"
                size={size}
                color={color}
              />
            )
          }}>
          </Tabs.Screen>
      
      </Tabs>
    </DataProvider>
  );
}
