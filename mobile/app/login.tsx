import { Colors } from '@/constants/Colors';
import { Image , Pressable, StyleSheet, Text, View, TextInput, KeyboardAvoidingView,
    Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react';
import { Assets } from '@react-navigation/elements';

export default function Login() {

    const [mostrarSenha, setSenhaMostrar] = useState(false)
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [fontsLoaded] = useFonts({
        PlusJakartaExtraLight: require('../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
        PlusJakartaMedium: require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
        PlusJakartaBold: require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
        PlusJakartaSemiBold: require('../assets/fonts/PlusJakartaSans-SemiBold.ttf')

    });

    if (!fontsLoaded) {
        return null;
    }

    return (
       <LinearGradient  colors={[Colors.primary, Colors.primaryDark]} style={styles.backgroundFundo}>
            <View style={styles.divPrincipal} >
                {/*<Text style={styles.logo}>LOGO</Text>*/}
                <Text style={styles.title}>Bem-vindo!</Text>
                <Text style={styles.subTitle}>Faça login para acessar sua conta.</Text>

                        <View style={styles.loginContent}>

                        <Text style={styles.textInput}>E-mail</Text>
                            <View style={styles.inputBloco}>
                                <Ionicons style={styles.simboloInput} name="mail-outline" size={22} color="rgba(118, 113, 113, 0.5)"></Ionicons>                        
                                <TextInput  style={styles.input} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="seu@gmail.com" value={email} onChangeText={setEmail}></TextInput>
                            </View>

                        <Text style={styles.textInput}>Senha</Text>
                            <View style={styles.inputBloco}>
                                <Ionicons style={styles.simboloInput} name="lock-closed-outline" size={22} color="rgba(118, 113, 113, 0.5)"></Ionicons>   
                                <TextInput style={styles.input} secureTextEntry={mostrarSenha} placeholder="Sua Senha" value={senha} onChangeText={setSenha} ></TextInput>
                                    <Pressable onPress={() => setSenhaMostrar(!mostrarSenha)}>
                                        <Ionicons style={styles.buttonEye} name= {mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="rgba(118, 113, 113, 0.5)"></Ionicons>                        
                                    </Pressable>
                            </View>

                            <Text style={styles.textEsqueceuSenha}>Esqueceu sua senha?</Text>
                            
                            <Pressable style={styles.button}>                        
                                    <Text  style={styles.buttonText}>Entrar</Text>
                            </Pressable>
                            
                            <View style={styles.OrganizaBloco}>
                                <View style={styles.line}></View>
                                <Text style={styles.TextLine}>ou continue com</Text>
                                <View style={styles.line}></View>
                            </View>

                            <Pressable style={styles.buttonGoogle}>
                                <Image style={styles.imgGoolge} source={require('../assets/images/google.png')}></Image>                    
                                <Text  style={styles.buttonTextGoogle}>Entrar com Google</Text>
                            </Pressable>
                            
                            <View style={styles.OrganizaBlocoCads}>
                                
                                <Text style={styles.TextLine}>Não tem uma conta?</Text>
                                <Text style={styles.TextLine1}>Cadastre-se</Text>
                                
                            </View>

                    </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    backgroundFundo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    divPrincipal: {
        backgroundColor: Colors.background,
        height: '65%',
        width: '85%',
        maxWidth: 400,
        borderRadius: 10,
        padding:25,
    },

    loginContent: {
        width: '100%',
        alignItems: 'flex-start',
        paddingTop: 10
       
    },

    /*logo: {
        textAlign: 'center',
        color: Colors.primary, 
        fontSize: 20,
        fontFamily: 'PlusJakartaMedium'
    },*/

    title: {
        textAlign: 'center',
        color: Colors.text, 
        paddingTop: 10,
        fontSize: 25,
        fontFamily: 'PlusJakartaBold'
    },

    subTitle: {
        textAlign: 'center',
        color: Colors.textSecondary, 
        fontSize: 14,
        fontFamily: 'PlusJakartaMedium'
    },

    inputBloco: {
        flexDirection: "row",
        alignItems:'center',
        borderColor: "rgba(188, 188, 188, 0.5)",
        borderWidth: 1,
        borderRadius: 15,
        width:"100%",
        height: 50,
        paddingHorizontal: 12,
    },

    input: {
        flex:1,
        fontFamily: 'PlusJakartaExtraLight'
    },

    textInput: {
        fontFamily: 'PlusJakartaSemiBold',
        paddingTop: 15,
        paddingBottom: 8,
        fontSize: 12
    }, 

    simboloInput: {
        width:30
    },

    buttonEye: {
        width:30,
    },

    textEsqueceuSenha: {
        alignSelf: 'flex-end',
        fontSize: 12,
        marginTop: 10,
        color: Colors.primary,
        fontFamily: 'PlusJakartaSemiBold'
    },

    button: {
        backgroundColor: Colors.primary,
        width: '100%',
        justifyContent: 'center',
        height: 45,
        marginTop: 10,
        borderRadius: 15
    },

    buttonGoogle: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        marginTop: 10,
        borderRadius: 15,
        gap: 10,
        borderWidth: 1,
    },

    buttonText: {
        color:Colors.background,
        fontFamily: 'PlusJakartaMedium',
        textAlign: 'center',
        fontSize: 13
    },

    buttonTextGoogle: {
        color:Colors.text,
        fontFamily: 'PlusJakartaMedium',
        fontSize: 13,
    },

    OrganizaBloco: { 
        width: '100%',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 5,
        marginBottom: 5,

    },

    OrganizaBlocoCads: {
         width: '100%',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 10
    },

    line: {
        marginTop: 10,
        height: 1,
        flex:1,
        backgroundColor: 'rgba(144, 144, 144, 0.5)',
    },
    
    TextLine: {
        color: Colors.textSecondary,
        marginHorizontal: 5,
        fontFamily: 'PlusJakartaMedium',
        marginTop:5
    },
    
    TextLine1: {
        color: Colors.primary,
        alignItems: 'center',
        fontFamily: 'PlusJakartaMedium',
        marginTop:5
    },

    imgGoolge: {
        width:20,
        height:20,
    },

})

