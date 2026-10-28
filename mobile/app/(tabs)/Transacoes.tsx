import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";

const API_URL = "http://192.168.15.6:8080/api";

const CORES = {
    primary: "#2563EB",
    primaryDark: "#1E3A8A",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    success: "#16A34A",
    error: "#DC2626",
};

type Movimentacao = {
    id: number;
    nome: string;
    dataRegistro: string;
    valor: string;
    tipo: string;
    tabela: string;
    obs: string | null;
};

type TipoPopup = "visualizar" | "editar" | "excluir";

type RespostaOperacao = {
    sucesso: boolean;
    mensagem: string;
};

const TIPOS_ENTRADA = [
    { label: "Salário", value: "SALARIO" },
    { label: "Extra", value: "EXTRA" },
    { label: "Rendimentos", value: "RENDIMENTOS" },
];

const TIPOS_SAIDA = [
    { label: "Fixa", value: "FIXA" },
    { label: "Variável", value: "VARIAVEL" },
    { label: "Investimentos", value: "INVESTIMENTOS" },
];

function converterData(data: string): Date {
    /*
     * Mantemos o horário local.
     * Não acrescentamos Z ao final, pois isso poderia
     * interpretar a data como UTC e alterar o horário.
     */
    const resultado = new Date(data);

    if (Number.isNaN(resultado.getTime())) {
        return new Date();
    }

    return resultado;
}

function formatarData(data: string): string {
    const dataConvertida = converterData(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data não definida";
    }

    const hoje = new Date();

    // Compara somente ano, mês e dia, ignorando o horário.
    const inicioHoje = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );

    const inicioDataMovimentacao = new Date(
        dataConvertida.getFullYear(),
        dataConvertida.getMonth(),
        dataConvertida.getDate()
    );

    const diferencaEmDias = Math.round(
        (inicioHoje.getTime() - inicioDataMovimentacao.getTime()) /
            (24 * 60 * 60 * 1000)
    );

    if (diferencaEmDias === 0) {
        return "Hoje";
    }

    if (diferencaEmDias === 1) {
        return "Ontem";
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}

function formatarHorario(data: string): string {
    const dataConvertida = converterData(data);

    return dataConvertida.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatarDataHora(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");
    const segundo = String(data.getSeconds()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
}

function formatarMes(data: Date): string {
    const mes = data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    return mes.charAt(0).toUpperCase() + mes.slice(1);
}

function formatarMoeda(valor: string | number): string {
    const numero = Number(valor);

    return (Number.isFinite(numero) ? numero : 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        }
    );
}

function converterValor(valor: string): number {
    const normalizado = valor
        .trim()
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return Number(normalizado);
}

function normalizarTabela(tabela: string): string {
    return tabela.trim().toLowerCase();
}

function obterNomeTipo(tipo: string): string {
    const nomes: Record<string, string> = {
        SALARIO: "Salário",
        EXTRA: "Extra",
        RENDIMENTO: "Rendimentos",
        RENDIMENTOS: "Rendimentos",
        FIXO: "Fixa",
        FIXA: "Fixa",
        VARIAVEL: "Variável",
        INVESTIMENTO: "Investimentos",
        INVESTIMENTOS: "Investimentos",
    };

    return nomes[tipo.toUpperCase()] ?? tipo;
}

export default function Transacoes() {
    const { token: tokenParametro, modoGerenciamento: modoGerenciamentoParametro} =
        useLocalSearchParams<{ token?: string, modoGerenciamento?: string }>();

    const [token, setToken] = useState<string | null>(null);

    const [movimentacoes, setMovimentacoes] =
        useState<Movimentacao[]>([]);

    const [dataSelecionada, setDataSelecionada] =
        useState(new Date());

    const [filtro, setFiltro] =
        useState<"TODAS" | "ENTRADAS" | "SAIDAS">("TODAS");

    
    const [modoGerenciamento, setModoGerenciamento] = useState(false);


    function setarModoGerenciamento() {
    console.log(modoGerenciamentoParametro + " True ou false")

           if (modoGerenciamentoParametro === "true") {
                setModoGerenciamento(true)
            }
    }


    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // Controle de abertura e fechamento do pop-up.
    const [popupVisivel, setPopupVisivel] = useState(false);
    const [popupVisivelMsg, setPopupVisivelMsg] = useState(false);
    const [popupSucesso, setPopupSucesso] = useState(false);
    const [popupTitulo, setPopupTitulo] = useState('');
    const [popupSubtitulo, setPopupSubtitulo] = useState('');

    const exibirPopup = (
        sucesso: boolean,
        titulo: string,
        subtitulo: string
    ) => {
        setPopupSucesso(sucesso);
        setPopupTitulo(titulo);
        setPopupSubtitulo(subtitulo);
        setPopupVisivelMsg(true);
    };

    // Define o conteúdo que será apresentado dentro do pop-up.
    const [tipoPopup, setTipoPopup] =
        useState<TipoPopup>("visualizar");

    const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
        useState<Movimentacao | null>(null);

    // Campos editáveis: os dados originais permanecem intactos
    // em movimentacaoSelecionada.
    const [novoNome, setNovoNome] = useState("");
    const [novoValor, setNovoValor] = useState("");
    const [novoTipo, setNovoTipo] = useState("");
    const [novaObservacao, setNovaObservacao] = useState("");

    const [novaData, setNovaData] = useState(new Date());
    const [mostrarSeletorData, setMostrarSeletorData] = useState(false);
    const [mostrarSeletorHora, setMostrarSeletorHora] = useState(false);

    // Recupera o token da rota ou do SecureStore.
    useEffect(() => {
        async function carregarToken() {
            if (tokenParametro) {
                setToken(String(tokenParametro));
                return;
            }

            try {
                const tokenSalvo =
                    await SecureStore.getItemAsync("tokenLogin");

                setToken(tokenSalvo);
            } catch (erro) {
                console.error("Erro ao recuperar token:", erro);
                setToken(null);
            }
        }

        carregarToken();

        setarModoGerenciamento()
    }, [tokenParametro]);

    const buscarMovimentacoes = useCallback(async () => {
        if (!token) {
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch(
                `${API_URL}/allMovimentacoes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        data: formatarDataHora(dataSelecionada),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Não foi possível consultar as movimentações (${response.status}).`
                );
            }

            const dados: Movimentacao[] = await response.json();

            const dadosTratados = dados.map((movimento) => ({
                id: Number(movimento.id),
                nome: movimento.nome ?? "Sem nome",
                dataRegistro: movimento.dataRegistro ?? "",
                valor: String(movimento.valor ?? "0"),
                tipo: movimento.tipo ?? "",
                tabela: normalizarTabela(movimento.tabela ?? ""),
                obs: movimento.obs ?? null,
            }));

            dadosTratados.sort(
                (a, b) =>
                    converterData(b.dataRegistro).getTime() -
                    converterData(a.dataRegistro).getTime()
            );

            setMovimentacoes(dadosTratados);
        } catch (erro) {
            console.error("Erro ao carregar movimentações:", erro);

        exibirPopup(
            false,
            'Ops! Algo deu errado',
            'Não foi possível carregar as movimentações. Tente novamente.'
        );

        } finally {
            setCarregando(false);
        }
    }, [token, dataSelecionada]);

    useEffect(() => {
        buscarMovimentacoes();

        setarModoGerenciamento()

    }, [buscarMovimentacoes, modoGerenciamentoParametro]);

    // Filtros.
    const movimentacoesFiltradas = useMemo(() => {
        if (filtro === "ENTRADAS") {
            return movimentacoes.filter(
                (movimento) => movimento.tabela === "entrada"
            );
        }

        if (filtro === "SAIDAS") {
            return movimentacoes.filter(
                (movimento) => movimento.tabela === "saida"
            );
        }

        return movimentacoes;
    }, [movimentacoes, filtro]);

    const totalEntradas = useMemo(() => {
        return movimentacoes
            .filter((movimento) => movimento.tabela === "entrada")
            .reduce(
                (total, movimento) =>
                    total + (Number(movimento.valor) || 0),
                0
            );
    }, [movimentacoes]);

    const totalSaidas = useMemo(() => {
        return movimentacoes
            .filter((movimento) => movimento.tabela === "saida")
            .reduce(
                (total, movimento) =>
                    total + (Number(movimento.valor) || 0),
                0
            );
    }, [movimentacoes]);

    const saldo = totalEntradas - totalSaidas;

    function mudarMes(diferenca: number) {
        setDataSelecionada((dataAtual) => {
            const nova = new Date(dataAtual);

            nova.setDate(1);
            nova.setMonth(nova.getMonth() + diferenca);

            return nova;
        });
    }

    function abrirVisualizacao(movimento: Movimentacao) {
        setMovimentacaoSelecionada(movimento);
        setTipoPopup("visualizar");
        setPopupVisivel(true);
    }

    function abrirEdicao(movimento: Movimentacao) {
        setMovimentacaoSelecionada(movimento);

        setNovoNome(movimento.nome);
        setNovoValor(String(movimento.valor).replace(".", ","));
        setNovoTipo(movimento.tipo);
        setNovaObservacao(movimento.obs ?? "");

        setNovaData(converterData(movimento.dataRegistro));

        setMostrarSeletorData(false);
        setMostrarSeletorHora(false);

        setTipoPopup("editar");
        setPopupVisivel(true);
    }

    function abrirExclusao(movimento: Movimentacao) {
        setMovimentacaoSelecionada(movimento);
        setTipoPopup("excluir");
        setPopupVisivel(true);
    }

    function fecharPopup() {
        if (salvando) {
            return;
        }

        setPopupVisivel(false);
        setMostrarSeletorData(false);
        setMostrarSeletorHora(false);
    }

    function validarEdicao(): boolean {
        if (!movimentacaoSelecionada) {
            return false;
        }

        if (!novoNome.trim()) {
            exibirPopup(
                false,
                'Campo obrigatório.',
                "Informe o nome da movimentação."
            );

            return false;
        }

        const valorNumerico = converterValor(novoValor);

        if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
            exibirPopup(
                false,
                'Valor inválido',
                "Informe um valor numérico maior que zero."
            );
            return false;
        }

        if (!novoTipo.trim()) {
             exibirPopup(
                false,
                'Campo obrigatório',
                "Selecione uma categoria para a movimentação."
            );
            return false;
        }

        return true;
    }

    async function salvarAlteracao() {

       

        if (!token || !movimentacaoSelecionada) {
            exibirPopup(
                false,
                'Erro',
                "Não foi possível identificar a movimentação."
            );
            return;
        }

        if (!validarEdicao()) {
            return;
        }

        const original = movimentacaoSelecionada;

        const valorNumerico = converterValor(novoValor);

        const corpo = {
            token,
            tabela: original.tabela,
            id: original.id,

            // Dados originais usados na conferência do backend.
            nomeOriginal: original.nome,
            tipoOriginal: original.tipo,
            valorOriginal: Number(original.valor),
            dataRegistroOriginal: original.dataRegistro.replace(" ", "T"),
            obsOriginal: original.obs,

            // Novos valores solicitados.
            novoNome: novoNome.trim(),
            novoValor: valorNumerico,
            novoTipo,
            novaDataRegistro: formatarDataHora(novaData),
            novaObs: novaObservacao.trim() || null,
        };

        setSalvando(true);

        try {
            const response = await fetch(
                `${API_URL}/alterarMovimentacao`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(corpo),
                }
            );

            const resultado: RespostaOperacao = await response.json();

            if (!response.ok || !resultado.sucesso) {
                exibirPopup(
                    false,
                    'Não foi possível alterar',
                    resultado.mensagem ??
                        "Confira os dados e tente novamente."
                );

                return;
            }

            setPopupVisivel(false);

            await buscarMovimentacoes();
            exibirPopup(
                true,
                'Sucesso',
                resultado.mensagem || "Movimentação alterada com sucesso."
            );
        } catch (erro) {
            console.error("Erro ao alterar movimentação:", erro);
            exibirPopup(
                false,
                'Erro',
                "Não foi possível salvar a alteração. Verifique sua conexão."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!token || !movimentacaoSelecionada) {
            exibirPopup(
                false,
                'Erro',
                "Não foi possível identificar a movimentação."
            );
            return;
        }

        const original = movimentacaoSelecionada;

        const corpo = {
            token,
            tabela: original.tabela,
            id: original.id,

            nomeOriginal: original.nome,
            tipoOriginal: original.tipo,
            valorOriginal: Number(original.valor),
            dataRegistroOriginal: original.dataRegistro.replace(" ", "T"),
            obsOriginal: original.obs,
        };

        setSalvando(true);

        try {
            const response = await fetch(
                `${API_URL}/removerMovimentacao`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(corpo),
                }
            );

            const resultado: RespostaOperacao = await response.json();

            if (!response.ok || !resultado.sucesso) {
                exibirPopup(
                    false,
                    "Não foi possível excluir",
                    resultado.mensagem ??
                        "Atualize a lista e tente novamente."
                );

                return;
            }

            setPopupVisivel(false);

            await buscarMovimentacoes();

            exibirPopup(
                true,
                "Sucesso",
                resultado.mensagem || "Movimentação excluída com sucesso."
            );
        } catch (erro) {
            console.error("Erro ao excluir movimentação:", erro);

            exibirPopup(
                false,
                "Erro",
                "Não foi possível excluir a movimentação. Verifique sua conexão."
            );
        } finally {
            setSalvando(false);
        }
    }

    function alterarDataSelecionada(
        _evento: unknown,
        data?: Date
    ) {
        setMostrarSeletorData(false);

        if (data) {
            setNovaData((atual) => {
                const nova = new Date(atual);

                nova.setFullYear(
                    data.getFullYear(),
                    data.getMonth(),
                    data.getDate()
                );

                return nova;
            });
        }
    }

    function alterarHoraSelecionada(
        _evento: unknown,
        data?: Date
    ) {
        setMostrarSeletorHora(false);

        if (data) {
            setNovaData((atual) => {
                const nova = new Date(atual);

                nova.setHours(
                    data.getHours(),
                    data.getMinutes(),
                    0,
                    0
                );

                return nova;
            });
        }
    }

    const tiposDisponiveis =
        movimentacaoSelecionada?.tabela === "entrada"
            ? TIPOS_ENTRADA
            : TIPOS_SAIDA;

    function renderizarCampo(
        titulo: string,
        valor: string,
        alterar: (texto: string) => void,
        opcoes: {
            teclado?: "default" | "decimal-pad";
            multiline?: boolean;
        } = {}
    ) {
        return (
            <View style={styles.campoContainer}>
                <Text style={styles.label}>{titulo}</Text>

                <TextInput
                    value={valor}
                    onChangeText={alterar}
                    style={[
                        styles.input,
                        opcoes.multiline && styles.inputMultiline,
                    ]}
                    keyboardType={opcoes.teclado ?? "default"}
                    multiline={opcoes.multiline ?? false}
                    textAlignVertical={
                        opcoes.multiline ? "top" : "center"
                    }
                    placeholderTextColor={CORES.textSecondary}
                />
            </View>
        );
    }

    function renderizarDetalhes() {
        if (!movimentacaoSelecionada) {
            return null;
        }

        const movimento = movimentacaoSelecionada;
        const ehEntrada = movimento.tabela === "entrada";

        return (
            <View>
                <View style={styles.detalheDestaque}>
                    <View
                        style={[
                            styles.iconeGrande,
                            {
                                backgroundColor: ehEntrada
                                    ? "#DCFCE7"
                                    : "#FEE2E2",
                            },
                        ]}
                    >
                        <Ionicons
                            name={ehEntrada ? "arrow-down" : "arrow-up"}
                            size={28}
                            color={ehEntrada ? CORES.success : CORES.error}
                        />
                    </View>

                    <Text style={styles.detalheNome}>
                        {movimento.nome}
                    </Text>

                    <Text
                        style={[
                            styles.detalheValor,
                            {
                                color: ehEntrada
                                    ? CORES.success
                                    : CORES.error,
                            },
                        ]}
                    >
                        {ehEntrada ? "+" : "-"}
                        {formatarMoeda(movimento.valor)}
                    </Text>

                    <Text style={styles.detalheSubtitulo}>
                        {ehEntrada ? "Entrada" : "Saída"}
                    </Text>
                </View>

                <View style={styles.detalhesLista}>
                    <LinhaDetalhe
                        icone="pricetag-outline"
                        titulo="Categoria"
                        valor={obterNomeTipo(movimento.tipo)}
                    />

                    <LinhaDetalhe
                        icone="calendar-outline"
                        titulo="Data"
                        valor={formatarData(movimento.dataRegistro)}
                    />

                    <LinhaDetalhe
                        icone="time-outline"
                        titulo="Horário"
                        valor={formatarHorario(movimento.dataRegistro)}
                    />

                    <LinhaDetalhe
                        icone="document-text-outline"
                        titulo="Observações"
                        valor={
                            movimento.obs?.trim()
                                ? movimento.obs
                                : "Nenhuma observação"
                        }
                    />

                    <LinhaDetalhe
                        icone="finger-print-outline"
                        titulo="Identificador"
                        valor={String(movimento.id)}
                    />

                    <LinhaDetalhe
                        icone="server-outline"
                        titulo="Origem"
                        valor={
                            ehEntrada
                                ? "Tabela de entradas"
                                : "Tabela de saídas"
                        }
                    />
                </View>

                {modoGerenciamento && (
                    <View style={styles.acoesDetalhes}>
                        <Pressable
                            style={styles.botaoSecundario}
                            onPress={() => abrirEdicao(movimento)}
                        >
                            <Ionicons
                                name="create-outline"
                                size={19}
                                color={CORES.primary}
                            />

                            <Text style={styles.textoBotaoSecundario}>
                                Editar
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.botaoExcluir}
                            onPress={() => abrirExclusao(movimento)}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={19}
                                color={CORES.error}
                            />

                            <Text style={styles.textoBotaoExcluir}>
                                Excluir
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>
        );
    }

    function renderizarEdicao() {
        if (!movimentacaoSelecionada) {
            return null;
        }

    function converterData(data: string): Date {
    if (!data) {
        return new Date(NaN);
    }

    // Aceita datas como:
    // 2026-10-28T09:30:00
    // 2026-10-28 09:30:00
    const dataNormalizada = data.includes("T")
        ? data
        : data.replace(" ", "T");

    const correspondencia = dataNormalizada.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/
    );

    if (correspondencia) {
        const [
            ,
            ano,
            mes,
            dia,
            hora,
            minuto,
            segundo = "0",
            milissegundos = "0",
        ] = correspondencia;

        const dataConvertida = new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia),
            Number(hora),
            Number(minuto),
            Number(segundo),
            Number(milissegundos.padEnd(3, "0").slice(0, 3))
        );

        // Impede aceitar datas inexistentes, como 31/02.
        if (
            dataConvertida.getFullYear() !== Number(ano) ||
            dataConvertida.getMonth() !== Number(mes) - 1 ||
            dataConvertida.getDate() !== Number(dia)
        ) {
            return new Date(NaN);
        }

        return dataConvertida;
    }

    // Trata outros formatos, inclusive os que possuem fuso horário.
    const resultado = new Date(dataNormalizada);

    return resultado;
}

function formatarData(data: string): string {
    const dataConvertida = converterData(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data não definida";
    }

    const hoje = new Date();

    // Compara somente ano, mês e dia, ignorando o horário.
    const inicioHoje = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );

    const inicioDataMovimentacao = new Date(
        dataConvertida.getFullYear(),
        dataConvertida.getMonth(),
        dataConvertida.getDate()
    );

    const diferencaEmDias = Math.round(
        (inicioHoje.getTime() - inicioDataMovimentacao.getTime()) /
            (24 * 60 * 60 * 1000)
    );

    if (diferencaEmDias === 0) {
        return "Hoje";
    }

    if (diferencaEmDias === 1) {
        return "Ontem";
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}

function formatarHorario(data: string): string {
    const dataConvertida = converterData(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "--:--";
    }

    return dataConvertida.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

        return (
            <View>
                <View style={styles.avisoEdicao}>
                    <Ionicons
                        name="information-circle-outline"
                        size={21}
                        color={CORES.primary}
                    />

                    <Text style={styles.avisoEdicaoTexto}>
                        Modifique os campos desejados. Os dados originais
                        serão conferidos antes de salvar.
                    </Text>
                </View>

                {renderizarCampo(
                    "Nome da movimentação",
                    novoNome,
                    setNovoNome
                )}

                {renderizarCampo(
                    "Valor (R$)",
                    novoValor,
                    setNovoValor,
                    { teclado: "decimal-pad" }
                )}

                <View style={styles.campoContainer}>
                    <Text style={styles.label}>Categoria</Text>

                    <View style={styles.opcoesTipo}>
                        {tiposDisponiveis.map((tipo) => {
                            const selecionado =
                                novoTipo === tipo.value;

                            return (
                                <Pressable
                                    key={tipo.value}
                                    onPress={() => setNovoTipo(tipo.value)}
                                    style={[
                                        styles.opcaoTipo,
                                        selecionado &&
                                            styles.opcaoTipoSelecionada,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.textoOpcaoTipo,
                                            selecionado &&
                                                styles.textoOpcaoTipoSelecionada,
                                        ]}
                                    >
                                        {tipo.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.campoContainer}>
                    <Text style={styles.label}>Data</Text>

                    <Pressable
                        style={styles.campoData}
                        onPress={() => setMostrarSeletorData(true)}
                    >
                        <Text style={styles.campoDataTexto}>
                            {novaData.toLocaleDateString("pt-BR")}
                        </Text>

                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color={CORES.textSecondary}
                        />
                    </Pressable>
                </View>

                <View style={styles.campoContainer}>
                    <Text style={styles.label}>Horário</Text>

                    <Pressable
                        style={styles.campoData}
                        onPress={() => setMostrarSeletorHora(true)}
                    >
                        <Text style={styles.campoDataTexto}>
                            {novaData.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>

                        <Ionicons
                            name="time-outline"
                            size={20}
                            color={CORES.textSecondary}
                        />
                    </Pressable>
                </View>

                {mostrarSeletorData && (
                    <DateTimePicker
                        value={novaData}
                        mode="date"
                        display={
                            Platform.OS === "ios"
                                ? "spinner"
                                : "default"
                        }
                        onChange={alterarDataSelecionada}
                    />
                )}

                {mostrarSeletorHora && (
                    <DateTimePicker
                        value={novaData}
                        mode="time"
                        is24Hour
                        display={
                            Platform.OS === "ios"
                                ? "spinner"
                                : "default"
                        }
                        onChange={alterarHoraSelecionada}
                    />
                )}

                {renderizarCampo(
                    "Observações",
                    novaObservacao,
                    setNovaObservacao,
                    { multiline: true }
                )}

                <View style={styles.botoesRodape}>
                    <Pressable
                        style={styles.botaoCancelar}
                        onPress={fecharPopup}
                        disabled={salvando}
                    >
                        <Text style={styles.textoBotaoCancelar}>
                            Cancelar
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.botaoPrincipal}
                        onPress={salvarAlteracao}
                        disabled={salvando}
                    >
                        {salvando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.textoBotaoPrincipal}>
                                    Salvar alterações
                                </Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        );
    }

    function renderizarConfirmacaoExclusao() {
        if (!movimentacaoSelecionada) {
            return null;
        }

        return (
            <View style={styles.confirmacaoContainer}>
                <View style={styles.iconeExclusao}>
                    <Ionicons
                        name="trash-outline"
                        size={30}
                        color={CORES.error}
                    />
                </View>

                <Text style={styles.confirmacaoTitulo}>
                    Excluir movimentação?
                </Text>

                <Text style={styles.confirmacaoTexto}>
                    Você está prestes a excluir{" "}
                    <Text style={styles.textoNegrito}>
                        {movimentacaoSelecionada.nome}
                    </Text>
                    , no valor de{" "}
                    <Text style={styles.textoNegrito}>
                        {formatarMoeda(movimentacaoSelecionada.valor)}
                    </Text>
                    .
                </Text>

                <Text style={styles.confirmacaoAviso}>
                    Essa operação não poderá ser desfeita.
                </Text>

                <View style={styles.botoesRodape}>
                    <Pressable
                        style={styles.botaoCancelar}
                        onPress={fecharPopup}
                        disabled={salvando}
                    >
                        <Text style={styles.textoBotaoCancelar}>
                            Cancelar
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.botaoExcluirConfirmacao}
                        onPress={confirmarExclusao}
                        disabled={salvando}
                    >
                        {salvando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.textoBotaoPrincipal}>
                                    Excluir
                                </Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        );
    }

    function renderizarMovimentacao({
        item,
    }: {
        item: Movimentacao;
    }) {
        const ehEntrada = item.tabela === "entrada";

        return (
            <View style={styles.movimentacaoCard}>
                <View
                    style={[
                        styles.iconeMovimentacao,
                        {
                            backgroundColor: ehEntrada
                                ? "#DCFCE7"
                                : "#FEE2E2",
                        },
                    ]}
                >
                    <Ionicons
                        name={ehEntrada ? "arrow-down" : "arrow-up"}
                        size={21}
                        color={ehEntrada ? CORES.success : CORES.error}
                    />
                </View>

                <Pressable
                    style={styles.movimentacaoConteudo}
                    onPress={() => abrirVisualizacao(item)}
                >
                    <Text
                        style={styles.movimentacaoNome}
                        numberOfLines={1}
                    >
                        {item.nome}
                    </Text>

                    <Text style={styles.movimentacaoDescricao}>
                        {obterNomeTipo(item.tipo)} ·{" "}
                        {formatarData(item.dataRegistro)}
                    </Text>

                    <Text style={styles.movimentacaoHorario}>
                        {formatarHorario(item.dataRegistro)}
                    </Text>
                </Pressable>

                <View style={styles.movimentacaoLadoDireito}>
                    <Text
                        style={[
                            styles.movimentacaoValor,
                            {
                                color: ehEntrada
                                    ? CORES.success
                                    : CORES.error,
                            },
                        ]}
                    >
                        {ehEntrada ? "+" : "-"}
                        {formatarMoeda(item.valor)}
                    </Text>

                    {modoGerenciamento && (
                        <View style={styles.acoesMovimentacao}>
                            <Pressable
                                style={styles.acaoIcone}
                                onPress={() => abrirVisualizacao(item)}
                                accessibilityLabel="Ver movimentação"
                            >
                                <Ionicons
                                    name="eye-outline"
                                    size={19}
                                    color={CORES.primary}
                                />
                            </Pressable>

                            <Pressable
                                style={styles.acaoIcone}
                                onPress={() => abrirEdicao(item)}
                                accessibilityLabel="Editar movimentação"
                            >
                                <Ionicons
                                    name="create-outline"
                                    size={19}
                                    color={CORES.primary}
                                />
                            </Pressable>

                            <Pressable
                                style={styles.acaoIcone}
                                onPress={() => abrirExclusao(item)}
                                accessibilityLabel="Excluir movimentação"
                            >
                                <Ionicons
                                    name="close-circle-outline"
                                    size={21}
                                    color={CORES.error}
                                />
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cabecalho}>
                    <View>
                        <Text style={styles.titulo}>Transações</Text>

                        <Text style={styles.subtitulo}>
                            Acompanhe suas movimentações
                        </Text>
                    </View>

                    <Pressable
                        style={[
                            styles.botaoGerenciar,
                            modoGerenciamento &&
                                styles.botaoGerenciarAtivo,
                        ]}
                        onPress={() => {
                            setModoGerenciamento((atual) => !atual);
                        }}
                    >
                        <Ionicons
                            name={
                                modoGerenciamento
                                    ? "checkmark-outline"
                                    : "settings-outline"
                            }
                            size={19}
                            color={
                                modoGerenciamento
                                    ? "#FFFFFF"
                                    : CORES.primary
                            }
                        />

                        <Text
                            style={[
                                styles.textoBotaoGerenciar,
                                modoGerenciamento &&
                                    styles.textoBotaoGerenciarAtivo,
                            ]}
                        >
                            {modoGerenciamento ? "Concluir" : "Gerenciar"}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.seletorMes}>
                    <Pressable
                        onPress={() => mudarMes(-1)}
                        style={styles.botaoMes}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={CORES.primary}
                        />
                    </Pressable>

                    <View style={styles.mesCentro}>
                        <Ionicons
                            name="calendar-outline"
                            size={19}
                            color={CORES.primary}
                        />

                        <Text style={styles.textoMes}>
                            {formatarMes(dataSelecionada)}
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => mudarMes(1)}
                        style={styles.botaoMes}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color={CORES.primary}
                        />
                    </Pressable>
                </View>

                <View style={styles.resumoContainer}>
                    <View style={styles.resumoCard}>
                        <View style={styles.resumoIconeEntrada}>
                            <Ionicons
                                name="arrow-down"
                                size={18}
                                color={CORES.success}
                            />
                        </View>

                        <Text style={styles.resumoTitulo}>
                            Entradas
                        </Text>

                        <Text
                            style={[
                                styles.resumoValor,
                                { color: CORES.success },
                            ]}
                        >
                            {formatarMoeda(totalEntradas)}
                        </Text>
                    </View>

                    <View style={styles.resumoCard}>
                        <View style={styles.resumoIconeSaida}>
                            <Ionicons
                                name="arrow-up"
                                size={18}
                                color={CORES.error}
                            />
                        </View>

                        <Text style={styles.resumoTitulo}>
                            Saídas
                        </Text>

                        <Text
                            style={[
                                styles.resumoValor,
                                { color: CORES.error },
                            ]}
                        >
                            {formatarMoeda(totalSaidas)}
                        </Text>
                    </View>
                </View>

                <View style={styles.saldoCard}>
                    <View>
                        <Text style={styles.saldoTitulo}>
                            Saldo do mês
                        </Text>

                        <Text style={styles.saldoDescricao}>
                            Entradas menos saídas
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.saldoValor,
                            {
                                color:
                                    saldo >= 0
                                        ? CORES.success
                                        : CORES.error,
                            },
                        ]}
                    >
                        {formatarMoeda(saldo)}
                    </Text>
                </View>

                <View style={styles.filtros}>
                    {[
                        { label: "Todas", value: "TODAS" },
                        { label: "Entradas", value: "ENTRADAS" },
                        { label: "Saídas", value: "SAIDAS" },
                    ].map((opcao) => {
                        const selecionado = filtro === opcao.value;

                        return (
                            <Pressable
                                key={opcao.value}
                                onPress={() =>
                                    setFiltro(
                                        opcao.value as
                                            | "TODAS"
                                            | "ENTRADAS"
                                            | "SAIDAS"
                                    )
                                }
                                style={[
                                    styles.filtroBotao,
                                    selecionado &&
                                        styles.filtroBotaoSelecionado,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filtroTexto,
                                        selecionado &&
                                            styles.filtroTextoSelecionado,
                                    ]}
                                >
                                    {opcao.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.listaCabecalho}>
                    <Text style={styles.listaTitulo}>
                        Movimentações
                    </Text>

                    <Text style={styles.listaQuantidade}>
                        {movimentacoesFiltradas.length} registro(s)
                    </Text>
                </View>

                {modoGerenciamento && (
                    <View style={styles.avisoGerenciamento}>
                        <Ionicons
                            name="information-circle-outline"
                            size={19}
                            color={CORES.primary}
                        />

                        <Text style={styles.avisoGerenciamentoTexto}>
                            Toque em uma movimentação para visualizar os
                            detalhes ou use os ícones para editar e excluir.
                        </Text>
                    </View>
                )}

                {carregando ? (
                    <View style={styles.estadoVazio}>
                        <ActivityIndicator
                            size="large"
                            color={CORES.primary}
                        />

                        <Text style={styles.estadoVazioTexto}>
                            Carregando movimentações...
                        </Text>
                    </View>
                ) : movimentacoesFiltradas.length === 0 ? (
                    <View style={styles.estadoVazio}>
                        <View style={styles.estadoVazioIcone}>
                            <Ionicons
                                name="receipt-outline"
                                size={30}
                                color={CORES.textSecondary}
                            />
                        </View>

                        <Text style={styles.estadoVazioTitulo}>
                            Nenhuma movimentação
                        </Text>

                        <Text style={styles.estadoVazioTexto}>
                            Não há registros para esse mês e filtro.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={movimentacoesFiltradas}
                        keyExtractor={(item) =>
                            `${item.tabela}-${item.id}`
                        }
                        renderItem={renderizarMovimentacao}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>

            {/* Modal controlado pelo estado booleano popupVisivel. */}
            <Modal
                visible={popupVisivel}
                transparent
                animationType="fade"
                onRequestClose={fecharPopup}
                statusBarTranslucent
            >
                <View style={styles.modalFundo}>
                    <KeyboardAvoidingView
                        behavior={
                            Platform.OS === "ios"
                                ? "padding"
                                : undefined
                        }
                        style={styles.modalCentralizador}
                    >
                        <View style={styles.modalCartao}>
                            <View style={styles.modalCabecalho}>
                                <Text style={styles.modalTitulo}>
                                    {tipoPopup === "visualizar"
                                        ? "Detalhes da movimentação"
                                        : tipoPopup === "editar"
                                          ? "Editar movimentação"
                                          : "Confirmar exclusão"}
                                </Text>

                                <Pressable
                                    onPress={fecharPopup}
                                    disabled={salvando}
                                    style={styles.fecharModal}
                                >
                                    <Ionicons
                                        name="close"
                                        size={23}
                                        color={CORES.textSecondary}
                                    />
                                </Pressable>
                            </View>

                            <ScrollView
                                style={styles.modalConteudo}
                                contentContainerStyle={
                                    styles.modalConteudoInterno
                                }
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                {tipoPopup === "visualizar" &&
                                    renderizarDetalhes()}

                                {tipoPopup === "editar" &&
                                    renderizarEdicao()}

                                {tipoPopup === "excluir" &&
                                    renderizarConfirmacaoExclusao()}
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            <Modal
                visible={popupVisivelMsg}
                transparent
                animationType="fade"
                onRequestClose={() => setPopupVisivelMsg(false)}
            >
                <View style={styles.popupOverlay}>
                    <View style={styles.popupContainer}>

                        {/* Ícone de sucesso ou erro */}
                        <View
                            style={[
                                styles.popupIcone,
                                {
                                    backgroundColor: popupSucesso
                                        ? '#16A34A'
                                        : '#DC2626'
                                }
                            ]}
                        >
                            <Ionicons
                                name={popupSucesso ? 'checkmark' : 'close'}
                                size={34}
                                color="#FFFFFF"
                            />
                        </View>

                        {/* Título */}
                        <Text style={styles.popupTitulo}>
                            {popupTitulo}
                        </Text>

                        {/* Subtítulo */}
                        <Text style={styles.popupSubtitulo}>
                            {popupSubtitulo}
                        </Text>

                        {/* Botão para fechar */}
                        <Pressable
                            style={[
                                styles.popupBotao,
                                {
                                    backgroundColor: popupSucesso
                                        ? Colors.success
                                        : Colors.error
                                }
                            ]}
                            onPress={() => setPopupVisivelMsg(false)}
                        >
                            <Text style={styles.popupBotaoTexto}>
                                Entendi
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

function LinhaDetalhe({
    icone,
    titulo,
    valor,
}: {
    icone: React.ComponentProps<typeof Ionicons>["name"];
    titulo: string;
    valor: string;
}) {
    return (
        <View style={styles.linhaDetalhe}>
            <View style={styles.linhaDetalheEsquerda}>
                <View style={styles.linhaDetalheIcone}>
                    <Ionicons
                        name={icone}
                        size={18}
                        color={CORES.textSecondary}
                    />
                </View>

                <Text style={styles.linhaDetalheTitulo}>
                    {titulo}
                </Text>
            </View>

            <Text style={styles.linhaDetalheValor}>
                {valor}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CORES.background,
    },

    conteudo: {
        padding: 20,
        paddingBottom: 40,
        marginTop: 25
    },

    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22,
    },

    titulo: {
        fontSize: 26,
        fontWeight: "700",
        color: CORES.text,
    },

    subtitulo: {
        marginTop: 4,
        fontSize: 13,
        color: CORES.textSecondary,
    },

    botaoGerenciar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: CORES.surface,
    },

    botaoGerenciarAtivo: {
        backgroundColor: CORES.primary,
        borderColor: CORES.primary,
    },

    textoBotaoGerenciar: {
        fontSize: 13,
        fontWeight: "600",
        color: CORES.primary,
    },

    textoBotaoGerenciarAtivo: {
        color: "#FFFFFF",
    },

    seletorMes: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: CORES.surface,
        borderWidth: 1,
        borderColor: CORES.border,
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 7,
        marginBottom: 18,
    },

    botaoMes: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },

    mesCentro: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
    },

    textoMes: {
        fontSize: 15,
        fontWeight: "600",
        color: CORES.text,
    },

    resumoContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },

    resumoCard: {
        flex: 1,
        backgroundColor: CORES.surface,
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CORES.border,
    },

    resumoIconeEntrada: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#DCFCE7",
        marginBottom: 12,
    },

    resumoIconeSaida: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#FEE2E2",
        marginBottom: 12,
    },

    resumoTitulo: {
        fontSize: 12,
        color: CORES.textSecondary,
        marginBottom: 5,
    },

    resumoValor: {
        fontSize: 16,
        fontWeight: "700",
    },

    saldoCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 18,
        borderRadius: 16,
        backgroundColor: CORES.surface,
        borderWidth: 1,
        borderColor: CORES.border,
        marginBottom: 22,
    },

    saldoTitulo: {
        fontSize: 15,
        fontWeight: "700",
        color: CORES.text,
    },

    saldoDescricao: {
        fontSize: 12,
        color: CORES.textSecondary,
        marginTop: 5,
    },

    saldoValor: {
        fontSize: 17,
        fontWeight: "700",
    },

    filtros: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 22,
    },

    filtroBotao: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: CORES.surface,
        borderWidth: 1,
        borderColor: CORES.border,
    },

    filtroBotaoSelecionado: {
        backgroundColor: CORES.primary,
        borderColor: CORES.primary,
    },

    filtroTexto: {
        fontSize: 13,
        fontWeight: "600",
        color: CORES.textSecondary,
    },

    filtroTextoSelecionado: {
        color: "#FFFFFF",
    },

    listaCabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    listaTitulo: {
        fontSize: 18,
        fontWeight: "700",
        color: CORES.text,
    },

    listaQuantidade: {
        fontSize: 12,
        color: CORES.textSecondary,
    },

    avisoGerenciamento: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        backgroundColor: "#EFF6FF",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
    },

    avisoGerenciamentoTexto: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: CORES.primaryDark,
    },

    movimentacaoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CORES.surface,
        padding: 13,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: CORES.border,
        marginBottom: 10,
        gap: 11,
    },

    iconeMovimentacao: {
        width: 43,
        height: 43,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
    },

    movimentacaoConteudo: {
        flex: 1,
        minWidth: 0,
    },

    movimentacaoNome: {
        fontSize: 14,
        fontWeight: "700",
        color: CORES.text,
    },

    movimentacaoDescricao: {
        fontSize: 11,
        color: CORES.textSecondary,
        marginTop: 5,
    },

    movimentacaoHorario: {
        fontSize: 11,
        color: CORES.textSecondary,
        marginTop: 3,
    },

    movimentacaoLadoDireito: {
        alignItems: "flex-end",
        gap: 8,
    },

    movimentacaoValor: {
        fontSize: 13,
        fontWeight: "700",
    },

    acoesMovimentacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },

    acaoIcone: {
        width: 28,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    estadoVazio: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 42,
        backgroundColor: CORES.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CORES.border,
    },

    estadoVazioIcone: {
        width: 58,
        height: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: CORES.background,
        marginBottom: 14,
    },

    estadoVazioTitulo: {
        fontSize: 15,
        fontWeight: "700",
        color: CORES.text,
    },

    estadoVazioTexto: {
        marginTop: 7,
        fontSize: 12,
        color: CORES.textSecondary,
        textAlign: "center",
        paddingHorizontal: 20,
    },

    modalFundo: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        justifyContent: "center",
        padding: 18,
    },

    modalCentralizador: {
        width: "100%",
        maxHeight: "90%",
        alignSelf: "center",
        justifyContent: "center",
    },

    modalCartao: {
        width: "100%",
        maxHeight: "100%",
        backgroundColor: CORES.surface,
        borderRadius: 22,
        overflow: "hidden",
    },

    modalCabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 17,
        borderBottomWidth: 1,
        borderBottomColor: CORES.border,
    },

    modalTitulo: {
        flex: 1,
        fontSize: 17,
        fontWeight: "700",
        color: CORES.text,
    },

    fecharModal: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: CORES.background,
        marginLeft: 12,
    },

    modalConteudo: {
        flexGrow: 0,
    },

    modalConteudoInterno: {
        padding: 20,
        paddingBottom: 24,
    },

    detalheDestaque: {
        alignItems: "center",
        paddingVertical: 10,
        paddingBottom: 25,
    },

    iconeGrande: {
        width: 62,
        height: 62,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    detalheNome: {
        fontSize: 20,
        fontWeight: "700",
        color: CORES.text,
        textAlign: "center",
    },

    detalheValor: {
        fontSize: 26,
        fontWeight: "800",
        marginTop: 10,
    },

    detalheSubtitulo: {
        fontSize: 12,
        color: CORES.textSecondary,
        marginTop: 6,
    },

    detalhesLista: {
        borderTopWidth: 1,
        borderTopColor: CORES.border,
    },

    linhaDetalhe: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: CORES.border,
    },

    linhaDetalheEsquerda: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        flexShrink: 0,
    },

    linhaDetalheIcone: {
        width: 30,
        height: 30,
        borderRadius: 9,
        backgroundColor: CORES.background,
        alignItems: "center",
        justifyContent: "center",
    },

    linhaDetalheTitulo: {
        fontSize: 12,
        color: CORES.textSecondary,
    },

    linhaDetalheValor: {
        flex: 1,
        fontSize: 12,
        fontWeight: "600",
        color: CORES.text,
        textAlign: "right",
        lineHeight: 19,
    },

    acoesDetalhes: {
        flexDirection: "row",
        gap: 10,
        marginTop: 22,
    },

    botaoSecundario: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 7,
        paddingVertical: 13,
        borderRadius: 12,
        backgroundColor: "#EFF6FF",
    },

    textoBotaoSecundario: {
        fontSize: 13,
        fontWeight: "700",
        color: CORES.primary,
    },

    botaoExcluir: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 7,
        paddingVertical: 13,
        borderRadius: 12,
        backgroundColor: "#FEF2F2",
    },

    textoBotaoExcluir: {
        fontSize: 13,
        fontWeight: "700",
        color: CORES.error,
    },

    avisoEdicao: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        padding: 12,
        backgroundColor: "#EFF6FF",
        borderRadius: 12,
        marginBottom: 18,
    },

    avisoEdicaoTexto: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: CORES.primaryDark,
    },

    campoContainer: {
        marginBottom: 16,
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: CORES.text,
        marginBottom: 8,
    },

    input: {
        minHeight: 47,
        borderWidth: 1,
        borderColor: CORES.border,
        borderRadius: 12,
        paddingHorizontal: 13,
        fontSize: 14,
        color: CORES.text,
        backgroundColor: CORES.surface,
    },

    inputMultiline: {
        minHeight: 100,
        paddingTop: 13,
    },

    opcoesTipo: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    opcaoTipo: {
        borderWidth: 1,
        borderColor: CORES.border,
        backgroundColor: CORES.surface,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    opcaoTipoSelecionada: {
        backgroundColor: "#EFF6FF",
        borderColor: CORES.primary,
    },

    textoOpcaoTipo: {
        fontSize: 12,
        fontWeight: "600",
        color: CORES.textSecondary,
    },

    textoOpcaoTipoSelecionada: {
        color: CORES.primary,
    },

    campoData: {
        minHeight: 47,
        borderWidth: 1,
        borderColor: CORES.border,
        borderRadius: 12,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    campoDataTexto: {
        fontSize: 14,
        color: CORES.text,
    },

    botoesRodape: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },

    botaoCancelar: {
        flex: 1,
        minHeight: 47,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: CORES.border,
        borderRadius: 12,
        backgroundColor: CORES.surface,
    },

    textoBotaoCancelar: {
        fontSize: 13,
        fontWeight: "600",
        color: CORES.textSecondary,
    },

    botaoPrincipal: {
        flex: 1.5,
        minHeight: 47,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 7,
        borderRadius: 12,
        backgroundColor: CORES.primary,
        paddingHorizontal: 10,
    },

    textoBotaoPrincipal: {
        fontSize: 13,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    botaoExcluirConfirmacao: {
        flex: 1.2,
        minHeight: 47,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 7,
        borderRadius: 12,
        backgroundColor: CORES.error,
    },

    confirmacaoContainer: {
        alignItems: "center",
        paddingTop: 10,
    },

    iconeExclusao: {
        width: 62,
        height: 62,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEE2E2",
        marginBottom: 17,
    },

    confirmacaoTitulo: {
        fontSize: 19,
        fontWeight: "700",
        color: CORES.text,
        textAlign: "center",
    },

    confirmacaoTexto: {
        fontSize: 14,
        lineHeight: 22,
        color: CORES.textSecondary,
        textAlign: "center",
        marginTop: 12,
    },

    textoNegrito: {
        fontWeight: "700",
        color: CORES.text,
    },

    confirmacaoAviso: {
        fontSize: 12,
        color: CORES.error,
        marginTop: 12,
        textAlign: "center",
    },
    popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
},

        popupContainer: {
            width: '100%',
            maxWidth: 340,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingTop: 30,
            paddingBottom: 24,
            alignItems: 'center',

            elevation: 10,

            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.12,
            shadowRadius: 15,
        },

        popupIcone: {
            width: 72,
            height: 72,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },

        popupTitulo: {
            fontSize: 21,
            fontWeight: '700',
            color: '#0F172A',
            textAlign: 'center',
            marginBottom: 10,
        },

        popupSubtitulo: {
            fontSize: 14,
            lineHeight: 22,
            color: '#64748B',
            textAlign: 'center',
            marginBottom: 26,
        },

        popupBotao: {
            width: '100%',
            minHeight: 48,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
        },

        popupBotaoTexto: {
            fontSize: 15,
            fontWeight: '600',
            color: '#FFFFFF',
        },
});