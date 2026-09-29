//organizar codigo
import { StyleSheet, View, Text, Image, TextInput, Pressable } from 'react-native'
import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts } from '@expo-google-fonts/poppins'
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'

export default function verificacaoEmail() {

    //console.log("Cheguei na verificação");

    const [ tempoReenvioCod, setTempoReenvioCod ] = useState(0) 
    const { email } = useLocalSearchParams<{ email: string}>();
    const [ reenviar, setReenviar ] = useState(false)
    const { loginSucedido,  } = useLocalSearchParams<{ 
        loginSucedido?: string; 
    }>();


    useEffect(() => { 

        SendMail();
        
    }, [reenviar])

     const SendMail = async () => {
        //Resquisições devem ter "try" e "catch"
        //Eu devo chamar o método no useEffect e o "[]" diz que ele sera chamado quandio carregar a tela, não a cada componente inserido
            try {

            console.log("Dentro ")
                const response = await fetch('http://192.168.15.6:8080/api/confirmarCadastro', {

                    method: 'POST',

                    headers: {
                        'Content-Type' : 'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        loginSucedido: loginSucedido
                    }),

                    }

                );

                //
                if (!response.ok) {
                    throw new Error("Ocorreu um erro no envio do e-mail.")
                }
                console.log("E-mail enviado.")
                //   

            } catch (erro) {
                console.log(erro)
            }
        };

    const contarTempoReenvio = async () => {
        setTempoReenvioCod(30)
            const intervalo = setInterval(() => {
            // pega o valor mais atual possível naquele momento
            setTempoReenvioCod((tempoAtual) => {
                if (tempoAtual <= 0) {
                    return 0
                }

                return tempoAtual - 1
            })
        }, 1000) 
    } 

    const clickReenviar = async () => {
        if (tempoReenvioCod != 0) {
            return false
        }
        setReenviar(!reenviar)
        contarTempoReenvio()
    }

    const [fontsLoaded] = useFonts({
                PlusJakartaExtraLight: require('../../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
                PlusJakartaMedium: require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
                PlusJakartaBold: require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
                PlusJakartaSemiBold: require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf')
            });
    
            if (!fontsLoaded) {
                return null;
            }

    return (
    

        <LinearGradient colors={[Colors.background, Colors.background]} style={styles.background}>
      
            <View style={styles.divPrincipal}>

                <View style={styles.containerLogo}>
                    <Text style={styles.logo}>My<Text style={styles.logoAzul}>Finances</Text> </Text>
                </View>

                <View style={styles.containerImg}>
                    <Image style={styles.emailImg} source={require('../../assets/images/confirmCadas.png')}></Image>
                </View>

                <Text style={styles.title}>Confirme seu Cadastro</Text>
                    <View style={styles.divSubTitle}>
                        <Text style={styles.subTitle}>Enviamos um link de confirmação para <Text style={styles.subTitleEmail}>{email}.</Text> Acesse o link para confirmar seu cadastro e ativar sua conta</Text>
                    </View>

                <View style={styles.ContainerObs}>
                    <View style={styles.SubContainerObs}>
                        <Ionicons name="information-circle-outline" style={styles.iconObs} size={25}></Ionicons>
                        <View style={styles.alinharText}>
                            <Text style={styles.titleObs}>Não recebeu o e-mail?</Text>
                            <Text style={styles.subTitleObs}>Verifique sua caixa de spam ou solicite o reenvio do e-mail de confirmação</Text>
                              
                        </View>
                    </View>

                    <View style={styles.containerBtn}>
                        <Pressable onPress={clickReenviar} style={({ pressed }) => [styles.subContainerBtn, pressed && styles.subContainerBtn] }>
                            {({ pressed }) => (
                                <Text style={[styles.reenviarMail, pressed && styles.reenviarMailPress]}>Reenviar e-mail</Text>
                            )}
                        </Pressable>

                        {tempoReenvioCod > 0 && (
                            <View style={styles.divConometroReenvio}>
                                <Text style={styles.textConometroReenvio}>
                                    {"Aguarde 00:" + String(tempoReenvioCod).padStart(2, '0') + " para reenviar."}
                                </Text>
                            </View>
                        )}

                    </View>
                  
                </View>

            </View>

                    {/*mensagem && (
                        <View style={sucesso? styles.divSucess : styles.divError}>
                            <Text style={sucesso? styles.msgSucess : styles.msgError}>
                                {mensagem}
                            </Text>
                        </View>
                    )*/}

                {/*
                    <View style={styles.divTextTemp}>
                        <Text style={styles.textCode}>O código expira em </Text>
                        <Text style={numberTF ? styles.codVerificaTrue : styles.codVerificaFalse}>{String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}</Text>
                    </View>

                    <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={HandleValidation}>                        
                        <Text  style={styles.buttonText}>Verificar</Text>
                    </Pressable>

                <View style={styles.reenviarCodeDiv}>
                    <Text style={styles.reenviarCodeText}>Não recebeu o código?</Text>
                    <Pressable style={({pressed}) => [styles.reenviarCodeButton, pressed && styles.reenviarCodeButtonPressed]} onPress={reenviarCodigo}>
                        {({ pressed }) => (
                        <><Ionicons name="reload" style={[styles.reenviarCodeText1, pressed && styles.reenviarCodeText1Pressed,]}></Ionicons>
                        <Text style={[styles.reenviarCodeText1, pressed && styles.reenviarCodeText1Pressed,]}>Reenviar código</Text></>
                        )}  
                    </Pressable>

                    {tempoReenvioCod > 0 && (
                        <View style={styles.divConometroReenvio}>
                            <Text style={styles.textConometroReenvio}>
                                {"Aguarde 00:" + String(tempoReenvioCod).padStart(2, '0') + " para reenviar."}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.line}></View>

                    <Pressable style={({pressed}) => [styles.voltarLoginButton, pressed && styles.voltarLoginButtonPressed]}>
                        {({ pressed }) => (
                        <><Ionicons name="chevron-back" size={14} style={[styles.voltarLoginText, pressed && styles.voltarLoginTextPressed,]}></Ionicons><Text style={[styles.voltarLoginText, pressed && styles.voltarLoginTextPressed,]} onPress={voltarLogin}>Voltar para o login</Text></>
                        )}  
                    </Pressable>
            
            */}
        </LinearGradient>
     
    )

  
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    divPrincipal: {
        backgroundColor: Colors.background,
        width: '85%',
        maxWidth: 400,
        borderRadius: 10,
        padding: '5%',
    },

    containerLogo: {
        alignItems: 'center',
    },

    logo: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
        fontSize: 18,
    },

    logoAzul: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.primary,
        fontSize: 18,
    },

    containerImg: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    emailImg: {
        width: 200,
        height: 200,
        marginTop: 10,
        marginBottom: 10,
    },

    title: {
        textAlign: 'center',
        color: Colors.text,
        fontSize: 25,
        fontFamily: 'PlusJakartaBold',
    },

    divSubTitle: {
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
        paddingHorizontal: 5,
        justifyContent: 'center',
    },

    subTitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontFamily: 'PlusJakartaMedium',
        fontSize: 16,
    },

    subTitleEmail: {
        fontFamily: 'PlusJakartaSemiBold',
    },

    ContainerObs: {
        backgroundColor: '#d4e5fbb7',
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 15,

        
    },

    SubContainerObs: {
        flexDirection: 'row',
    },

    iconObs: {
        color: Colors.primary,
        marginLeft: 25

    },

    alinharText: {
        marginHorizontal: 10,
        paddingRight: 10,
    },

    titleObs: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.primary,
        marginBottom: 5,
        fontSize: 12,
    },

    subTitleObs: {
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
        fontSize: 12,
    },

    containerBtn: {
    },

    subContainerBtn: {
        alignItems: 'center',
    },


    reenviarMail: {
        marginTop: 10,
        color: Colors.primary,
        alignItems: 'center',
    },

    reenviarMailPress: {
        marginTop: 10,
        color: Colors.primaryDark,
        alignItems: 'center',
        textDecorationLine: 'underline'
    },

    divConometroReenvio: {
        marginTop: 5
    },

    textConometroReenvio: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontFamily: 'PlusJakartaExtraLight'
    }
})  
