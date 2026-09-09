import { StyleSheet, View, Text, Image, TextInput, Pressable } from 'react-native'
import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts } from '@expo-google-fonts/poppins'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function verificacaoEmail() {

    //console.log("Cheguei na verificação");

  
    const { email } = useLocalSearchParams<{ email: string}>();
    const [ tempo, setTempo ] = useState(60*10)
    const [ numberTF, setNumberTF ] = useState(true)
    const [ tempoReenvioCod, setTempoReenvioCod ] = useState(0) 

    const input1 = useRef<TextInput>(null);
    const input2 = useRef<TextInput>(null);
    const input3 = useRef<TextInput>(null);
    const input4 = useRef<TextInput>(null);
    const input5 = useRef<TextInput>(null);
    const input6 = useRef<TextInput>(null);


    const [codigoArray, setCodigoArray] = useState(["", "", "", "", "", ""])
    // no use state, quando o valor dependendo do numero anterior pra coexisitir uma arrow function é a forma mais segura. No react os estados nao sao atualizados de forma simultânea.
    const [codigo, setCodigo] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [popUpMostrar, setPopUpMostrar] = useState(false)

   useEffect(() => {

        const intervalo = setInterval(() => {

            setTempo((TempoAtual) => {

                if (TempoAtual <= 0) {
                    setNumberTF(false)
                    return 0;
                }

                return TempoAtual - 1;
            });

        }, 1000);

        return () => clearInterval(intervalo);

    }, []);



    useEffect(() => { 
            console.log("Fora")
        const SendMail = async () => {
        //Resquisições devem ter "try" e "catch"
        //Eu devo chamar o método no useEffect e o "[]" diz que ele sera chamado quandio carregar a tela, não a cada componente inserido
            try {

            console.log("Dentro ")
                const response = await fetch('http://192.168.15.6:8080/api/enviarEmailAutenticacao', {
                    method: 'POST',
                }) 
                if (!response.ok) {
                    throw new Error("Ocorreu um erro no envio do e-mail.")
                }
                console.log("E-mail enviado.")
            } catch (erro) {
                console.log(erro)
            }
        };
        SendMail();
    }, [])

    const minutos = Math.floor(tempo / 60)
    const segundos = tempo % 60 

    const [fontsLoaded] = useFonts({
                PlusJakartaExtraLight: require('../../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
                PlusJakartaMedium: require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
                PlusJakartaBold: require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
                PlusJakartaSemiBold: require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf')
            });
    
            if (!fontsLoaded) {
                return null;
            }

    const HandleValidation = async () => {
        console.log(codigo);
        try {
            console.log("dentro");
            const response = await fetch('http://192.168.15.6:8080/api/validarEmail', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                codigo: codigo
            }),
        });

        const resultado = await response.json()
        console.log(resultado)
        setMensagem(resultado.mensagem)
        setSucesso(resultado.loginSucedido)
        const loginSucedido = resultado.loginSucedido
            } catch (e) {
                console.log(e)
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

    const reenviarCodigo = async () => {
        try {
            const response = await fetch('http://192.168.15.6:8080/api/enviarEmailAutenticacao', {
            method: 'POST'
        })
            if (!response.ok) {
                throw new Error("Não foi possível pedir um novo código")
            } else if (tempoReenvioCod > 0) {
                console.log("O tempo de espera ainda não acabou.")
            } else {
                console.log("Novo código requisitado");
                setTempo(60*10);
                setCodigoArray(["", "", "", "", "", ""]);
                setCodigo("");
                setPopUpMostrar(true);
                contarTempoReenvio();
            }
        } catch (erro) {
            console.log(erro);
        }
    }

    const mudarEstadoPop = async () => {
        setPopUpMostrar(false)
    }

    return (
    

        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.background}>
            {popUpMostrar && (
                <View style={styles.divMsgCode}>
                <Pressable style={({ pressed }) => [styles.btnFechar, pressed && styles.btnFecharPress]} onPress={mudarEstadoPop}>
                    {({ pressed }) => (
                        <Ionicons name="close" size={18} style={[styles.simbolBtnFechar, pressed && styles.simbolBtnFecharPress]}></Ionicons>
                    )}
                </Pressable>
                <Image style={styles.imgMsgCode} source={require("../../assets/images/corretoSimbol.png")}></Image>
                <View style={styles.linhaVertical}></View>
                    <View style={styles.divMsgCodeInterno}>
                        <Text style={styles.titleMsgCode}>Código reenviado!</Text>
                        <Text style={styles.subTitleMsgCode}>Reenviamos um novo código para o seu e-mail. </Text>
                    </View>
                <Text></Text>
            </View>
            )}
            <View style={styles.divPrincipal}>
                <Text style={styles.title}>Verifique seu e-mail</Text>
                    <View style={styles.divSubTitle}>
                        <Text style={styles.subTitle}>Enviamos um código de 6 dígitos para</Text>
                        <Text style={styles.subTitleEmail}>{email}</Text>
                        <Image style={styles.emailImg} source={require('../../assets/images/emailVerification.png')}></Image>
                    </View>
                <Text style={styles.textInput}>
                    Código de Verificação
                </Text>
                    <View style={styles.alinharInputDiv}>
                            <TextInput style={styles.designEntrada}  placeholder="_" maxLength={1} ref={input1} autoCapitalize="characters"
                            onChangeText={(texto) => {
                                let novoCodigo = [...codigoArray];
                                    novoCodigo[0] = texto;
                                    setCodigoArray(novoCodigo)
                                    setCodigo(novoCodigo.join(''));
                                    console.log(novoCodigo)
                                if (texto.length === 1) {
                                    input2.current?.focus();
                                }
                            }}
                            onKeyPress={({nativeEvent}) => {
                                if (nativeEvent.key === "Backspace" && codigoArray[0].length === 0) {
                                    let novoCodigo = [...codigoArray];
                                    novoCodigo[0] = ""
                                    setCodigoArray(novoCodigo) 
                                    setCodigo(novoCodigo.join(''))
                                    console.log(novoCodigo)
                                }
                            }}></TextInput>
                    
                            <TextInput style={styles.designEntrada} placeholder="_" maxLength={1} ref={input2} autoCapitalize="characters"
                            onChangeText={(texto) => {
                                let novoCodigo = [...codigoArray];
                                    novoCodigo[1] = texto;
                                    setCodigoArray(novoCodigo)
                                    setCodigo(novoCodigo.join(''));
                                    console.log(novoCodigo)

                                if (texto.length === 1) {
                                    input3.current?.focus();
                            
                                }
                            }}
                            onKeyPress={({nativeEvent}) => {
                                if (nativeEvent.key === "Backspace" && codigoArray[1].length === 0) {
                                    let novoCodigo = [...codigoArray];
                                    novoCodigo[1] = ""
                                    setCodigoArray(novoCodigo) 
                                    setCodigo(novoCodigo.join(''))
                                    console.log(novoCodigo)
                                    input1.current?.focus()
                                }
                            }}></TextInput>

                            <TextInput style={styles.designEntrada} placeholder="_" maxLength={1} ref={input3} autoCapitalize="characters"
                            onChangeText={(texto) => {
                                let novoCodigo = [...codigoArray];
                                    novoCodigo[2] = texto;
                                    setCodigoArray(novoCodigo)
                                    setCodigo(novoCodigo.join(''));
                                    console.log(novoCodigo)

                                if (texto.length === 1) {
                                    input4.current?.focus();
                                }
                            }}
                            onKeyPress={({nativeEvent}) =>{
                                if (nativeEvent.key === "Backspace" && codigoArray[2].length === 0) {
                                    let novoCodigo = [...codigoArray];
                                    novoCodigo[2] = ""
                                    setCodigoArray(novoCodigo) 
                                    setCodigo(novoCodigo.join(''))
                                    console.log(novoCodigo)
                                    input2.current?.focus()
                                }
                            }}></TextInput>

                            <TextInput style={styles.designEntrada} placeholder="_" maxLength={1} ref={input4} autoCapitalize="characters"
                            onChangeText={(texto) => {
                                let novoCodigo = [...codigoArray];
                                    novoCodigo[3] = texto;
                                    setCodigoArray(novoCodigo)
                                    setCodigo(novoCodigo.join(''));
                                    console.log(novoCodigo)

                                if (texto.length === 1) {
                                    input5.current?.focus();
                                }
                            }} onKeyPress={({nativeEvent}) => {
                                if (nativeEvent.key === "Backspace" && codigoArray[3].length === 0) {
                                    let novoCodigo = [...codigoArray];
                                    novoCodigo[3] = ""
                                    setCodigoArray(novoCodigo) 
                                    setCodigo(novoCodigo.join(''))
                                    console.log(novoCodigo)
                                    input3.current?.focus()
                                }
                            }}></TextInput>
                            
                            <TextInput style={styles.designEntrada} placeholder="_" maxLength={1} ref={input5} autoCapitalize="characters"
                             onChangeText={(texto) => {
                                let novoCodigo = [...codigoArray];
                                    novoCodigo[4] = texto;
                                    setCodigoArray(novoCodigo)
                                    setCodigo(novoCodigo.join(''));
                                    console.log(novoCodigo)

                                if (texto.length === 1) {
                                    input6.current?.focus();
                                }
                            }} onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === "Backspace" && codigoArray[4].length === 0) {
                                    let novoCodigo = [...codigoArray];
                                    novoCodigo[4] = ""
                                    setCodigoArray(novoCodigo) 
                                    setCodigo(novoCodigo.join(''))
                                    console.log(novoCodigo)
                                    input4.current?.focus()
                                }
                            }}></TextInput>

                            <TextInput style={styles.designEntrada} placeholder="_" maxLength={1} ref={input6} autoCapitalize="characters"
                            onChangeText={( texto ) => {
                                let novoCodigo = [...codigo];
                                    novoCodigo[5] = texto;
                                    setCodigoArray(novoCodigo)
                                    setCodigo(novoCodigo.join(''));
                                    console.log(novoCodigo)
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === "Backspace" && codigoArray[5].length === 0) {
                                    let novoCodigo = [...codigoArray];
                                    novoCodigo[5] = ""
                                    setCodigoArray(novoCodigo) 
                                    setCodigo(novoCodigo.join(''))
                                    console.log(novoCodigo)
                                    console.log(codigo)
                                    input5.current?.focus()
                                }
                            }}></TextInput>

                    </View>

                    {mensagem && (
                        <View style={sucesso? styles.divSucess : styles.divError}>
                            <Text style={sucesso? styles.msgSucess : styles.msgError}>
                                {mensagem}
                            </Text>
                        </View>
                    )}

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
                        <View>
                            <Text>
                                {"00:" + String(tempoReenvioCod).padStart(2, '0')}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.line}></View>

                    <Pressable style={({pressed}) => [styles.voltarLoginButton, pressed && styles.voltarLoginButtonPressed]}>
                        {({ pressed }) => (
                        <><Ionicons name="chevron-back" size={14} style={[styles.voltarLoginText, pressed && styles.voltarLoginTextPressed,]}></Ionicons><Text style={[styles.voltarLoginText, pressed && styles.voltarLoginTextPressed,]}>Voltar para o login</Text></>
                        )}  
                    </Pressable>
            </View>
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
            padding:30,
        },

        title: {
            textAlign: 'center',
            color: Colors.text, 
            fontSize: 25,
            fontFamily: 'PlusJakartaBold'
        },

        divSubTitle: {
            marginTop: 10,
            alignItems: 'center'
        },

        subTitle: {
            textAlign: 'center',
            color:Colors.textSecondary,
            fontFamily: 'PlusJakartaMedium'
        },

        subTitleEmail: {
            textAlign: 'center',
            fontFamily: 'PlusJakartaSemiBold'

        },

        emailImg: {
            width: 80,
            height: 80,
            marginTop: 10,
            marginBottom: 10,
        },

        textInput: {
            fontFamily: 'PlusJakartaSemiBold',
            fontSize: 12
        },

        alinharInputDiv: {
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },

        designEntrada: {
      
            borderWidth: 1,
            marginHorizontal: 5,
            borderColor:  "rgba(188, 188, 188, 0.5)",
            borderRadius: 5,
            width: 37,
            height: 55,
            fontFamily: 'PlusJakartaSemiBold',
            textAlign: 'center',
            textTransform: 'uppercase'
        },

        divTextTemp: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'center'
        },

        textCode: {
            color: Colors.textSecondary,
            fontFamily: 'PlusJakartaMedium',
            fontSize: 12
        },

        codVerificaTrue: {
            fontFamily: 'PlusJakartaBold',
            fontSize: 10, 
            color:Colors.primary
        },

        codVerificaFalse: {
            fontFamily: 'PlusJakartaBold',
            fontSize: 10,
            color:Colors.error
        },

        button: {
            backgroundColor: Colors.primary,
            width: '100%',
            justifyContent: 'center',
            height: 45,
            marginTop: 25,
            borderRadius: 15
        },

        buttonText: {
            color:Colors.background,
            fontFamily: 'PlusJakartaMedium',
            textAlign: 'center',
            fontSize: 13
        },

        buttonPressed: {
            backgroundColor: Colors.primaryDark,
        },

        reenviarCodeDiv: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25
        },

        reenviarCodeText:    {
            color: Colors.textSecondary,
            fontSize: 12

        },

        reenviarCodeText1: {
            marginTop: 5,
            color: Colors.primary,
            fontSize: 14
        },

        reenviarCodeText1Pressed: {
            textDecorationLine: 'underline',
            color: Colors.primaryDark,

        },

        reenviarCodeButton: {
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
        },

        reenviarCodeButtonPressed: {
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
        },

        line: {
            marginTop: 15,
            width: "100%",
            height: 1,
            backgroundColor: 'rgba(144, 144, 144, 0.5)',
        },

        voltarLoginDiv: {
            justifyContent: 'center',
        },

        voltarLoginButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
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

        divSucess: {
            backgroundColor: '#1af54651',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            borderRadius: 10
        },

        divError: {
            backgroundColor: '#f51a344f',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            padding: 10,
            borderRadius: 10
        },

        msgSucess: {
            color: Colors.success
        },

        msgError: {
            color:Colors.error
        },
        
        divMsgCode: {
            backgroundColor: '#ECFBF4',
            marginBottom: 20,
            padding: 10,
            width: '80%',
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center'
        },


        imgMsgCode: {
            width: 30,
            height: 30
        },

        linhaVertical: {
            width: 1,
            height: 30,
            backgroundColor:  'rgba(144, 144, 144, 0.5)',
            marginHorizontal: 10
        },

        
        divMsgCodeInterno: {
        },

        titleMsgCode: {
            fontSize: 14,
            fontFamily: 'PlusJakartaBold',
            color: Colors.text
        },

        subTitleMsgCode: {
            fontSize: 10,
            fontFamily: 'PlusJakartaMedium',
            color: Colors.textSecondary
        },

        btnFechar: {
            position: 'absolute',
            right: 5,
            top: 5
        },

        simbolBtnFechar : {
            color:  'rgba(62, 62, 62, 0.5)',
        },

        btnFecharPress:{
            position: 'absolute',
            right: 5,
            top: 5,
            backgroundColor: Colors.textSecondary
        }, 

        simbolBtnFecharPress: {
            color:  Colors.background,
        }
    })  
