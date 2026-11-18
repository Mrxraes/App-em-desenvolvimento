import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.15.6:8080/api";

type DadosPessoaisResponse = {
    nome: string;
    sobrenome: string;
    email: string;
    dataNascimento: string;
    salario: string | number;
};

type RespostaAPI = {
    sucesso: boolean;
    mensagem: string;
};

type CampoPessoal = {
    chave: string;
    titulo: string;
    valor: string;
    tipo: "texto" | "email" | "data" | "salario";
    protegido: boolean;
};

export default function DadosPessoais() {

    //////////////////
    // ESTADOS
    //////////////////

    const [token, setToken] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const [dados, setDados] = useState<DadosPessoaisResponse>({
        nome: "",
        sobrenome: "",
        email: "",
        dataNascimento: "",
        salario: "",
    });

    //////////////////
    // ESTADOS DE EDIÇÃO
    //////////////////

    const [modalEdicao, setModalEdicao] = useState(false);
    const [modalConfirmacao, setModalConfirmacao] = useState(false);
    const [modalCodigo, setModalCodigo] = useState(false);

    const [campoSelecionado, setCampoSelecionado] = useState<CampoPessoal | null>(null);
    const [novoValor, setNovoValor] = useState("");
    const [codigo, setCodigo] = useState("");

    const [processando, setProcessando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    // ALTERAÇÃO DE SENHA

    const [modalSenha, setModalSenha] = useState(false);
    const [modalCodigoSenha, setModalCodigoSenha] = useState(false);

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [codigoSenha, setCodigoSenha] = useState("");

    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    //////////////////
    // REQUISIÇÕES
    //////////////////

        const requisicaoPost = useCallback(async <T,>(
            endpoint: string,
            corpo: object
        ): Promise<T> => {

        if (!token) {
            throw new Error("Token de autenticação não encontrado.");
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                ...corpo,
            }),
        });

        const resultado = await response.json();

        console.log(JSON.stringify(resultado) + " Resultado")

        if (!response.ok) {
            throw new Error(resultado.mensagem || "Erro ao realizar requisição.");
        }

        return resultado as T;

    }, [token]);

    // SENHA

    const solicitarAlteracaoSenha = async () => {

        setMensagem("");

        if (!senhaAtual.trim()) {
            setMensagem("Informe sua senha atual.");
            return;
        }

        if (senhaAtual === novaSenha) {
            setMensagem("A nova senha deve ser diferente da atual.");
            return;
        }

        try {

            setProcessando(true);

            const resposta = await requisicaoPost<RespostaAPI>(
                "/solicitarAlteracaoSenha",
                {
                    senhaAtual,
                    novaSenha,
                    confirmarSenha
                }
            );

            if (!resposta.sucesso) {
                throw new Error(resposta.mensagem);
            }

            setMensagem("");
            setCodigoSenha("");

            setModalSenha(false);
            setModalCodigoSenha(true);

        } catch (error) {

            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Não foi possível solicitar a alteração."
            );

        } finally {

            setProcessando(false);

        }
    };

    // CONFIRMAR ALTERACAO

    const confirmarAlteracaoSenha = async () => {

    setMensagem("");

    if (codigoSenha.length !== 6) {
        setMensagem("Informe o código de seis dígitos.");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        setMensagem("As senhas não coincidem.");
        return;
    }

    try {

        setProcessando(true);

        const resposta = await requisicaoPost<RespostaAPI>(
            "/confirmarAlteracaoSenha",
            {
                token,
                codigo: codigoSenha,
                novaSenha,
                confirmarSenha
            }
        );

        if (!resposta.sucesso) {
            throw new Error(resposta.mensagem);
        }

        setModalCodigoSenha(false);

        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
        setCodigoSenha("");

        setMensagem(resposta.mensagem);

    } catch (error) {

        setMensagem(
            error instanceof Error
                ? error.message
                : "Não foi possível alterar sua senha."
        );

    } finally {

        setProcessando(false);

    }
};

    //////////////////
    // CARREGAR DADOS
    //////////////////

    const carregarDadosPessoais = useCallback(async () => {

        if (!token) return;

        try {

            setCarregando(true);
            setErro("");

            const resposta = await requisicaoPost<DadosPessoaisResponse>(
                "/dadosPessoais",
                {}
            );

            setDados({
                nome: resposta.nome ?? "",
                sobrenome: resposta.sobrenome ?? "",
                email: resposta.email ?? "",
                dataNascimento: resposta.dataNascimento ?? "",
                salario: String(resposta.salario ?? ""),
            });

        } catch (error) {

            setErro(
                error instanceof Error
                    ? error.message
                    : "Não foi possível carregar seus dados."
            );

        } finally {
            setCarregando(false);
        }

    }, [token, requisicaoPost]);

    //////////////////
    // CARREGAR TOKEN
    //////////////////

    useFocusEffect(
        useCallback(() => {

            let ativo = true;

            const inicializar = async () => {

                const tokenSalvo = await SecureStore.getItemAsync("tokenLogin");

                if (!ativo) return;

                if (!tokenSalvo) {
                    setErro("Sua sessão não foi encontrada.");
                    return;
                }

                setToken(tokenSalvo);

            };

            inicializar();

            return () => {
                ativo = false;
            };

        }, [])
    );

    useFocusEffect(
        useCallback(() => {

            if (token) {
                carregarDadosPessoais();
            }

        }, [token, carregarDadosPessoais])
    );

    //////////////////
    // CAMPOS
    //////////////////

    const campos: CampoPessoal[] = [
        {
            chave: "nome",
            titulo: "Nome",
            valor: dados.nome,
            tipo: "texto",
            protegido: true,
        },
        {
            chave: "sobrenome",
            titulo: "Sobrenome",
            valor: dados.sobrenome,
            tipo: "texto",
            protegido: true,
        },
        {
            chave: "email",
            titulo: "E-mail",
            valor: dados.email,
            tipo: "email",
            protegido: true,
        },
        {
            chave: "dataNascimento",
            titulo: "Data de nascimento",
            valor: dados.dataNascimento,
            tipo: "data",
            protegido: true,
        },
        {
            chave: "salario",
            titulo: "Salário mensal",
            valor: String(dados.salario),
            tipo: "salario",
            protegido: false,
        },
    ];

    //////////////////
    // ABRIR EDIÇÃO
    //////////////////

    const abrirEdicao = (campo: CampoPessoal) => {

        setCampoSelecionado(campo);
        setNovoValor(campo.valor);
        setMensagem("");
        setModalEdicao(true);

    };

    //////////////////
    // VALIDAR VALOR
    //////////////////

    const validarNovoValor = (): boolean => {

        if (!novoValor.trim()) {
            setMensagem("Preencha o novo valor.");
            return false;
        }

        if (campoSelecionado?.tipo === "email") {

            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoValor.trim());

            if (!emailValido) {
                setMensagem("Informe um endereço de e-mail válido.");
                return false;
            }

        }

        if (campoSelecionado?.tipo === "data") {

            if (!/^\d{4}-\d{2}-\d{2}$/.test(novoValor.trim())) {
                setMensagem("Informe a data no formato AAAA-MM-DD.");
                return false;
            }

            const data = new Date(`${novoValor}T00:00:00`);

            if (
                Number.isNaN(data.getTime()) ||
                data.toISOString().slice(0, 10) !== novoValor
            ) {
                setMensagem("Informe uma data válida.");
                return false;
            }

        }

        if (campoSelecionado?.tipo === "salario") {

            const salario = Number(novoValor.replace(",", "."));

            if (!Number.isFinite(salario) || salario < 0) {
                setMensagem("Informe um salário válido.");
                return false;
            }

        }

        if (novoValor.trim() === campoSelecionado?.valor) {
            setMensagem("O novo valor é igual ao valor atual.");
            return false;
        }

        return true;

    };

    //////////////////
    // CONFIRMAR EDIÇÃO
    //////////////////

    const solicitarConfirmacao = () => {

        setMensagem("");

        if (!validarNovoValor()) return;

        setModalEdicao(false);
        setModalConfirmacao(true);

    };

    //////////////////
    // ENVIAR CÓDIGO
    //////////////////

    const enviarCodigoAlteracao = async () => {

        try {

            setProcessando(true);
            setMensagem("");

            const resposta = await requisicaoPost<RespostaAPI>(
                "/enviarCodigoAlteracao",
                {
                    campo: campoSelecionado?.chave,
                }
            );

            if (!resposta.sucesso) {
                throw new Error(resposta.mensagem);
            }

            setModalConfirmacao(false);
            setCodigo("");
            setModalCodigo(true);

        } catch (error) {

            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Não foi possível enviar o código."
            );

        } finally {
            setProcessando(false);
        }

    };

    //////////////////
    // ATUALIZAR DADO
    //////////////////

    const atualizarDado = async (codigoValidado?: string) => {

        if (!campoSelecionado) return;

        try {

            setProcessando(true);
            setMensagem("");

            const resposta = await requisicaoPost<RespostaAPI>(
                "/atualizarDados",
                {
                    campo: campoSelecionado.chave,
                    novoValor: novoValor.trim(),
                    codigo: codigoValidado ?? null,
                }
            );

            if (!resposta.sucesso) {
                throw new Error(resposta.mensagem);
            }

            setModalConfirmacao(false);
            setModalCodigo(false);
            setModalEdicao(false);

            setMensagem(resposta.mensagem || "Dados atualizados com sucesso.");

            await carregarDadosPessoais();

            setCampoSelecionado(null);
            setNovoValor("");
            setCodigo("");

        } catch (error) {

            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Não foi possível atualizar os dados."
            );

        } finally {
            setProcessando(false);
        }

    };

    //////////////////
    // VALIDAR CÓDIGO
    //////////////////

    const validarCodigoAlteracao = async () => {

        if (codigo.length !== 6) {
            setMensagem("Informe o código de seis dígitos.");
            return;
        }

        try {

            setProcessando(true);
            setMensagem("");

            const resposta = await requisicaoPost<RespostaAPI>(
                "/validarCodigoAlteracao",
                {
                    codigo,
                    campo: campoSelecionado?.chave,
                }
            );

            if (!resposta.sucesso) {
                throw new Error(resposta.mensagem);
            }

            await atualizarDado(codigo);

        } catch (error) {

            setMensagem(
                error instanceof Error
                    ? error.message
                    : "Código inválido ou expirado."
            );

        } finally {
            setProcessando(false);
        }

    };

    //////////////////
    // CONFIRMAÇÃO FINAL
    //////////////////

    const confirmarAlteracao = async () => {

        if (!campoSelecionado) return;

        if (campoSelecionado.protegido) {

            await enviarCodigoAlteracao();

        } else {

            await atualizarDado();

        }

    };

    //////////////////
    // COMPONENTE DE CAMPO
    //////////////////

    const renderCampo = (campo: CampoPessoal) => (

        <View key={campo.chave} style={styles.cardCampo}>

            <View style={styles.campoInformacoes}>

                <Text style={styles.campoTitulo}>
                    {campo.titulo}
                </Text>

                <Text style={styles.campoValor}>
                    {campo.valor || "Não informado"}
                </Text>

                {campo.protegido && (
                    <View style={styles.protecaoContainer}>
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={13}
                            color={Colors.textSecondary}
                        />
                        <Text style={styles.protecaoTexto}>
                            Verificação de segurança necessária
                        </Text>
                    </View>
                )}

            </View>

            <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => abrirEdicao(campo)}
            >
                <Ionicons
                    name="create-outline"
                    size={19}
                    color={Colors.primary}
                />
            </TouchableOpacity>

        </View>

    );

    //////////////////
    // RENDERIZAÇÃO
    //////////////////

    return (

        <View style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.headerTop}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={21}
                            color={Colors.text}
                        />
                    </TouchableOpacity>

                    <View style={styles.headerTitles}>
                        <Text style={styles.headerTextTitle}>
                            Dados pessoais
                        </Text>

                        <Text style={styles.headerTextSubTitle}>
                            Gerencie as informações da sua conta.
                        </Text>
                    </View>

                </View>

                <View style={styles.infoContainer}>

                    <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color={Colors.primary}
                    />

                    <Text style={styles.infoTexto}>
                        Para proteger sua conta, alterações em informações
                        importantes exigem uma confirmação enviada ao seu
                        e-mail cadastrado.
                    </Text>

                </View>

                <Text style={styles.sectionTitle}>
                    Informações da conta
                </Text>

                {carregando ? (

                    <ActivityIndicator
                        size="large"
                        color={Colors.primary}
                        style={{ marginTop: 30 }}
                    />

                ) : (

                    campos.map(renderCampo)

                )}

                {!!erro && (
                    <Text style={styles.erroTexto}>
                        {erro}
                    </Text>
                )}

                <Text style={styles.sectionTitle}>
                    Segurança
                </Text>

                <TouchableOpacity
                    style={styles.cardCampo}
                    onPress={() => {
                        setMensagem("");
                        setSenhaAtual("");
                        setNovaSenha("");
                        setConfirmarSenha("");
                        setModalSenha(true);
                    }}
                >

                    <View style={styles.campoInformacoes}>
                        <Text style={styles.campoTitulo}>
                            Senha
                        </Text>

                        <Text style={styles.campoValor}>
                            ••••••••••••
                        </Text>

                        <Text style={styles.protecaoTexto}>
                            Altere sua senha de acesso.
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={Colors.textSecondary}
                    />

                </TouchableOpacity>

            </ScrollView>

            {/* MODAL DE EDIÇÃO */}

            <Modal
                visible={modalEdicao}
                transparent
                animationType="fade"
                onRequestClose={() => setModalEdicao(false)}
            >

                <View style={styles.modalFundo}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >

                        <View style={styles.modalContainer}>

                            <View style={styles.modalHeader}>

                                <Text style={styles.modalTitulo}>
                                    Editar {campoSelecionado?.titulo}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setModalEdicao(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={23}
                                        color={Colors.textSecondary}
                                    />
                                </TouchableOpacity>

                            </View>

                            <Text style={styles.labelInput}>
                                Valor atual
                            </Text>

                            <View style={styles.valorAtual}>
                                <Text style={styles.valorAtualTexto}>
                                    {campoSelecionado?.valor || "Não informado"}
                                </Text>
                            </View>

                            <Text style={styles.labelInput}>
                                Novo valor
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={novoValor}
                                onChangeText={setNovoValor}
                                placeholder="Digite o novo valor"
                                placeholderTextColor={Colors.textSecondary}
                                keyboardType={
                                    campoSelecionado?.tipo === "salario"
                                        ? "decimal-pad"
                                        : "default"
                                }
                                autoCapitalize={
                                    campoSelecionado?.tipo === "email"
                                        ? "none"
                                        : "sentences"
                                }
                            />

                            {!!mensagem && (
                                <Text style={styles.erroTexto}>
                                    {mensagem}
                                </Text>
                            )}

                            <TouchableOpacity
                                style={styles.botaoPrincipal}
                                onPress={solicitarConfirmacao}
                            >
                                <Text style={styles.botaoPrincipalTexto}>
                                    Continuar
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </KeyboardAvoidingView>

                </View>

            </Modal>

            {/* MODAL DE CONFIRMAÇÃO */}

            <Modal
                visible={modalConfirmacao}
                transparent
                animationType="fade"
                onRequestClose={() => setModalConfirmacao(false)}
            >

                <View style={styles.modalFundo}>

                    <View style={styles.modalContainer}>

                        <View style={styles.iconeModal}>
                            <Ionicons
                                name="help"
                                size={27}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.modalTitulo}>
                            Confirmar alteração?
                        </Text>

                        <Text style={styles.modalSubtitulo}>
                            Você realmente deseja modificar esta informação?
                        </Text>

                        <Text style={styles.labelInput}>
                            Valor atual
                        </Text>

                        <View style={styles.valorAtual}>
                            <Text style={styles.valorAtualTexto}>
                                {campoSelecionado?.valor}
                            </Text>
                        </View>

                        <Text style={styles.labelInput}>
                            Novo valor
                        </Text>

                        <View style={styles.valorAtual}>
                            <Text style={styles.valorNovoTexto}>
                                {novoValor}
                            </Text>
                        </View>

                        {campoSelecionado?.protegido && (
                            <Text style={styles.avisoSeguranca}>
                                Será enviado um código de confirmação ao seu
                                e-mail atual.
                            </Text>
                        )}

                        {!!mensagem && (
                            <Text style={styles.erroTexto}>
                                {mensagem}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={styles.botaoPrincipal}
                            onPress={confirmarAlteracao}
                            disabled={processando}
                        >
                            {processando ? (
                                <ActivityIndicator color={Colors.surface} />
                            ) : (
                                <Text style={styles.botaoPrincipalTexto}>
                                    Confirmar alteração
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => setModalConfirmacao(false)}
                        >
                            <Text style={styles.botaoCancelarTexto}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>

            {/* MODAL DO CÓDIGO */}

            <Modal
                visible={modalCodigo}
                transparent
                animationType="fade"
                onRequestClose={() => setModalCodigo(false)}
            >

                <View style={styles.modalFundo}>

                    <View style={styles.modalContainer}>

                        <View style={styles.iconeModal}>
                            <Ionicons
                                name="mail-outline"
                                size={27}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.modalTitulo}>
                            Verificação de identidade
                        </Text>

                        <Text style={styles.modalSubtitulo}>
                            Enviamos um código de seis dígitos ao e-mail
                            atualmente cadastrado na sua conta.
                        </Text>

                        <TextInput
                            style={styles.inputCodigo}
                            value={codigo}
                            onChangeText={(valor) =>
                                setCodigo(valor.replace(/\D/g, "").slice(0, 6))
                            }
                            keyboardType="number-pad"
                            maxLength={6}
                            placeholder="000000"
                            placeholderTextColor={Colors.textSecondary}
                            textAlign="center"
                        />

                        {!!mensagem && (
                            <Text style={styles.erroTexto}>
                                {mensagem}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={styles.botaoPrincipal}
                            onPress={validarCodigoAlteracao}
                            disabled={processando}
                        >
                            {processando ? (
                                <ActivityIndicator color={Colors.surface} />
                            ) : (
                                <Text style={styles.botaoPrincipalTexto}>
                                    Validar código
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => setModalCodigo(false)}
                        >
                            <Text style={styles.botaoCancelarTexto}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>

            {/* MODAL DE ALTERAÇÃO DE SENHA */}

            <Modal
                visible={modalSenha}
                transparent
                animationType="fade"
                onRequestClose={() => setModalSenha(false)}
            >
                <View style={styles.modalFundo}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >

                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >

                            <View style={styles.modalContainer}>

                                <View style={styles.modalHeader}>

                                    <Text style={styles.modalTitulo}>
                                        Alterar senha
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => setModalSenha(false)}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={23}
                                            color={Colors.textSecondary}
                                        />
                                    </TouchableOpacity>

                                </View>

                                <Text style={styles.labelInput}>
                                    Senha atual
                                </Text>

                                <View style={styles.senhaInputContainer}>

                                    <TextInput
                                        style={styles.senhaInput}
                                        value={senhaAtual}
                                        onChangeText={setSenhaAtual}
                                        placeholder="Digite sua senha atual"
                                        placeholderTextColor={Colors.textSecondary}
                                        secureTextEntry={!mostrarSenhaAtual}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                                    >
                                        <Ionicons
                                            name={mostrarSenhaAtual ? "eye-off-outline" : "eye-outline"}
                                            size={21}
                                            color={Colors.textSecondary}
                                        />
                                    </TouchableOpacity>

                                </View>

                                <TouchableOpacity
                                    style={styles.esqueceuSenha}
                                    onPress={() => {
                                        setModalSenha(false);

                                        // Substitua pela rota da recuperação
                                        // de senha que você já utiliza no login.
                                        router.push({
                                            pathname: '/(auth)/solicitarRedefinicao',
                                          
                                        });
                                    }}
                                >
                                    <Text style={styles.esqueceuSenhaTexto}>
                                        Esqueceu sua senha?
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.labelInput}>
                                    Nova senha
                                </Text>

                                <View style={styles.senhaInputContainer}>

                                    <TextInput
                                        style={styles.senhaInput}
                                        value={novaSenha}
                                        onChangeText={setNovaSenha}
                                        placeholder="Digite sua nova senha"
                                        placeholderTextColor={Colors.textSecondary}
                                        secureTextEntry={!mostrarNovaSenha}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                                    >
                                        <Ionicons
                                            name={mostrarNovaSenha ? "eye-off-outline" : "eye-outline"}
                                            size={21}
                                            color={Colors.textSecondary}
                                        />
                                    </TouchableOpacity>

                                </View>

                                <Text style={styles.labelInput}>
                                    Confirmar nova senha
                                </Text>

                                <View style={styles.senhaInputContainer}>

                                    <TextInput
                                        style={styles.senhaInput}
                                        value={confirmarSenha}
                                        onChangeText={setConfirmarSenha}
                                        placeholder="Repita sua nova senha"
                                        placeholderTextColor={Colors.textSecondary}
                                        secureTextEntry={!mostrarConfirmarSenha}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                    >
                                        <Ionicons
                                            name={mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"}
                                            size={21}
                                            color={Colors.textSecondary}
                                        />
                                    </TouchableOpacity>

                                </View>

                                {!!mensagem && (
                                    <Text style={styles.erroTexto}>
                                        {mensagem}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    style={styles.botaoPrincipal}
                                    onPress={solicitarAlteracaoSenha}
                                    disabled={processando}
                                >

                                    {processando ? (
                                        <ActivityIndicator color={Colors.surface} />
                                    ) : (
                                        <Text style={styles.botaoPrincipalTexto}>
                                            Continuar
                                        </Text>
                                    )}

                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.botaoCancelar}
                                    onPress={() => setModalSenha(false)}
                                >
                                    <Text style={styles.botaoCancelarTexto}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </ScrollView>

                    </KeyboardAvoidingView>

                </View>
            </Modal>

            {/* MODAL DO CÓDIGO DE ALTERAÇÃO DE SENHA */}

            <Modal
                visible={modalCodigoSenha}
                transparent
                animationType="fade"
                onRequestClose={() => setModalCodigoSenha(false)}
            >
                <View style={styles.modalFundo}>

                    <View style={styles.modalContainer}>

                        <View style={styles.iconeModal}>
                            <Ionicons
                                name="mail-outline"
                                size={27}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.modalTitulo}>
                            Confirmar nova senha
                        </Text>

                        <Text style={styles.modalSubtitulo}>
                            Enviamos um código de confirmação ao e-mail cadastrado.
                            Digite os seis números para concluir a alteração.
                        </Text>

                        <TextInput
                            style={styles.inputCodigo}
                            value={codigoSenha}
                            onChangeText={(valor) =>
                                setCodigoSenha(valor.replace(/\D/g, "").slice(0, 6))
                            }
                            keyboardType="number-pad"
                            maxLength={6}
                            placeholder="000000"
                            placeholderTextColor={Colors.textSecondary}
                            textAlign="center"
                        />

                        {!!mensagem && (
                            <Text style={styles.erroTexto}>
                                {mensagem}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={styles.botaoPrincipal}
                            onPress={confirmarAlteracaoSenha}
                            disabled={processando}
                        >

                            {processando ? (
                                <ActivityIndicator color={Colors.surface} />
                            ) : (
                                <Text style={styles.botaoPrincipalTexto}>
                                    Confirmar alteração
                                </Text>
                            )}

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoCancelar}
                            onPress={() => setModalCodigoSenha(false)}
                        >
                            <Text style={styles.botaoCancelarTexto}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 25
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 32,
    },

    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 12,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    headerTitles: {
        flex: 1,
    },

    headerTextTitle: {
        fontFamily: "PlusJakartaBold",
        color: Colors.text,
        fontSize: 24,
        letterSpacing: -0.5,
    },

    headerTextSubTitle: {
        fontFamily: "PlusJakartaMedium",
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 3,
    },

    infoContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        padding: 15,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 25,
    },

    infoTexto: {
        flex: 1,
        color: Colors.textSecondary,
        fontFamily: "PlusJakartaMedium",
        fontSize: 12,
        lineHeight: 19,
    },

    sectionTitle: {
        fontFamily: "PlusJakartaBold",
        color: Colors.text,
        fontSize: 16,
        marginBottom: 12,
        marginTop: 8,
    },

    cardCampo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 18,
        padding: 17,
        marginBottom: 11,
    },

    campoInformacoes: {
        flex: 1,
    },

    campoTitulo: {
        fontFamily: "PlusJakartaMedium",
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 5,
    },

    campoValor: {
        fontFamily: "PlusJakartaBold",
        color: Colors.text,
        fontSize: 15,
    },

    protecaoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
    },

    protecaoTexto: {
        fontFamily: "PlusJakartaMedium",
        color: Colors.textSecondary,
        fontSize: 10,
        marginTop: 5,
    },

    botaoEditar: {
        width: 39,
        height: 39,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        marginLeft: 10,
    },

    modalFundo: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        justifyContent: "center",
        paddingHorizontal: 22,
    },

    modalContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 23,
        padding: 22,
        borderWidth: 1,
        borderColor: Colors.border,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
    },

    modalTitulo: {
        fontFamily: "PlusJakartaBold",
        fontSize: 19,
        color: Colors.text,
        textAlign: "center",
        marginBottom: 8,
    },

    modalSubtitulo: {
        fontFamily: "PlusJakartaMedium",
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: "center",
        lineHeight: 19,
        marginBottom: 20,
    },

    labelInput: {
        fontFamily: "PlusJakartaBold",
        fontSize: 12,
        color: Colors.text,
        marginBottom: 8,
        marginTop: 12,
    },

    valorAtual: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 13,
        padding: 14,
    },

    valorAtualTexto: {
        color: Colors.textSecondary,
        fontFamily: "PlusJakartaMedium",
        fontSize: 13,
    },

    valorNovoTexto: {
        color: Colors.primary,
        fontFamily: "PlusJakartaBold",
        fontSize: 13,
    },

    input: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 13,
        paddingHorizontal: 14,
        paddingVertical: 13,
        color: Colors.text,
        fontFamily: "PlusJakartaMedium",
        fontSize: 14,
    },

    inputCodigo: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        padding: 15,
        fontFamily: "PlusJakartaBold",
        fontSize: 25,
        letterSpacing: 9,
        color: Colors.text,
    },

    iconeModal: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 17,
    },

    avisoSeguranca: {
        color: Colors.textSecondary,
        fontFamily: "PlusJakartaMedium",
        fontSize: 11,
        lineHeight: 17,
        marginTop: 15,
        textAlign: "center",
    },

    botaoPrincipal: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        minHeight: 49,
    },

    botaoPrincipalTexto: {
        color: Colors.surface,
        fontFamily: "PlusJakartaBold",
        fontSize: 13,
    },

    botaoCancelar: {
        alignItems: "center",
        paddingVertical: 13,
        marginTop: 5,
    },

    botaoCancelarTexto: {
        color: Colors.textSecondary,
        fontFamily: "PlusJakartaBold",
        fontSize: 13,
    },

    erroTexto: {
        color: Colors.error,
        fontFamily: "PlusJakartaMedium",
        fontSize: 12,
        marginTop: 10,
        textAlign: "center",
    },

    senhaInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
},

senhaInput: {
    flex: 1,
    paddingVertical: 13,
    color: Colors.text,
    fontFamily: "PlusJakartaMedium",
    fontSize: 14,
},

esqueceuSenha: {
    alignSelf: "flex-end",
    marginTop: 9,
    marginBottom: 5,
},

esqueceuSenhaTexto: {
    color: Colors.primary,
    fontFamily: "PlusJakartaBold",
    fontSize: 11,
},

});