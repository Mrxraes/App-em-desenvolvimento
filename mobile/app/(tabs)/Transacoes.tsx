import { Colors } from "@/constants/Colors";
import { useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useData } from "../../context/DataContext";
import { LinearGradient } from "expo-linear-gradient";

type Movimentacao = {
    nome: string;
    dataRegistro: string;
    valor: string;
    tipo: string;
    tabela: string;
};

type GrupoMovimentacoes = {
    chaveData: string;
    dataRegistro: string;
    itens: Movimentacao[];
};

const API_URL = "http://192.168.15.6:8080";
const MILISSEGUNDOS_DIA = 24 * 60 * 60 * 1000;

export default function Movimentacoes() {
    const [tipoVisualizacao, setTipoVisualizacao] = useState<"todas" | "entrada" | "saida">("todas");
    const [entradasValorTotal, setEntradasValorTotal] = useState("0");
    const [saidasValorTotal, setSaidasValorTotal] = useState("0");
    const [saldoAtual, setSaldoAtual] = useState("0");
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [token, setToken] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const { data } = useData();

    const [fontsLoaded] = useFonts({
        PlusJakartaExtraLight: require("../../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
        PlusJakartaMedium: require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
        PlusJakartaBold: require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
        PlusJakartaSemiBold: require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
        PlusJakartaExtraLignItalic: require("../../assets/fonts/PlusJakartaSans-ExtraLightItalic.ttf"),
    });

    // Recupera o token uma vez ao montar a tela.
    useEffect(() => {
        async function carregarToken() {
            try {
                const tokenSalvo = await SecureStore.getItemAsync("tokenLogin");
                if (tokenSalvo) setToken(tokenSalvo);
                else setErro("Sua sessão não foi encontrada. Entre novamente no aplicativo.");
            } catch (e) {
                console.error("Erro ao recuperar token:", e);
                setErro("Não foi possível recuperar sua sessão.");
            }
        }
        carregarToken();
    }, []);

    const dataParaApi = useMemo(() => {
        const valor = data instanceof Date ? data : new Date(data as unknown as string);
        return Number.isNaN(valor.getTime()) ? new Date().toISOString() : valor.toISOString();
    }, [data]);

    const buscarResumo = useCallback(async (tokenAtual: string) => {
        try {
            const [respostaEntrada, respostaSaida] = await Promise.all([
                fetch(`${API_URL}/api/dadosEntrada`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: tokenAtual, data: dataParaApi }),
                }),
                fetch(`${API_URL}/api/dadosSaida`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: tokenAtual, data: dataParaApi }),
                }),
            ]);

            if (!respostaEntrada.ok || !respostaSaida.ok) {
                throw new Error("Não foi possível carregar o resumo financeiro.");
            }

            const entrada = await respostaEntrada.json();
            const saida = await respostaSaida.json();
            setEntradasValorTotal(String(entrada.valorTotal ?? 0));
            setSaidasValorTotal(String(saida.valorTotal ?? 0));
        } catch (e) {
            console.error("Erro ao buscar resumo:", e);
        }
    }, [dataParaApi]);

    const buscarMovimentacoes = useCallback(async (tokenAtual: string) => {
        setCarregando(true);
        setErro("");
        try {
            const response = await fetch(`${API_URL}/api/allMovimentacoes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: tokenAtual, data: dataParaApi }),
            });

            if (!response.ok) {
                throw new Error("Não foi possível buscar as movimentações.");
            }

            const dados: Movimentacao[] = await response.json();
            const dadosTratados = dados.map((movimento) => ({
                nome: movimento.nome ?? "Não definido",
                dataRegistro: movimento.dataRegistro ?? "",
                valor: String(movimento.valor ?? "0"),
                tipo: movimento.tipo ?? "Não definido",
                tabela: String(movimento.tabela ?? "Não definido").toLowerCase(),
            }));

            // Garante ordem cronológica decrescente mesmo se o backend não ordenar.
            dadosTratados.sort((a, b) => converterData(b.dataRegistro).getTime() - converterData(a.dataRegistro).getTime());
            setMovimentacoes(dadosTratados);
        } catch (e) {
            console.error("Erro ao buscar movimentações:", e);
            setErro("Não foi possível carregar as movimentações.");
        } finally {
            setCarregando(false);
        }
    }, [dataParaApi]);

    useFocusEffect(
        useCallback(() => {
            if (!token) return;
            buscarResumo(token);
            buscarMovimentacoes(token);
        }, [token, dataParaApi, buscarResumo, buscarMovimentacoes])
    );

    useEffect(() => {
        const entrada = Number(entradasValorTotal) || 0;
        const saida = Number(saidasValorTotal) || 0;
        setSaldoAtual(String(entrada - saida));
    }, [entradasValorTotal, saidasValorTotal]);

    // Trata strings ISO do backend e também datas no formato "yyyy-MM-dd HH:mm:ss".
    function converterData(valor: string): Date {
        if (!valor) return new Date(NaN);
        const normalizada = valor.includes("T") ? valor : valor.replace(" ", "T");
        return new Date(normalizada);
    }

    // Compara os dias usando milissegundos, normalizando cada data para meia-noite.
    // Isso evita que o horário da movimentação altere a classificação do dia.
    function chaveDoDia(valor: string): string {
        const dataMovimento = converterData(valor);
        if (Number.isNaN(dataMovimento.getTime())) return "data-invalida";
        return `${dataMovimento.getFullYear()}-${String(dataMovimento.getMonth() + 1).padStart(2, "0")}-${String(dataMovimento.getDate()).padStart(2, "0")}`;
    }

    function formatarData(valor: string): string {
        const dataMovimento = converterData(valor);
        if (Number.isNaN(dataMovimento.getTime())) return "Data não definida";

        const hoje = new Date();
        const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();
        const inicioMovimento = new Date(
            dataMovimento.getFullYear(),
            dataMovimento.getMonth(),
            dataMovimento.getDate()
        ).getTime();

        // Diferença de dias em milissegundos: 0 = hoje, 1 = ontem.
        const diferencaEmDias = Math.round((inicioHoje - inicioMovimento) / MILISSEGUNDOS_DIA);

        if (diferencaEmDias === 0) return "Hoje";
        if (diferencaEmDias === 1) return "Ontem";

        return `${String(dataMovimento.getDate()).padStart(2, "0")}/${String(dataMovimento.getMonth() + 1).padStart(2, "0")}/${dataMovimento.getFullYear()}`;
    }

    function formatarHorario(valor: string): string {
        const dataMovimento = converterData(valor);
        if (Number.isNaN(dataMovimento.getTime())) return "--:--";
        return `${String(dataMovimento.getHours()).padStart(2, "0")}:${String(dataMovimento.getMinutes()).padStart(2, "0")}`;
    }

    function formatarDinheiro(valor: string | number): string {
        return (Number(valor) || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function formatarTipo(texto: string): string {
        const tipos: Record<string, string> = {
            FIXA: "FIXO",
            FIXO: "FIXO",
            VARIAVEL: "VARIÁVEL",
            VARIÁVEL: "VARIÁVEL",
            INVESTIMENTO: "INVESTIMENTO",
            INVESTIMENTOS: "INVESTIMENTOS",
            SALARIO: "SALÁRIO",
            EXTRA: "EXTRA",
            RENDIMENTO: "RENDIMENTO",
            RENDIMENTOS: "RENDIMENTOS",
        };
        return tipos[texto?.toUpperCase()] ?? texto ?? "Não definido";
    }

    const gruposMovimentacoes = useMemo<GrupoMovimentacoes[]>(() => {
        const filtradas = movimentacoes.filter((movimento) =>
            tipoVisualizacao === "todas" || movimento.tabela === tipoVisualizacao
        );

        const mapa = new Map<string, GrupoMovimentacoes>();
        for (const movimento of filtradas) {
            const chave = chaveDoDia(movimento.dataRegistro);
            if (!mapa.has(chave)) {
                mapa.set(chave, {
                    chaveData: chave,
                    dataRegistro: movimento.dataRegistro,
                    itens: [],
                });
            }
            mapa.get(chave)!.itens.push(movimento);
        }
        return Array.from(mapa.values());
    }, [movimentacoes, tipoVisualizacao]);

    if (!fontsLoaded) return null;

    return (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
            <LinearGradient colors={[Colors.background, Colors.background]} style={styles.contentContainer}>
                <View style={styles.contPadding}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            accessibilityRole="button"
                            accessibilityLabel="Voltar"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="chevron-back" size={22} color={Colors.primary} />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headerTitle}>Movimentações</Text>
                            <Text style={styles.headerSubTitle}>Acompanhe todas as suas entradas e saídas</Text>
                        </View>
                    </View>

                    <View style={styles.containerButtons}>
                        <TouchableOpacity style={tipoVisualizacao === "todas" ? styles.buttonSelect : styles.button} onPress={() => setTipoVisualizacao("todas")}>
                            <Text style={tipoVisualizacao === "todas" ? styles.textBtnSelect : styles.textBtn}>Todas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tipoVisualizacao === "entrada" ? styles.buttonSelect : styles.button} onPress={() => setTipoVisualizacao("entrada")}>
                            <Text style={tipoVisualizacao === "entrada" ? styles.textBtnSelect : styles.textBtn}>Entradas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tipoVisualizacao === "saida" ? styles.buttonSelect : styles.button} onPress={() => setTipoVisualizacao("saida")}>
                            <Text style={tipoVisualizacao === "saida" ? styles.textBtnSelect : styles.textBtn}>Saídas</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerDados}>
                        <View style={styles.containerMGS}>
                            <View style={styles.iconeContainerSucess}><Ionicons name="arrow-up" size={16} color={Colors.background} /></View>
                            <View style={styles.subContainerDados}>
                                <Text style={styles.titleDados}>Entradas</Text>
                                <Text style={[styles.titleValue, { color: Colors.success }]}>{formatarDinheiro(entradasValorTotal)}</Text>
                            </View>
                        </View>
                        <View style={styles.containerMGS}>
                            <View style={styles.iconeContainerError}><Ionicons name="arrow-down" size={16} color={Colors.background} /></View>
                            <View style={styles.subContainerDados}>
                                <Text style={styles.titleDados}>Saídas</Text>
                                <Text style={[styles.titleValue, { color: Colors.error }]}>{formatarDinheiro(saidasValorTotal)}</Text>
                            </View>
                        </View>
                        <View style={styles.containerMGS}>
                            <View style={styles.iconeContainerSaldo}><Ionicons name="stats-chart" size={14} color={Colors.background} /></View>
                            <View style={styles.subContainerDados}>
                                <Text style={styles.titleDados}>Saldo atual</Text>
                                <Text style={[styles.titleValue, { color: Colors.text }]}>{formatarDinheiro(saldoAtual)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {carregando && movimentacoes.length === 0 ? (
                    <View style={styles.estadoContainer}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.estadoTexto}>Carregando movimentações...</Text>
                    </View>
                ) : erro ? (
                    <View style={styles.estadoContainer}>
                        <Ionicons name="alert-circle-outline" size={26} color={Colors.error} />
                        <Text style={styles.estadoTitulo}>Não foi possível carregar</Text>
                        <Text style={styles.estadoTexto}>{erro}</Text>
                    </View>
                ) : gruposMovimentacoes.length === 0 ? (
                    <View style={styles.estadoContainer}>
                        <Ionicons name="receipt-outline" size={30} color={Colors.textSecondary} />
                        <Text style={styles.estadoTitulo}>Nenhuma movimentação</Text>
                        <Text style={styles.estadoTexto}>Não há movimentações para exibir neste filtro e período.</Text>
                    </View>
                ) : gruposMovimentacoes.map((grupo, indexGrupo) => (
                    <View key={grupo.chaveData + indexGrupo}>
                        <View style={styles.containerInfoDia}>
                            <Text style={styles.txtInfoDia}>{formatarData(grupo.dataRegistro)}</Text>
                        </View>

                        {grupo.itens.map((movimento, indexMovimento) => {
                            const ehEntrada = movimento.tabela === "entrada";
                            return (
                                <View style={styles.ContentMove} key={`${grupo.chaveData}-${indexMovimento}`}>
                                    <View style={styles.containerMovimentacao}>
                                        <View style={styles.subContainerMovimentacao}>
                                            <View>
                                                <View style={ehEntrada ? styles.iconeContainerMoviSucess : styles.iconeContainerMoviError}>
                                                    <Ionicons name={ehEntrada ? "arrow-up" : "arrow-down"} size={20} color={ehEntrada ? Colors.success : Colors.error} />
                                                </View>
                                            </View>

                                            <View style={styles.containerInformacao}>
                                                <View style={styles.containerDadosMovi}>
                                                    <View style={styles.textosMovimentacao}>
                                                        <Text style={styles.txtInfoNome} numberOfLines={1}>{movimento.nome}</Text>
                                                        <View style={styles.contTypeTable}>
                                                            <Text style={styles.txtInfo}>{ehEntrada ? "Entrada" : movimento.tabela === "saida" ? "Saída" : "Indefinido"}</Text>
                                                            <View style={styles.circuloText} />
                                                            <Text style={styles.txtInfo}>{formatarTipo(movimento.tipo)}</Text>
                                                        </View>
                                                        <Text style={styles.txtInfo}>{formatarHorario(movimento.dataRegistro)}</Text>
                                                    </View>
                                                    <Text style={[styles.valueMove, { color: ehEntrada ? Colors.success : Colors.error }]}>
                                                        {ehEntrada ? "+ " : "- "}{formatarDinheiro(movimento.valor)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {indexMovimento < grupo.itens.length - 1 && (
                                        <View style={styles.containerLine}>
                                            <View style={styles.contentImgLine}>
                                                <View style={styles.imgLine} />
                                            </View>
                                            <View style={styles.line} />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </LinearGradient>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1 },

    contentContainer: { width: "100%", flexGrow: 1, paddingBottom: 28 },
    contPadding: { paddingHorizontal: 16, paddingTop: 24 },
    headerContainer: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 12, marginTop: 20 },

    backButton: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },

    headerTitle: { fontFamily: "PlusJakartaBold", color: Colors.text, fontSize: 22 },

    headerSubTitle: { fontFamily: "PlusJakartaMedium", color: Colors.textSecondary, fontSize: 12, marginTop: 3 },

    containerButtons: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#EEF2F7", borderRadius: 14, padding: 4, marginTop: 22, marginBottom: 18, minHeight: 46 },

    button: { backgroundColor: "transparent", paddingHorizontal: 8, paddingVertical: 10, alignItems: "center", justifyContent: "center", flex: 1, borderRadius: 11 },

    buttonSelect: { backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 10, alignItems: "center", justifyContent: "center", flex: 1, borderRadius: 11 },

    textBtn: { fontSize: 12, fontFamily: "PlusJakartaSemiBold", color: Colors.textSecondary },

    textBtnSelect: { fontSize: 12, fontFamily: "PlusJakartaBold", color: "#FFFFFF" },

    containerDados: { flexDirection: "row", justifyContent: "space-between", gap: 8, width: "100%" },

    containerMGS: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 12, flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", backgroundColor: Colors.surface, borderColor: Colors.border, borderRadius: 14, flex: 1, minWidth: 0, minHeight: 91 },

    iconeContainerSucess: { width: 27, height: 27, borderRadius: 14, backgroundColor: Colors.success, justifyContent: "center", alignItems: "center" },

    iconeContainerError: { width: 27, height: 27, borderRadius: 14, backgroundColor: Colors.error, justifyContent: "center", alignItems: "center" },

    iconeContainerSaldo: { width: 27, height: 27, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" },

    subContainerDados: { flexDirection: "column", marginLeft: 5, marginTop: 8 },
    titleDados: { fontFamily: "PlusJakartaMedium", color: Colors.textSecondary, fontSize: 11, marginBottom: 4 },

    titleValue: { fontFamily: "PlusJakartaBold", fontSize: 13, marginBottom: 0, flexShrink: 1 },

    iconeContainerMoviSucess: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#DBF2E6", justifyContent: "center", alignItems: "center", marginLeft: 4, marginRight: 14 },
    
    iconeContainerMoviError: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FEE2E3", justifyContent: "center", alignItems: "center", marginLeft: 4, marginRight: 14 },

    valueMove: { fontFamily: "PlusJakartaBold", fontSize: 14, marginRight: 0, flexShrink: 1, textAlign: "right" },

    ContentMove: { width: "100%", alignItems: "center", flexDirection: "column", justifyContent: "center" },

    containerMovimentacao: { paddingHorizontal: 12, paddingVertical: 13, backgroundColor: Colors.surface, width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center" },

    subContainerMovimentacao: { flexDirection: "row", alignItems: "center", width: "100%" },

    containerInformacao: { flex: 1, minWidth: 0 },

    containerDadosMovi: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, width: "100%" },
    textosMovimentacao: { flex: 1, minWidth: 0 },

    containerLine: { paddingLeft: 5, paddingRight: 16, flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: Colors.surface, paddingBottom: 1 },

    contentImgLine: { alignItems: "center" },

    imgLine: { width: 40, marginLeft: 4, marginRight: 14 },

    line: { height: 1, flex: 1, backgroundColor: "#E8EDF3" },

    circuloText: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 6, backgroundColor: Colors.textSecondary },

    contTypeTable: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginTop: 3, marginBottom: 3 },

    containerInfoDia: { marginTop: 23, marginBottom: 3, marginHorizontal: 18 },
    txtInfoDia: { fontFamily: "PlusJakartaBold", fontSize: 12, color: Colors.textSecondary, marginBottom: 5 },

    txtInfoNome: { fontFamily: "PlusJakartaSemiBold", fontSize: 14, color: Colors.text },

    txtInfo: { color: Colors.textSecondary, fontFamily: "PlusJakartaMedium", fontSize: 11 },

    estadoContainer: { alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingVertical: 36, marginHorizontal: 16, marginTop: 12, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, gap: 8 },

    estadoTitulo: { fontFamily: "PlusJakartaBold", fontSize: 14, color: Colors.text, textAlign: "center" },
    
    estadoTexto: { fontFamily: "PlusJakartaMedium", fontSize: 12, lineHeight: 18, color: Colors.textSecondary, textAlign: "center" },
});
