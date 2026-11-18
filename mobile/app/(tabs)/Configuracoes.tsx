import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function Configuracoes() {

    // =====================================================
    // ESTADOS
    // =====================================================

    const [mostrarValores, setMostrarValores] = useState(true);
    const [notificacoes, setNotificacoes] = useState(true);

    const [aumentarFonte, setAumentarFonte] = useState(false);
    const [altoContraste, setAltoContraste] = useState(false);
    const [reduzirAnimacoes, setReduzirAnimacoes] = useState(false);

    // =====================================================
    // FUNÇÕES
    // =====================================================

    const sairDaConta = () => {
        Alert.alert(
            'Sair da conta',
            'Tem certeza de que deseja sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await SecureStore.deleteItemAsync('tokenLogin');

                            router.replace('/(auth)/login');
                        } catch (error) {
                            Alert.alert(
                                'Erro',
                                'Não foi possível sair da sua conta.'
                            );
                        }
                    },
                },
            ]
        );
    };

    const abrirDadosPessoais = () => {
        Alert.alert(
            'Dados pessoais',
            'Aqui você poderá consultar e modificar seus dados pessoais.'
        );
    };

    const abrirSeguranca = () => {
        Alert.alert(
            'Segurança e privacidade',
            'Aqui você poderá gerenciar sua senha e as opções de segurança da sua conta.'
        );
    };

    const abrirPreferencia = (titulo: string) => {
        Alert.alert(titulo, 'Essa opção poderá ser configurada nesta seção.');
    };

    const abrirSobre = () => {
        Alert.alert(
            'MyFinances',
            'Aplicativo de gerenciamento financeiro pessoal.'
        );
    };

    // =====================================================
    // COMPONENTES VISUAIS
    // =====================================================

    const TituloSecao = ({ titulo }: { titulo: string }) => (
        <Text style={styles.tituloSecao}>{titulo}</Text>
    );

    const ItemConfiguracao = ({
        icone,
        titulo,
        descricao,
        onPress,
        valor,
        ultimo = false,
    }: {
        icone: keyof typeof Ionicons.glyphMap;
        titulo: string;
        descricao?: string;
        onPress: () => void;
        valor?: string;
        ultimo?: boolean;
    }) => (
        <TouchableOpacity
            style={[
                styles.itemConfiguracao,
                ultimo && styles.itemUltimo,
            ]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.iconeContainer}>
                <Ionicons
                    name={icone}
                    size={21}
                    color={Colors.primary}
                />
            </View>

            <View style={styles.itemTextoContainer}>
                <Text style={styles.itemTitulo}>{titulo}</Text>

                {descricao && (
                    <Text style={styles.itemDescricao}>
                        {descricao}
                    </Text>
                )}
            </View>

            {valor && (
                <Text style={styles.itemValor}>{valor}</Text>
            )}

            <Ionicons
                name="chevron-forward"
                size={19}
                color={Colors.textSecondary}
            />
        </TouchableOpacity>
    );

    const ItemAlternancia = ({
        icone,
        titulo,
        descricao,
        valor,
        alterar,
        ultimo = false,
    }: {
        icone: keyof typeof Ionicons.glyphMap;
        titulo: string;
        descricao?: string;
        valor: boolean;
        alterar: (valor: boolean) => void;
        ultimo?: boolean;
    }) => (
        <View
            style={[
                styles.itemConfiguracao,
                ultimo && styles.itemUltimo,
            ]}
        >
            <View style={styles.iconeContainer}>
                <Ionicons
                    name={icone}
                    size={21}
                    color={Colors.primary}
                />
            </View>

            <View style={styles.itemTextoContainer}>
                <Text style={styles.itemTitulo}>{titulo}</Text>

                {descricao && (
                    <Text style={styles.itemDescricao}>
                        {descricao}
                    </Text>
                )}
            </View>

            <Switch
                value={valor}
                onValueChange={alterar}
                trackColor={{
                    false: Colors.border,
                    true: Colors.primary,
                }}
                thumbColor={Colors.surface}
            />
        </View>
    );

    function ContaRoute() {
        router.push("../(dadosSecurity)/DadosPessoais")
    }

    // =====================================================
    // INTERFACE
    // =====================================================

    return (
        <View style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* CABEÇALHO */}

                <View style={styles.headerTop}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={23}
                            color={Colors.text}
                        />
                    </TouchableOpacity>

                    <View style={styles.headerTitles}>
                        <Text style={styles.headerTextTitle}>
                            Configurações
                        </Text>

                        <Text style={styles.headerTextSubTitle}>
                            Personalize sua experiência no aplicativo.
                        </Text>
                    </View>

                </View>

                {/* CONTA */}

                <TouchableOpacity style={styles.contaCard} onPress={ContaRoute}>

                    <View style={styles.avatarContainer}>
                        <Ionicons
                            name="person"
                            size={29}
                            color={Colors.primary}
                        />
                    </View>

                    <View style={styles.contaTexto}>
                        <Text style={styles.contaTitulo}>
                            Minha conta
                        </Text>

                        <Text style={styles.contaDescricao}>
                            Gerencie seus dados e sua segurança.
                        </Text>
                    </View>

                    <Ionicons
                        name="settings-outline"
                        size={23}
                        color={Colors.primary}
                    />

                </TouchableOpacity>

                

                {/* PREFERÊNCIAS */}

                <TituloSecao titulo="Preferências do aplicativo" />

                <View style={styles.card}>

                    <ItemConfiguracao
                        icone="color-palette-outline"
                        titulo="Aparência"
                        descricao="Personalize a aparência do aplicativo."
                        valor="Claro"
                        onPress={() => abrirPreferencia('Aparência')}
                    />

                    <ItemAlternancia
                        icone="notifications-outline"
                        titulo="Notificações"
                        descricao="Receba notificações do aplicativo."
                        valor={notificacoes}
                        alterar={setNotificacoes}
                    />

                    <ItemConfiguracao
                        icone="cash-outline"
                        titulo="Moeda"
                        descricao="Moeda utilizada nos valores."
                        valor="Real (R$)"
                        onPress={() => abrirPreferencia('Moeda')}
                    />

                    <ItemConfiguracao
                        icone="calendar-outline"
                        titulo="Primeiro dia da semana"
                        descricao="Defina o início da sua semana."
                        valor="Segunda-feira"
                        onPress={() => abrirPreferencia('Primeiro dia da semana')}
                    />

                    <ItemConfiguracao
                        icone="today-outline"
                        titulo="Formato de data"
                        descricao="Escolha como as datas serão exibidas."
                        valor="DD/MM/AAAA"
                        onPress={() => abrirPreferencia('Formato de data')}
                        ultimo
                    />

                </View>

                {/* VISUALIZAÇÃO */}

                <TituloSecao titulo="Visualização" />

                <View style={styles.card}>

                    <ItemAlternancia
                        icone="eye-outline"
                        titulo="Exibir valores"
                        descricao="Mostra ou oculta os valores financeiros."
                        valor={mostrarValores}
                        alterar={setMostrarValores}
                        ultimo
                    />

                </View>

                {/* ACESSIBILIDADE */}

                <TituloSecao titulo="Acessibilidade" />

                <View style={styles.card}>

                    <ItemAlternancia
                        icone="text-outline"
                        titulo="Aumentar fonte"
                        descricao="Facilita a leitura dos textos."
                        valor={aumentarFonte}
                        alterar={setAumentarFonte}
                    />

                    <ItemAlternancia
                        icone="contrast-outline"
                        titulo="Alto contraste"
                        descricao="Aumenta o contraste dos elementos."
                        valor={altoContraste}
                        alterar={setAltoContraste}
                    />

                    <ItemAlternancia
                        icone="flash-outline"
                        titulo="Reduzir animações"
                        descricao="Reduz os efeitos de movimento."
                        valor={reduzirAnimacoes}
                        alterar={setReduzirAnimacoes}
                        ultimo
                    />

                </View>

                {/* SOBRE O APLICATIVO */}

                <TituloSecao titulo="Sobre" />

                <View style={styles.card}>

                    <ItemConfiguracao
                        icone="information-circle-outline"
                        titulo="Sobre o MyFinances"
                        descricao="Informações sobre o aplicativo."
                        onPress={abrirSobre}
                    />

                    <View style={[styles.itemConfiguracao, styles.itemUltimo]}>
                        <View style={styles.iconeContainer}>
                            <Ionicons
                                name="code-slash-outline"
                                size={21}
                                color={Colors.primary}
                            />
                        </View>

                        <View style={styles.itemTextoContainer}>
                            <Text style={styles.itemTitulo}>
                                Versão do aplicativo
                            </Text>

                            <Text style={styles.itemDescricao}>
                                MyFinances
                            </Text>
                        </View>

                        <Text style={styles.itemValor}>
                            1.0.0
                        </Text>
                    </View>

                </View>

                {/* SAIR DA CONTA */}

                <TouchableOpacity
                    style={styles.botaoSair}
                    onPress={sairDaConta}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={21}
                        color={Colors.error}
                    />

                    <Text style={styles.textoBotaoSair}>
                        Sair da conta
                    </Text>
                </TouchableOpacity>

                <Text style={styles.rodape}>
                    MyFinances
                </Text>

            </ScrollView>

        </View>
    );
}

// =====================================================
// ESTILIZAÇÃO
// =====================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 25
    },

    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 32,
    },

    // CABEÇALHO

    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },

    backButton: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    headerTitles: {
        flex: 1,
    },

    headerTextTitle: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 21,
        color: Colors.text,
    },

    headerTextSubTitle: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 3,
    },

    // CONTA

    contaCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 17,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 27,
    },

    avatarContainer: {
        width: 53,
        height: 53,
        borderRadius: 17,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    contaTexto: {
        flex: 1,
    },

    contaTitulo: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 15,
        color: Colors.text,
    },

    contaDescricao: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 11,
        color: Colors.textSecondary,
        marginTop: 4,
    },

    // SEÇÕES

    tituloSecao: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 15,
        color: Colors.text,
        marginBottom: 11,
        marginLeft: 3,
    },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 15,
        marginBottom: 25,
    },

    // ITENS

    itemConfiguracao: {
        minHeight: 76,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingVertical: 12,
    },

    itemUltimo: {
        borderBottomWidth: 0,
    },

    iconeContainer: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    itemTextoContainer: {
        flex: 1,
        marginRight: 8,
    },

    itemTitulo: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 12,
        color: Colors.text,
    },

    itemDescricao: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 10,
        color: Colors.textSecondary,
        marginTop: 4,
        lineHeight: 15,
    },

    itemValor: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 10,
        color: Colors.textSecondary,
        marginRight: 7,
    },

    // SAIR

    botaoSair: {
        height: 54,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.error,
        backgroundColor: Colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3,
    },

    textoBotaoSair: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 13,
        color: Colors.error,
        marginLeft: 9,
    },

    rodape: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 10,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },

});