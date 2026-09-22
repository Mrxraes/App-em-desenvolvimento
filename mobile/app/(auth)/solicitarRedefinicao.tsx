// organizar codigo
    import { Colors } from '@/constants/Colors';
    import { Image , Pressable, StyleSheet, Text, View, TextInput, KeyboardAvoidingView,
        Platform, 
        Linking} from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { useFonts } from '@expo-google-fonts/poppins';
    import { Ionicons } from '@expo/vector-icons'
    import { useState } from 'react';
    import { router } from 'expo-router';

    // componente nao pode ser async

    export default function SolicitarRedefinicao() {

        const [ email, setEmail ] = useState('');
        const [ mensagem, setMensagem ] = useState('');
        const [ sucessoEnvio, setSucessoEnvio ] = useState(null);

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

        const handleAutentication = async () => {
            try {
                    const response = await fetch('http://192.168.15.6:8080/api/socilitarRedefinicao', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        email:email
                    })
                })

                const resposta = await response.json();
                setMensagem(resposta.mensagem);
                setSucessoEnvio(resposta.sucessoEnvio)
                console.log(resposta.sucessoEnvio);
                console.log(resposta.mensagem);
                
                
            } catch (erro) {
                console.log(erro)
            }
        }

        const voltarLogin = async () => {
        router.push({
            pathname: "/login"
        })
    }

        return (
        <LinearGradient  colors={[Colors.primary, Colors.primaryDark]} style={styles.backgroundFundo}>
                <View style={styles.divPrincipal} >
                    <View style={styles.containerImg}>
                        <Image source={require('../../assets/images/cadeadoImg.png')} style={styles.imgTop}></Image>
                    </View>
                  
                    <Text style={styles.title}>Recuperar Senha</Text>
                    <Text style={styles.subTitle}>Digite o seu e-mail e enviaremos um link pra redefinir sua senha.</Text>


                    <Text style={styles.textInput}>E-mail</Text>
                        <View style={styles.inputBloco}>
                            <Ionicons style={styles.simboloInput} name="mail-outline" size={22} color="rgba(118, 113, 113, 0.5)"></Ionicons>                        
                            <TextInput  style={styles.input} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="seu@gmail.com" value={email} onChangeText={setEmail}></TextInput>
                    </View>

                    {mensagem && ( 
                    <View style={sucessoEnvio? styles.msgSucessView :  styles.msgErrorView}>
                            <Text style={sucessoEnvio? styles.msgSucessText :  styles.msgErrorText}>
                                {mensagem}
                            </Text>    
                        </View> 
                    )}
                    
                    <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleAutentication}>                        
                            <Text  style={styles.buttonText}>Enviar link</Text>
                    </Pressable>

                    <Pressable style={({pressed}) => [styles.voltarLoginButton, pressed && styles.voltarLoginButtonPressed]}>
                        {({ pressed }) => (
                        <><Ionicons name="chevron-back" size={14} style={[styles.voltarLoginText, pressed && styles.voltarLoginTextPressed,]}></Ionicons><Text style={[styles.voltarLoginText, pressed && styles.voltarLoginTextPressed,]} onPress={voltarLogin}>Voltar para o login</Text></>
                        )}  
                    </Pressable >
                       
                    {/*<Pressable onPress={Link}>
                        <Text>Link</Text>
                    </Pressable>*/}

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

        imgTop: {
            height: 80,
            width: 80,

        },

        containerImg: {
            justifyContent: 'center',
            alignItems: 'center'
        },

        divPrincipal: {
            backgroundColor: Colors.background,
            width: '85%',
            maxWidth: 400,
            borderRadius: 10,
            padding:'5%',
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.35)'
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
            marginTop: 30,
            marginBottom: 8,
            fontSize: 12
        }, 

        simboloInput: {
            width:30
        },

        button: {
            backgroundColor: Colors.primary,
            width: '100%',
            justifyContent: 'center',
            height: 45,
            marginTop: 20,
            borderRadius: 15
        },

        buttonPressed: {    
            backgroundColor: Colors.primaryDark
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

        imgGoolge: {
            width:20,
            height:20,
        },

         voltarLoginDiv: {
            justifyContent: 'center',
        },

        voltarLoginButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop:25,
            gap: 5
        },

        voltarLoginButtonPressed: {
        },

        voltarLoginText: {
            color: Colors.primary,
        },

        voltarLoginTextPressed: {
            color: Colors.primaryDark,
            textDecorationLine: 'underline'
        },


        msgErrorText: {
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

              msgSucessText: {
            color: Colors.success,
        },


        msgSucessView: {
            backgroundColor: '#1af53b4f',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            borderRadius: 10
        },
    })

