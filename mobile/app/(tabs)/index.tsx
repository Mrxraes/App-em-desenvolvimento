import { Redirect } from 'expo-router';
import { StyleSheet,Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <Text>Inicio</Text>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    text: {
      color: '#000000',
      fontSize: 24,
      fontWeight: 'bold',
    }
  }
)