import {Stack} from 'expo-router';

export default function redirecionamentoAuth() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen
        name = "login"
        options = {{headerShown: false}}
      />

      <Stack.Screen
        name = "(tabs)"
        options = {{headerShown: false}}
      />

      <Stack.Screen
        name = "modal"
        options = {{headerShown: false}}
      />
    </Stack>
  )
}