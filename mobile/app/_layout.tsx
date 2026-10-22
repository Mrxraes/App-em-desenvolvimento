import {Stack} from 'expo-router';

export default function redirecionamentoAuth() {
  return (
    <Stack initialRouteName="(auth)">
      <Stack.Screen
        name = "(auth)"
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

      <Stack.Screen
        name="Add"
        options={{
            headerShown: false,
      }}
      />

    </Stack>
  )
}