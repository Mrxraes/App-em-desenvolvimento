import {Stack} from 'expo-router';

export default function redirecionamentoAuth() {
  return (
    <Stack initialRouteName="login" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name = "login"
      />
      
      <Stack.Screen
        name = "redefinir-senha"
      />

      <Stack.Screen
        name = "solicitarRedefinicao"
      />

      <Stack.Screen
        name = "verificacaoUser"
      />

      <Stack.Screen
        name = "cadastro"
      />


    </Stack>
  )
}