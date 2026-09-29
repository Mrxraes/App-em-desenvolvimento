
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useState } from 'react';
import { useFonts } from '@expo-google-fonts/poppins';

export default function Cadastro() {

    // ========================================================
    // DADOS CADASTRO
    // ========================================================


    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [salario, setSalario] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    
    // ========================================================
    // RESPONSE DO CADASTRO
    // ========================================================


    const [nomeMsg, setNomeMsg] = useState('');
    const [sobrenomeMsg, setSobrenomeMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [salarioMsg, setSalarioMsg] = useState('');
    const [dataNascimentoMsg, setDataNascimentoMsg] = useState('');
    const [senhaMsg, setSenhaMsg] = useState('');
    const [senhaConfirmMsg, setSenhaConfirmMsg] = useState('');

    const [nomeBoo, setNomeBoo] = useState(true);
    const [sobrenomeBoo, setSobrenomeBoo] = useState(true);
    const [emailBoo, setEmailBoo] = useState(true);
    const [salarioBoo, setSalarioBoo] = useState(true);
    const [dataNascimentoBoo, setDataNascimentoBoo] = useState(true);
    const [senhaBoo, setSenhaBoo] = useState(true);
    const [confirmarSenhaBoo, setConfirmarSenhaBoo] = useState(true);

    // ========================================================
    // ESTADOS
    // ========================================================

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

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
    
    const formatarData = (texto: string) => {
        let valor = texto.replace(/\D/g, '').slice(0, 8)

        if (valor.length > 2) {
            valor = valor.slice(0, 2) + "/" + valor.slice(2)
        }

        if (valor.length > 5) {
            valor = valor.slice(0, 5) + "/" + valor.slice(5)
        }

        return valor
    }

    const handleCadastro = async () => {
        const response = await fetch("http://192.168.15.6:8080/api/cadastro", {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                sobrenome: sobrenome,
                email: email,
                salario: salario,
                dataNascimento: dataNascimento,
                senha: senha,
                senhaConfirm: confirmarSenha
            }) 
           
            

        })
        
        const resultado = await response.json();

        const validoNome = resultado.validoNome;
        const validoSobrenome = resultado.validoSobrenome;
        const validoEmail = resultado.validoEmail;
        const validoSalario = resultado.validoSalario;
        const validoDataNascimento = resultado.validoDataNascimento;
        const validoSenha = resultado.validoSenha;

        setNomeBoo(validoNome)
        setSobrenomeBoo(validoSobrenome)
        setEmailBoo(validoEmail)
        setSalarioBoo(validoSalario)
        setDataNascimentoBoo(validoDataNascimento)
        setSenhaBoo(validoSenha)

        const mensagemNome = resultado.mensagemoNome;
        const mensagemSobrenome = resultado.mensagemSobrenome;
        const mensagemEmail = resultado.mensagemEmail;
        const mensagemSalario = resultado.mensagemSalario;
        const mensagemDataNascimento = resultado.mensagemDataNascimento;
        const mensagemSenha = resultado.mensagemSenha;

        setNomeMsg(mensagemNome)
        setSobrenomeMsg(mensagemSobrenome)
        setEmailMsg(mensagemEmail)
        setSalarioMsg(mensagemSalario)
        setDataNascimentoMsg(mensagemDataNascimento)
        setSenhaMsg(mensagemSenha)

        console.log(validoNome)
        console.log(resultado)

        // confirmar email --> clica no link enviado no e-email, este link deve validar o token e, após valido, insere TRUE no usuario para definir como usuario ativo, quero colocar o dia que foi criado aquele "user" e definir uma stored procedure que exclui usuarios que nao confirmam sua conta em 30 minutos.

        // Quero uma pag dizendo que sera enviado um link de confirmação do email para confirmar a conta "cadastro.java" deve criar o user e depois que nessa tela confirmar ele insere no banco que o usuario esta true, enviando na navegação a mensagem pro login em caso de sucesso (sua conta foi criada com sucesso) ou em caso de erro (token invalido)

        if (validoNome && validoSobrenome && validoEmail && validoSalario && validoDataNascimento && validoSenha) {
            router.push({
                pathname: '/emailExiste', // criar "confirmarEmail"
                params: {
                    email:email
                }

            })
        }

        // inserir mensagens em cada contexto em caso de valido == false e criar um route para autenticação caso o cadastro seja validado. 
    }

    return (
        <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ?  'position' : 'height'}
            >
            <ScrollView
                keyboardShouldPersistTaps="handled"
            >
           
                <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.background}
                >
                
                
                    {/* ==================================================
                        CARD PRINCIPAL
                    ================================================== */}
                    <View style={styles.card}>
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
                        {/* TÍTULO */}
                        <Text style={styles.title}>
                            Criar sua conta
                        </Text>
                        <Text style={styles.subTitle}>
                            Preencha os dados abaixo para começar
                        </Text>
                        {/* NOME */}
                        <Text style={styles.label}>
                            Nome
                        </Text>
                        <View style={nomeBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="person-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu primeiro nome"
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>

                        {!nomeBoo && nomeMsg && (
                            <View style={styles.containerError}>
                            <Image style={styles.imagesError} source={require("../../assets/images/alert.png")}></Image>
                                <Text style={styles.textError}>
                                    {nomeMsg}
                                </Text>
                            </View>
                        )}
                    
                        {/* SOBRENOME */}
                        <Text style={styles.label}>
                            Sobrenome
                        </Text>
                        <View style={sobrenomeBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="id-card-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu sobrenome"
                                value={sobrenome}
                                onChangeText={setSobrenome}
                            />
                        </View>

                        {!sobrenomeBoo && sobrenomeMsg && (
                            <View style={styles.containerError}>
                            <Image style={styles.imagesError} source={require("../../assets/images/alert.png")}></Image>
                                <Text style={styles.textError}>
                                    {sobrenomeMsg}
                                </Text>
                            </View>
                        )} 

                        {/* E-MAIL */}
                        <Text style={styles.label}>
                            E-mail
                        </Text>
                        <View style={emailBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="mail-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {!emailBoo && emailMsg && (
                            <View style={styles.containerError}>
                            <Image style={styles.imagesError} source={require("../../assets/images/alert.png")}></Image>
                                <Text style={styles.textError}>
                                    {emailMsg}
                                </Text>
                            </View>
                        )}

                        {/* SALÁRIO */}
                        <Text style={styles.label}>
                            Salário (opcional)
                        </Text>

                        <View style={salarioBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="cash-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                keyboardType="phone-pad"
                                placeholder="Digite seu salário"
                                value={salario}
                                onChangeText={setSalario}
                            />
                        </View>

                        {!salarioBoo && salarioMsg && (
                            <View style={styles.containerError}>
                            <Image style={styles.imagesError} source={require("../../assets/images/alert.png")}></Image>
                                <Text style={styles.textError}>
                                    {salarioMsg}
                                </Text>
                            </View>
                        )}

                        {
    // terminar todos os add e entender as mensagens se estao vindo certas, dar sysout em cada uma no back-end e fornt end -- add na linha acima somente ")}"
                        }

                        {/* DATA */}
                        <Text style={styles.label}>
                            Data de Nascimento
                        </Text>
                        <View style={dataNascimentoBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="calendar-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                maxLength={10}
                                placeholder="DD/MM/AAAA"
                                keyboardType="numeric"
                                value={dataNascimento} 
                                onChangeText={(texto) => {
                                    setDataNascimento(formatarData(texto));
                                }}
                            />
                        </View>

                    {!dataNascimentoBoo && dataNascimentoMsg && (
                            <View style={styles.containerError}>
                            <Image style={styles.imagesError} source={require("../../assets/images/alert.png")}></Image>
                                <Text style={styles.textError}>
                                    {dataNascimentoMsg}
                                </Text>
                            </View>
                        )}
    
                        {/* SENHA */}
                        <Text style={styles.label}>
                            Senha
                        </Text>
                        <View style={senhaBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!mostrarSenha}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChangeText={setSenha}
                            />
                            <Pressable
                                onPress={() => setMostrarSenha(!mostrarSenha)}
                            >
                                <Ionicons
                                    name={
                                        mostrarSenha
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                    }
                                    size={22}
                                    color="rgba(118, 113, 113, 0.5)"
                                />
                            </Pressable>
                        </View>
                        {/* CONFIRMAR SENHA */}
                        <Text style={styles.label}>
                            Confirmar senha
                        </Text>
                        <View style={senhaBoo? styles.inputContainer : styles.inputContainerError}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={22}
                                color="rgba(118, 113, 113, 0.5)"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!mostrarConfirmarSenha}
                                placeholder="Confirme sua senha"
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                            />
                            <Pressable
                                onPress={() =>
                                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                                }
                            >
                                <Ionicons
                                    name={
                                        mostrarConfirmarSenha
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                    }
                                    size={22}
                                    color="rgba(118, 113, 113, 0.5)"
                                />
                            </Pressable>
                        </View>

                            {!senhaBoo && senhaMsg && (
                            <View style={styles.containerError}>
                            <Image style={styles.imagesError} source={require("../../assets/images/alert.png")}></Image>
                                <Text style={styles.textError}>
                                    {senhaMsg}
                                </Text>
                            </View>
                        )}


                        {/* BOTÃO */}
                        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPress]} onPress={handleCadastro}>
                            <Text style={styles.buttonText}>
                                Cadastrar
                            </Text>
                        </Pressable>
                        {/* VOLTAR PARA LOGIN */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.textSecondary}>
                                Já tem uma conta?
                            </Text>
                            <Pressable
                                onPress={() => router.push('/login')}
                            >
                                <Text style={styles.loginText}>
                                    Voltar para o login
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({

    /* FUNDO */

    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },


    /* CARD */

    card: {
        marginBottom: 50,
        marginTop: 50,
        backgroundColor: Colors.background,
        width: '85%',
        maxWidth: 400,
        borderRadius: 10,
        padding: '5%',
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.35)',
    },


    /* TÍTULO */

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
        marginTop: 5,
        marginBottom: 10,
    },


    /* LABEL */

    label: {
        fontFamily: 'PlusJakartaSemiBold',
        marginTop: 15,
        marginBottom: 8,
        fontSize: 12,
        color: Colors.text,
    },


    /* INPUT */

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        borderColor: 'rgba(188, 188, 188, 0.5)',
        borderWidth: 1,
        borderRadius: 15,

        width: '100%',
        height: 50,

        paddingHorizontal: 12,
    },

    inputContainerError: {
        flexDirection: 'row',
        alignItems: 'center',

        borderColor: Colors.error,
        borderWidth: 1,
        borderRadius: 15,

        width: '100%',
        height: 50,

        paddingHorizontal: 12,
    },

    icon: {
        width: 30,
    },

    input: {
        flex: 1,
        fontFamily: 'PlusJakartaExtraLight',
    },

    containerError: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10,
        marginLeft: 5,
        
    },  

    imagesError: {
        width: 20,
        height: 20
    },

    textError: {
        marginHorizontal: 5,
        fontFamily: 'PlusJakartaMedium',
        color: Colors.error
    },

    /* BOTÃO */

    button: {
        backgroundColor: Colors.primary,

        width: '100%',
        height: 45,

        justifyContent: 'center',

        marginTop: 20,

        borderRadius: 15,
    },

    buttonPress: {
         backgroundColor: Colors.primaryDark,

        width: '100%',
        height: 45,

        justifyContent: 'center',

        marginTop: 20,

        borderRadius: 15,
    },

    buttonText: {
        color: Colors.background,
        fontFamily: 'PlusJakartaMedium',
        textAlign: 'center',
        fontSize: 13,
    },


    /* LOGIN */

    loginContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 15,
    },

    textSecondary: {
        color: Colors.textSecondary,
        fontFamily: 'PlusJakartaMedium',
        fontSize: 12,
    },

    loginText: {
        color: Colors.primary,
        fontFamily: 'PlusJakartaMedium',
        fontSize: 12,
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
});