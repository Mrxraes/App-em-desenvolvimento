// ============================================================
// IMPORTS
// ============================================================

import { Colors } from '@/constants/Colors';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';


// ============================================================
// COMPONENTE
// ============================================================

export default function RedefinirSenha() {


    // ========================================================
    // ESTADOS
    // ========================================================

    const [senha1, setSenha1] = useState('');
    const [senha2, setSenha2] = useState('');

    const [mostrarSenha1, setSenhaMostrar1] = useState(false);
    const [mostrarSenha2, setSenhaMostrar2] = useState(false);

    const [mensagem, setMensagem] = useState('');
    const [sucesso, setSucesso] = useState<boolean | null>(null);


    // ========================================================
    // PARÂMETROS DA ROTA
    // ========================================================

    const { token } = useLocalSearchParams();


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
    // AGUARDAR FONTES
    // ========================================================

    if (!fontsLoaded) {
        return null;
    }


    // ========================================================
    // REDEFINIR SENHA
    // ========================================================

    const redefinirSenha = async () => {

        try {

            const response = await fetch(
                `http://192.168.15.6:8080/api/redefinirSenha?token=${encodeURIComponent(
                    token as string
                )}`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        senha1: senha1,
                        senha2: senha2,
                    }),
                }
            );


            const resposta = await response.json();


            setMensagem(resposta.mensagem);
            setSucesso(resposta.sucesso);


            // ================================================
            // SENHA REDEFINIDA COM SUCESSO
            // ================================================

            if (resposta.sucesso) {

                router.replace({
                    pathname: '/login',

                    params: {
                        sucessoRedefinicao: resposta.sucesso,
                    },
                });

            }

        } catch (erro) {

            console.log(erro);

        }
    };


    // ========================================================
    // VOLTAR PARA O LOGIN
    // ========================================================

    const voltarLogin = () => {

        router.push('/login');

    };


    // ========================================================
    // TELA
    // ========================================================

    return (

        <LinearGradient
            colors={[
                Colors.primary,
                Colors.primaryDark,
            ]}
            style={styles.backgroundFundo}
        >

            {/* ==================================================
                CARD PRINCIPAL
            ================================================== */}

            <View style={styles.divPrincipal}>


                {/* ==================================================
                    ÍCONE
                ================================================== */}

                <View style={styles.centralizarImage}>

                    <Image
                        style={styles.logoImage}
                        source={require(
                            '../../assets/images/redefinirSenha.png'
                        )}
                    />

                </View>


                {/* ==================================================
                    TÍTULO
                ================================================== */}

                <Text style={styles.title}>
                    Redefinir sua senha
                </Text>

                <Text style={styles.subTitle}>
                    Escolha uma nova senha para continuar acessando sua conta.
                </Text>


                <View style={styles.loginContent}>


                    {/* ==================================================
                        NOVA SENHA
                    ================================================== */}

                    <Text style={styles.textInput}>
                        Nova senha
                    </Text>


                    <View style={styles.inputBloco}>

                        <Ionicons
                            style={styles.simboloInput}
                            name="lock-closed-outline"
                            size={22}
                            color="rgba(118, 113, 113, 0.5)"
                        />


                        <TextInput
                            style={styles.input}
                            secureTextEntry={!mostrarSenha1}
                            placeholder="Digite sua nova senha"
                            value={senha1}
                            onChangeText={setSenha1}
                        />


                        <Pressable
                            onPress={() =>
                                setSenhaMostrar1(!mostrarSenha1)
                            }
                        >

                            <Ionicons
                                style={styles.buttonEye}
                                name={
                                    mostrarSenha1
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                }
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                            />

                        </Pressable>

                    </View>


                    {/* ==================================================
                        CONFIRMAR SENHA
                    ================================================== */}

                    <Text style={styles.textInput}>
                        Confirmar nova senha
                    </Text>


                    <View style={styles.inputBloco}>

                        <Ionicons
                            style={styles.simboloInput}
                            name="lock-closed-outline"
                            size={22}
                            color="rgba(118, 113, 113, 0.5)"
                        />


                        <TextInput
                            style={styles.input}
                            secureTextEntry={!mostrarSenha2}
                            placeholder="Confirme sua nova senha"
                            value={senha2}
                            onChangeText={setSenha2}
                        />


                        <Pressable
                            onPress={() =>
                                setSenhaMostrar2(!mostrarSenha2)
                            }
                        >

                            <Ionicons
                                style={styles.buttonEye}
                                name={
                                    mostrarSenha2
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                }
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                            />

                        </Pressable>

                    </View>


                    {/* ==================================================
                        REGRAS DA SENHA
                    ================================================== */}

                    <View style={styles.divRegraSenha}>


                        {/* 8 A 64 CARACTERES */}

                        <View style={styles.listRegrasSenha}>

                            <Image
                                source={require(
                                    '../../assets/images/correct.png'
                                )}
                                style={styles.correctImg}
                            />

                            <Text style={styles.textRegrasSenha}>
                                Mínimo de 8 caracteres e máximo de 64.
                            </Text>

                        </View>


                        {/* MAIÚSCULA */}

                        <View style={styles.listRegrasSenha}>

                            <Image
                                source={require(
                                    '../../assets/images/correct.png'
                                )}
                                style={styles.correctImg}
                            />

                            <Text style={styles.textRegrasSenha}>
                                Pelo menos uma letra maiúscula.
                            </Text>

                        </View>


                        {/* MINÚSCULA */}

                        <View style={styles.listRegrasSenha}>

                            <Image
                                source={require(
                                    '../../assets/images/correct.png'
                                )}
                                style={styles.correctImg}
                            />

                            <Text style={styles.textRegrasSenha}>
                                Pelo menos uma letra minúscula.
                            </Text>

                        </View>


                        {/* NÚMERO */}

                        <View style={styles.listRegrasSenha}>

                            <Image
                                source={require(
                                    '../../assets/images/correct.png'
                                )}
                                style={styles.correctImg}
                            />

                            <Text style={styles.textRegrasSenha}>
                                Pelo menos um número.
                            </Text>

                        </View>


                        {/* ==================================================
                            MENSAGEM DE ERRO
                        ================================================== */}

                        {mensagem && !sucesso && (

                            <View style={styles.listRegrasSenha}>

                                <Image
                                    source={require(
                                        '../../assets/images/alert.png'
                                    )}
                                    style={styles.alertImg}
                                />

                                <Text style={styles.textAlertSenha}>
                                    {mensagem}
                                </Text>

                            </View>

                        )}

                    </View>


                    {/* ==================================================
                        BOTÃO REDEFINIR
                    ================================================== */}

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={redefinirSenha}
                    >

                        <Text style={styles.buttonText}>
                            Redefinir Senha
                        </Text>

                    </Pressable>


                    {/* ==================================================
                        DIVISOR
                    ================================================== */}

                    <View style={styles.OrganizaBloco}>

                        <View style={styles.line} />

                    </View>


                    {/* ==================================================
                        VOLTAR PARA LOGIN
                    ================================================== */}

                    <View style={styles.DivVoltaLogin}>
                        <Pressable 
                            style={({pressed}) => [
                                styles.voltarLoginButton, pressed && 
                                styles.voltarLoginButtonPressed]}>

                                {({ pressed }) => (
                                <><Ionicons name="chevron-back" 
                                    size={14} 
                                    style={[
                                        styles.voltarLoginText, pressed && 
                                        styles.voltarLoginTextPressed,]}>
                                </Ionicons>
                                
                                <Text style={[
                                        styles.voltarLoginText, pressed && 
                                        styles.voltarLoginTextPressed,]} 
                                    onPress={voltarLogin}>
                                        Voltar para o login
                                </Text></>
                                )}
                        </Pressable>
                    </View>


                </View>

            </View>

        </LinearGradient>
    );
}


// ============================================================
// STYLES
// ============================================================

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
    // CARD PRINCIPAL
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
    // ÍCONE
    // ========================================================

    centralizarImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoImage: {
        width: 80,
        height: 80,
    },


    // ========================================================
    // TÍTULO
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
    // INPUT
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
    // REGRAS DA SENHA
    // ========================================================

    divRegraSenha: {
        marginTop: 20,

        width: '90%',
    },

    listRegrasSenha: {
        marginTop: -15,

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    correctImg: {
        width: 40,
        height: 40,
    },

    textRegrasSenha: {
        color: Colors.textSecondary,

        fontFamily: 'PlusJakartaMedium',

        fontSize: 10,
    },

    alertImg: {
        width: 20,
        height: 20,

        margin: 10,
    },

    textAlertSenha: {
        color: Colors.error,

        fontFamily: 'PlusJakartaMedium',

        fontSize: 10,
    },


    // ========================================================
    // BOTÃO
    // ========================================================

    button: {
        backgroundColor: Colors.primary,

        width: '100%',
        height: 45,

        justifyContent: 'center',

        marginTop: 5,
        marginBottom: 5,

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
    // DIVISOR
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


    // ========================================================
    // VOLTAR PARA LOGIN
    // ========================================================

    DivVoltaLogin: {
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center',
    },

    voltarLoginButton: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 10,

        gap: 5,
    },

    voltarLoginButtonPressed: {},

    voltarLoginText: {
        color: Colors.primary,
    },

    voltarLoginTextPressed: {
        color: Colors.primaryDark,

        textDecorationLine: 'underline',
    },

});