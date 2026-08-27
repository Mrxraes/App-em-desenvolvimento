import { StyleSheet,Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Início</Text>  
    </View>
  );
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