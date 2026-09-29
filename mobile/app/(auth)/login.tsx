// ============================================================
// IMPORTS
// ============================================================

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';

import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as SecureStore from "expo-secure-store"

// ajuda o navegador fechar quando a autenticação é concluida

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from '@expo-google-fonts/poppins';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors } from '@/constants/Colors';


// ============================================================
// COMPONENTE
// ============================================================

export default function Login() {


    // ========================================================
    // ESTADOS
    // ========================================================

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [mostrarSenha, setSenhaMostrar] = useState(false);

    const [mensagem, setMsg] = useState('');
    const [passarPag, setpassarPag] = useState<boolean | null>(null);


    // ========================================================
    // ESTADOS DO POPUP
    // ========================================================

    const [mensagemMostrar, setMensagemMostrar] = useState('');
    const [titleMostrar, setTitleMostrar] = useState('');
    const [sucessoMsg, setSucessoMsg] = useState(false);
    const [popUpMostrar, setPopUpMostrar] = useState(false);

    console.log(mensagemMostrar)
    console.log(titleMostrar)
    console.log(sucessoMsg)
    console.log(popUpMostrar)


    // ========================================================
    // PARÂMETROS DA ROTA
    // ========================================================

    const { mensagemErro, sucessoRedefinicao } =
        useLocalSearchParams<{
            mensagemErro?: string;
            sucessoRedefinicao?: string;
        }>();

    const { sucessoCadastro } =
        useLocalSearchParams<{
            sucessoCadastro?: string;
        }>();

    const { tokenLogin } = 
        useLocalSearchParams<{
            tokenLogin?: string
        }>();


    // ========================================================
    // FONTES
    // ========================================================

    const [fontsLoaded] = useFonts({

        PlusJakartaExtraLight:
            require('../../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),

        PlusJakartaMedium:
            require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),

        PlusJakartaBold:
            require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),

        PlusJakartaSemiBold:
            require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),

        PlusJakartaExtraLignItalic:
            require('../../assets/fonts/PlusJakartaSans-ExtraLightItalic.ttf'),

    });


    // ========================================================
    // USE EFFECT
    // ========================================================

    useEffect(() => {

        

        formatMensagemErro();

        mensagemRedefinicaoSenha();
        
        mensagemCadastroSucedido();

        saveTokenLogin();

        getTokenLogin();

    }, [mensagemErro, sucessoRedefinicao, sucessoCadastro, tokenLogin]);

    console.log(mensagemErro)
    console.log(sucessoRedefinicao)
    console.log(sucessoCadastro)


    // ========================================================
    // MENSAGENS DE RECUPERAÇÃO DE SENHA
    // ========================================================

    const formatMensagemErro = () => {

        if (!mensagemErro) {
            return;
        }

        setPopUpMostrar(true);

        if (
            mensagemErro === 'Token nao corresponde' ||
            mensagemErro === 'Token expirado'
        ) {

            setTitleMostrar(
                'Falha ao redefinir a senha.'
            );

            setMensagemMostrar(
                'O token é inválido ou foi expirado.'
            );

            setSucessoMsg(
                sucessoRedefinicao === 'true'
            );

        } else if (
            mensagemErro === 'Algo inesperado aconteceu'
        ) {

            setTitleMostrar(
                'Falha ao redefinir a senha.'
            );

            setMensagemMostrar(
                'Algo inesperado aconteceu...'
            );

            setSucessoMsg(
                sucessoRedefinicao === 'true'
            );
        }

    };


    const mensagemRedefinicaoSenha = () => {

        if (!sucessoRedefinicao) {
            return;
        }

        setPopUpMostrar(true);

        setTitleMostrar('Tudo certo!');

        setMensagemMostrar(
            'Sua senha foi atualizada com sucesso. Você já pode fazer login com sua nova senha.'
        );

        setSucessoMsg(
            sucessoRedefinicao === 'true'
        );
    }
         
     const mensagemCadastroSucedido = () => {

        if (!sucessoCadastro) {
            return;
        }

        setPopUpMostrar(true);

        setTitleMostrar('Tudo certo!');

        setMensagemMostrar(
            'Sua conta já está ativa. Você já pode fazer login e controlar suas finanças!'
        );

        setSucessoMsg(
            sucessoCadastro === 'true'
        );

    };

    const saveTokenLogin = async () => {
        if (tokenLogin) {
            console.log("token login criado no celular")
             await SecureStore.setItemAsync(
            "tokenLogin", 
            tokenLogin
            )
        }
        
    }

    const getTokenLogin = async () => {
        
        const token = await SecureStore.getItemAsync(
        "tokenLogin", 
        )
            console.log("token login tentando ver aqui")
            console.log(token)
        
        const response = await fetch('http://192.168.15.6:8080/api/validarTokenLogin', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify ({
                token: token
            })
        })

        const resposta = await response.json();
        const tokenValido = resposta.tokenValido;

        console.log(tokenValido + " token valido")
        console.log(token)

        if (tokenValido && token) {
            router.replace({
                pathname: '../(tabs)',
                params: {
                  token: token  
                },
            })
        }
    }


    // ========================================================
    // FECHAR POPUP
    // ========================================================

    const fecharPopup = () => {

        setPopUpMostrar(false);

    };


    // ========================================================
    // LOGIN
    // ========================================================

    const handleLogin = async () => {

        try {

            const response = await fetch(
                'http://192.168.15.6:8080/api/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: senha,
                    }),
                }
            );


            const resultado = await response.json();


            setpassarPag(resultado.passarPag);
            setMsg(resultado.mensagem);

console.log(resultado.passarPag + " " + resultado.perfilAtivo + "variaveis") 
            if (resultado.passarPag === true && resultado.perfilAtivo === true) {

                router.push({
                    pathname: '/verificacaoUser',
                    params: {
                        email: email,
                    },
                });
            } else if (resultado.passarPag === true  && resultado.perfilAtivo === false) {
                   router.push({
                    pathname: '/emailExiste',
                    params: {
                        email: email,
                    },
                });
            }

        } catch (error) {

            setpassarPag(false);

            setMsg(
                'Não foi possível se conectar ao servidor'
            );

            console.log(error);

        }

    };


    // ========================================================
    // NAVEGAÇÃO
    // ========================================================

    const irRecuperacaoSenha = () => {

        router.push('/solicitarRedefinicao');

    };


    const irCadastro = () => {

        router.push('/cadastro');

    };


    // ========================================================
    // AGUARDAR FONTES
    // ========================================================

    if (!fontsLoaded) {
        return null;
    }


    // ========================================================
    // TELA
    // ========================================================

    return (

        <LinearGradient
            colors={[
                Colors.primary,
                Colors.primaryDark
            ]}
            style={styles.backgroundFundo}
        >


            {/* ==================================================
                POPUP
            ================================================== */}

            {mensagemMostrar && popUpMostrar && (

                <View
                    style={
                        sucessoMsg
                            ? styles.divMsgCodeSucess
                            : styles.divMsgCodeError
                    }
                >

                    <Pressable
                        style={styles.btnFechar}
                        onPress={fecharPopup}
                    >

                        <Ionicons
                            name="close"
                            size={18}
                            style={styles.simbolBtnFechar}
                        />

                    </Pressable>


                    <Image
                        style={styles.imgMsgCode}
                        source={
                            sucessoMsg
                                ? require(
                                    '../../assets/images/corretoSimbol.png'
                                )
                                : require(
                                    '../../assets/images/erro.png'
                                )
                        }
                    />


                    <View style={styles.linhaVertical} />


                    <View style={styles.divMsgCodeInterno}>

                        <Text style={styles.titleMsgCode}>
                            {titleMostrar}
                        </Text>

                        <Text style={styles.subTitleMsgCode}>
                            {mensagemMostrar}
                        </Text>

                    </View>

                </View>

            )}


            {/* ==================================================
                CARD PRINCIPAL
            ================================================== */}

            <View style={styles.divPrincipal}>


                {/* TÍTULO */}

                <Text style={styles.title}>
                    Bem-vindo!
                </Text>

                <Text style={styles.subTitle}>
                    Faça login para acessar sua conta.
                </Text>


                <View style={styles.loginContent}>


                    {/* ==================================================
                        E-MAIL
                    ================================================== */}

                    <Text style={styles.textInput}>
                        E-mail
                    </Text>

                    <View style={styles.inputBloco}>

                        <Ionicons
                            style={styles.simboloInput}
                            name="mail-outline"
                            size={22}
                            color="rgba(118, 113, 113, 0.5)"
                        />

                        <TextInput
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="seu@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                        />

                    </View>


                    {/* ==================================================
                        SENHA
                    ================================================== */}

                    <View style={styles.AlinhaSenhaText}>

                        <Text style={styles.textInput}>
                            Senha
                        </Text>

                        <Pressable
                            onPress={irRecuperacaoSenha}
                        >

                            <Text style={styles.textEsqueceuSenha}>
                                Esqueceu sua senha?
                            </Text>

                        </Pressable>

                    </View>


                    <View style={styles.inputBloco}>

                        <Ionicons
                            style={styles.simboloInput}
                            name="lock-closed-outline"
                            size={22}
                            color="rgba(118, 113, 113, 0.5)"
                        />


                        <TextInput
                            style={styles.input}
                            secureTextEntry={mostrarSenha}
                            placeholder="Sua Senha"
                            value={senha}
                            onChangeText={setSenha}
                        />


                        <Pressable
                            onPress={() =>
                                setSenhaMostrar(!mostrarSenha)
                            }
                        >

                            <Ionicons
                                style={styles.buttonEye}
                                name={
                                    mostrarSenha
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                }
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                            />

                        </Pressable>

                    </View>


                    {/* ==================================================
                        ERRO
                    ================================================== */}

                    {mensagem && (

                        <View style={styles.msgErrorView}>

                            <Text style={styles.msgError}>
                                {mensagem}
                            </Text>

                        </View>

                    )}


                    {/* ==================================================
                        BOTÃO LOGIN
                    ================================================== */}

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={handleLogin}
                    >

                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>

                    </Pressable>


                    {/* ==================================================
                        GOOGLE
                    ================================================== */}

                    <View style={styles.OrganizaBloco}>

                        <View style={styles.line} />

                        <Text style={styles.TextLine}>
                            ou continue com
                        </Text>

                        <View style={styles.line} />

                    </View>


                    <Pressable style={styles.buttonGoogle}>

                        <Image
                            style={styles.imgGoolge}
                            source={require(
                                '../../assets/images/google.png'
                            )}
                        />

                        <Text style={styles.buttonTextGoogle}>
                            Entrar com Google
                        </Text>

                    </Pressable>


                    {/* ==================================================
                        CADASTRO
                    ================================================== */}

                    <View style={styles.OrganizaBlocoCads}>

                        <Text style={styles.TextLine}>
                            Não tem uma conta?
                        </Text>

                        <Pressable onPress={irCadastro}>

                            <Text style={styles.TextLine1}>
                                Cadastre-se
                            </Text>

                        </Pressable>

                    </View>


                </View>

            </View>


            {/* ==================================================
                TEXTO INFERIOR
            ================================================== */}

            <View style={styles.textBottomDiv}>

                <Ionicons
                    name="shield"
                    style={styles.iconBottom}
                />

                <Text style={styles.textBottom}>
                    Seus dados estão seguros conosco
                </Text>

            </View>


        </LinearGradient>
    );
}
const styles = StyleSheet.create({

    // ========================================================
    // FUNDO
    // ========================================================

    backgroundFundo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },


    // ========================================================
    // CARD
    // ========================================================

    divPrincipal: {
        backgroundColor: Colors.background,
        width: '85%',
        maxWidth: 400,
        borderRadius: 10,
        padding: '5%',

        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.35)',
    },

    loginContent: {
        width: '100%',
        alignItems: 'flex-start',
        paddingTop: 10,
    },


    // ========================================================
    // TÍTULOS
    // ========================================================

    title: {
        textAlign: 'center',
        color: Colors.text,
        fontSize: 25,
        fontFamily: 'PlusJakartaBold',
    },

    subTitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 14,
        fontFamily: 'PlusJakartaMedium',
    },


    // ========================================================
    // INPUTS
    // ========================================================

    textInput: {
        fontFamily: 'PlusJakartaSemiBold',
        marginTop: 15,
        marginBottom: 8,
        fontSize: 12,
    },

    inputBloco: {
        flexDirection: 'row',
        alignItems: 'center',

        borderColor: 'rgba(188, 188, 188, 0.5)',
        borderWidth: 1,
        borderRadius: 15,

        width: '100%',
        height: 50,

        paddingHorizontal: 12,
    },

    input: {
        flex: 1,
        fontFamily: 'PlusJakartaExtraLight',
    },

    simboloInput: {
        width: 30,
    },

    buttonEye: {
        width: 30,
    },


    // ========================================================
    // SENHA
    // ========================================================

    AlinhaSenhaText: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textEsqueceuSenha: {
        alignSelf: 'flex-end',
        fontSize: 10,
        marginTop: 15,
        marginBottom: 8,
        color: Colors.primary,
        fontFamily: 'PlusJakartaSemiBold',
    },


    // ========================================================
    // BOTÃO
    // ========================================================

    button: {
        backgroundColor: Colors.primary,
        width: '100%',
        justifyContent: 'center',
        height: 45,
        marginTop: 10,
        borderRadius: 15,
    },

    buttonPressed: {
        backgroundColor: Colors.primaryDark,
    },

    buttonText: {
        color: Colors.background,
        fontFamily: 'PlusJakartaMedium',
        textAlign: 'center',
        fontSize: 13,
    },


    // ========================================================
    // GOOGLE
    // ========================================================

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

    buttonTextGoogle: {
        color: Colors.text,
        fontFamily: 'PlusJakartaMedium',
        fontSize: 13,
    },

    imgGoolge: {
        width: 20,
        height: 20,
    },


    // ========================================================
    // DIVISORES
    // ========================================================

    OrganizaBloco: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 5,
        marginBottom: 5,
    },

    line: {
        marginTop: 10,
        height: 1,
        flex: 1,
        backgroundColor: 'rgba(144, 144, 144, 0.5)',
    },

    TextLine: {
        color: Colors.textSecondary,
        marginHorizontal: 5,
        fontFamily: 'PlusJakartaMedium',
        marginTop: 5,
    },


    // ========================================================
    // CADASTRO
    // ========================================================

    OrganizaBlocoCads: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 10,
    },

    TextLine1: {
        color: Colors.primary,
        fontFamily: 'PlusJakartaMedium',
        marginTop: 5,
    },


    // ========================================================
    // ERRO
    // ========================================================

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
        borderRadius: 10,
    },


    // ========================================================
    // POPUP
    // ========================================================

    divMsgCodeSucess: {
        backgroundColor: '#f0fbec',
        marginBottom: 20,
        padding: 10,
        width: '80%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',

        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.35)',
    },

    divMsgCodeError: {
        backgroundColor: '#fbecec',
        marginBottom: 20,
        padding: 10,
        width: '80%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',

        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.35)',
    },

    imgMsgCode: {
        width: 30,
        height: 30,
    },

    linhaVertical: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(144, 144, 144, 0.5)',
        marginHorizontal: 10,
    },

    divMsgCodeInterno: {
        width: '80%',
    },

    titleMsgCode: {
        fontSize: 14,
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
    },

    subTitleMsgCode: {
        fontSize: 10,
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
    },

    btnFechar: {
        position: 'absolute',
        right: 5,
        top: 5,
    },

    simbolBtnFechar: {
        color: 'rgba(62, 62, 62, 0.5)',
    },


    // ========================================================
    // RODAPÉ
    // ========================================================

    textBottomDiv: {
        position: 'absolute',
        bottom: 60,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textBottom: {
        color: Colors.background,
        fontFamily: 'PlusJakartaExtraLignItalic',

        textShadowColor: 'rgb(0, 0, 0)',
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        textShadowRadius: 3,
    },

    iconBottom: {
        color: Colors.background,
        marginHorizontal: 5,
    },

})

