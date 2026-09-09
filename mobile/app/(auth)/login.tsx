    import { Colors } from '@/constants/Colors';
    import { Image , Pressable, StyleSheet, Text, View, TextInput, KeyboardAvoidingView,
        Platform } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { useFonts } from '@expo-google-fonts/poppins';
    import { Ionicons } from '@expo/vector-icons'
    import { useState } from 'react';
    import { router } from 'expo-router';

    // componente nao pode ser async

    export default function Login() {

        console.log("Pag de login");

        const [mostrarSenha, setSenhaMostrar] = useState(false)
        const [email, setEmail] = useState('')
        const [senha, setSenha] = useState('')
        const [mensagem, setMsg] = useState('')
        const [passarPag, setpassarPag] = useState<boolean | null>(null)

        // método que executa quando botão de "entrar" é pressionado
        const handleLogin = async () => {
            console.log("1 - Pressão");
            try {
            console.log("2 - Iniciando requisição");
            console.log(email);
            console.log(senha);

            
            // envia uma requisição em JSON para o endereço onde está o Java, que vai reconhecer o metodo POST e o body para converter em "@ResquestBody"
            const response = await fetch('http://192.168.15.6:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

            const resultado = await response.json()
            setpassarPag(resultado.passarPag)
            setMsg(resultado.mensagem)

            const passarPagLogo = resultado.passarPag
            console.log(resultado.passarPag);
            console.log(resultado.mensagem);
            console.log(JSON.stringify(resultado, null, 2))


            if (passarPagLogo === true) {
                router.push({
                    pathname: '/verificacaoEmail',
                    params: { email }
                });
                
                console.log("Indo para a verificação");
            }
            console.log(`Executando ${passarPag}`)
            
        } catch (error) {
            setpassarPag(false);
            setMsg("Não foi possível se conectar ao servidor");
            console.log(error);      
        }
        }
    

        const [fontsLoaded] = useFonts({
            PlusJakartaExtraLight: require('../../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
            PlusJakartaMedium: require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
            PlusJakartaBold: require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
            PlusJakartaSemiBold: require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
            PlusJakartaExtraLignItalic: require('../../assets/fonts/PlusJakartaSans-ExtraLightItalic.ttf')

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

                            <View style={styles.AlinhaSenhaText}>
                                <Text style={styles.textInput}>Senha</Text>
                                <Text style={styles.textEsqueceuSenha}>Esqueceu sua senha?</Text>
                            </View>
                                <View style={styles.inputBloco}>
                                    <Ionicons style={styles.simboloInput} name="lock-closed-outline" size={22} color="rgba(118, 113, 113, 0.5)"></Ionicons>   
                                    <TextInput style={styles.input} secureTextEntry={mostrarSenha} placeholder="Sua Senha" value={senha} onChangeText={setSenha} ></TextInput>
                                        <Pressable onPress={() => setSenhaMostrar(!mostrarSenha)}>
                                            <Ionicons style={styles.buttonEye} name= {mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="rgba(118, 113, 113, 0.5)"></Ionicons>              
                                        </Pressable>
                                            
                                </View>

                                {mensagem && ( 
                                <View style={styles.msgErrorView}>
                                        <Text style={styles.msgError}>
                                            {mensagem}
                                        </Text>    
                                    </View> 
                                )}
                                

                                
                                <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleLogin}>                        
                                        <Text  style={styles.buttonText}>Entrar</Text>
                                </Pressable>
                                
                                <View style={styles.OrganizaBloco}>
                                    <View style={styles.line}></View>
                                    <Text style={styles.TextLine}>ou continue com</Text>
                                    <View style={styles.line}></View>
                                </View>

                                <Pressable style={styles.buttonGoogle}>
                                    <Image style={styles.imgGoolge} source={require('../../assets/images/google.png')}></Image>                    
                                    <Text  style={styles.buttonTextGoogle}>Entrar com Google</Text>
                                </Pressable>
                                
                                <View style={styles.OrganizaBlocoCads}>
                                    
                                    <Text style={styles.TextLine}>Não tem uma conta?</Text>
                                    <Text style={styles.TextLine1}>Cadastre-se</Text>
                                    
                                </View>
                        </View>
                </View>
                <View style={styles.textBottomDiv}>
                    <Ionicons name={"shield"} style={styles.iconBottom}></Ionicons>
                    <Text style={styles.textBottom}>
                        Seus dados estão seguros conosco
                    </Text>
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
            width: '85%',
            maxWidth: 400,
            borderRadius: 10,
            padding:25,
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.35)'
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
            marginTop: 15,
            marginBottom: 8,
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
            fontSize: 10,
            marginTop: 15,
            marginBottom: 8,
            color: Colors.primary,
            fontFamily: 'PlusJakartaSemiBold'
        },

        AlinhaSenhaText: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between'
        },  

        button: {
            backgroundColor: Colors.primary,
            width: '100%',
            justifyContent: 'center',
            height: 45,
            marginTop: 10,
            borderRadius: 15
        },

        buttonPressed: {    
            backgroundColor: Colors.primaryDark
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


        msgError: {
            color: Colors.error,
        },


        msgErrorView: {
            backgroundColor: '#f51a344f',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            borderRadius: 10
        },

        textBottomDiv: {
            position: 'absolute',
            bottom: 60,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },

        textBottom: {
            color: Colors.background,
            fontFamily: 'PlusJakartaExtraLignItalic',
            textShadowColor: 'rgb(0, 0, 0)',
            textShadowOffset: {
                width: 1,
                height: 1
            },
            textShadowRadius:3,
        },

        iconBottom: {
            color: Colors.background,
            marginHorizontal: 5
        }
    })

