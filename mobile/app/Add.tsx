import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Image,
    KeyboardAvoidingView
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function Add() {

    const { escolha, token } = useLocalSearchParams<{
        escolha: "DESPESA" | "RECEITA",
        token: string
    }>()


    // =========================
    // DADOS DOS INPUTS
    // =========================

    const [nome, setNome] = useState("");
    const [data, setData] = useState(new Date());

    // Define se é uma saída ou entrada
    const [tipoLancamento, setTipoLancamento] = useState<
        "DESPESA" | "RECEITA" 
    >("DESPESA");


    // Define o tipo da entrada/saída
    const [tipo, setTipo] = useState("");

    const [valor, setValor] = useState("");
    const [observacao, setObservacao] = useState("");

    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);


    // =========================
    // MENSAGENS DE ERRO
    // =========================

    const [mostrarMsgNome, setMostrarMsgNome] = useState(false);
    const [msgNome, setMsgNome] = useState("");

    //const [mostrarMsgData, setMostrarMsgData] = useState(false);
    //const [msgData, setMsgData] = useState("");

    //const [mostrarMsgTipo, setMostrarMsgTipo] = useState(false);
    //const [msgTipo, setMsgTipo] = useState("");

    const [mostrarMsgValor, setMostrarMsgValor] = useState(false);
    const [msgValor, setMsgValor] = useState("");

    const [mostrarMsgObservacao, setMostrarMsgObservacao] = useState(false);
    const [msgObservacao, setMsgObservacao] = useState("");

    const [mostrarPopUp, setMostrarPopUp] = useState(false);
    const [saidaSalva, setSaidaSalva] = useState(false);
    const [entradaSalva, setEntradaSalva] = useState(false);



    // =========================
    // ALTERAR DESPESA / RECEITA
    // =========================

    const alterarTipoLancamento = (
        novoTipo: "DESPESA" | "RECEITA"
    ) => {

        setTipoLancamento(novoTipo);

        // Limpa o tipo anterior quando troca
        setTipo("");

        // Limpa possível mensagem de erro
        //setMostrarMsgTipo(false);
        //setMsgTipo("");
    };


    // =========================
    // DATA
    // =========================

    const alterarData = (
        event: any,
        selectedDate?: Date
    ) => {

        setMostrarDatePicker(false);

        if (selectedDate) {
            setData(selectedDate);
        }
    };


    // =========================
    // FORMATAÇÃO DA DATA
    // =========================

    const formatarData = (data: Date) => {

        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    };


    // =========================
    // SALVAR
    // =========================

    const salvar = async () => {

        if (tipoLancamento === "DESPESA") {
            const response = await fetch("http://192.168.15.6:8080/api/salvarSaida", {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                token: token,
                nome: nome,
                data: data,
                tipo: tipo,
                valor: valor,
                observacao: observacao
            })
            })

            const resposta = await response.json();

            if (!resposta.nomeCerto) {
                setMostrarMsgNome(true)
                setMsgNome(resposta.mensagemNome)
            }  
            if (!resposta.valorCerto) {
                setMostrarMsgValor(true)
                setMsgValor(resposta.mensagemValor)
            }
            if (!resposta.obsCerto) {
                setMostrarMsgObservacao(true)
                setMsgObservacao(resposta.mensagemObs)
            }
            if (resposta.saidaSalva || !resposta.saidaSalva) {
                setMostrarPopUp(true)
                console.log(resposta.mensagemSucesso)
                setSaidaSalva(resposta.saidaSalva)
                console.log(resposta.mensagemSucesso)
            }
            

        } else if (tipoLancamento === "RECEITA") {
             const response = await fetch("http://192.168.15.6:8080/api/salvarEntrada", {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                token: token,
                nome: nome,
                data: data,
                tipo: tipo,
                valor: valor,
                observacao: observacao
            })
            })

               const resposta = await response.json();

            if (!resposta.nomeCerto) {
                setMostrarMsgNome(true)
                setMsgNome(resposta.mensagemNome)
            }  
            if (!resposta.valorCerto) {
                setMostrarMsgValor(true)
                setMsgValor(resposta.mensagemValor)
            }
            if (!resposta.obsCerto) {
                setMostrarMsgObservacao(true)
                setMsgObservacao(resposta.mensagemObs)
            }
            if (resposta.entradaSalva || !resposta.entradaSalva) {
                setMostrarPopUp(true)
                console.log(resposta.mensagemSucesso)
                setEntradaSalva(resposta.entradaSalva)
                console.log(resposta.mensagemSucesso)
            }

        }
        
    }

    useEffect(() => {
        if (escolha) {
            setTipoLancamento(escolha)
        }
    }, [escolha])

    const backDash = async () => {
        router.back()
    }

    return (
        <KeyboardAvoidingView
                behavior='height'
                style={{flex: 1}}
        >
            <View style={{flex: 1}}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* =========================
                        CABEÇALHO
                    ========================= */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons
                                name="arrow-back"
                                size={27}
                                color="#0F172A"
                                onPress={backDash}
                            />
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>
                                {tipoLancamento === "DESPESA"
                                    ? "Adicionar gasto"
                                    : "Adicionar entrada"
                                }
                            </Text>
                            <Text style={styles.subtitle}>
                                Informe os dados para registrar
                                {tipoLancamento === "DESPESA"
                                    ? " seu gasto."
                                    : " sua entrada."
                                }
                            </Text>
                        </View>
                    </View>
            
                    {/* =========================
                        DESPESA / RECEITA
                    ========================= */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Lançamento
                        </Text>
                        <View style={styles.typeContainer}>
                            {/* DESPESA */}
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    tipoLancamento === "DESPESA" &&
                                    styles.typeButtonSelectedDespesa
                                ]}
                                onPress={() =>
                                    alterarTipoLancamento("DESPESA")
                                }
                            >
                                <Ionicons
                                    name="arrow-down"
                                    size={22}
                                    color={
                                        tipoLancamento === "DESPESA"
                                            ? "#DC2626"
                                            : "#64748B"
                                    }
                                />
                                <Text
                                    style={[
                                        styles.typeText,
                                        tipoLancamento === "DESPESA" &&
                                        styles.typeTextSelectedDespesa
                                    ]}
                                >
                                    Despesa
                                </Text>
                            </TouchableOpacity>
                            {/* RECEITA */}
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    tipoLancamento === "RECEITA" &&
                                    styles.typeButtonSelectedReceita
                                ]}
                                onPress={() =>
                                    alterarTipoLancamento("RECEITA")
                                }
                            >
                                <Ionicons
                                    name="arrow-up"
                                    size={22}
                                    color={
                                        tipoLancamento === "RECEITA"
                                            ? "#16A34A"
                                            : "#64748B"
                                    }
                                />
                                <Text
                                    style={[
                                        styles.typeText,
                                        tipoLancamento === "RECEITA" &&
                                        styles.typeTextSelectedReceita
                                    ]}
                                >
                                    Receita
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* =========================
                        NOME
                    ========================= */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Nome
                        </Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="pricetag-outline"
                                size={23}
                                color="#64748B"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={
                                    tipoLancamento === "DESPESA"
                                        ? "Ex.: Supermercado, Conta de luz..."
                                        : "Ex.: Salário, Freelance..."
                                }
                                placeholderTextColor="#94A3B8"
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>
                        {mostrarMsgNome && (
                            <View style={styles.errorContainer}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#DC2626"
                                />
                                <Text style={styles.errorText}>
                                    {msgNome}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* =========================
                        DATA
                    ========================= */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Data
                        </Text>
                        <TouchableOpacity
                            style={styles.inputWrapper}
                            onPress={() => setMostrarDatePicker(true)}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={23}
                                color="#64748B"
                            />
                            <Text style={styles.dateText}>
                                {formatarData(data)}
                            </Text>
                            <Ionicons
                                name="calendar-outline"
                                size={23}
                                color="#64748B"
                            />
                        </TouchableOpacity>
                        {mostrarDatePicker && (
                            <DateTimePicker
                                value={data}
                                mode="date"
                                display={
                                    Platform.OS === "ios"
                                        ? "spinner"
                                        : "default"
                                }
                                onValueChange={alterarData}
                            />
                        )}
                        {/*mostrarMsgData && (
                            <View style={styles.errorContainer}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#DC2626"
                                />
                                <Text style={styles.errorText}>
                                    {msgData}
                                </Text>
                            </View>
                        )*/}
                    </View>
                    {/* =========================
                        TIPO DA ENTRADA / SAÍDA
                    ========================= */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Tipo
                        </Text>
                        <View style={styles.categoryContainer}>
                            {tipoLancamento === "DESPESA" ? (
                                <>
                                    {/* FIXO */}
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            tipo === "FIXO" &&
                                            styles.categorySelectedDespesa
                                        ]}
                                        onPress={() => setTipo("FIXO")}
                                    >
                                        <Ionicons
                                            name="repeat-outline"
                                            size={20}
                                            color={
                                                tipo === "FIXO"
                                                    ? "#DC2626"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                tipo === "FIXO" &&
                                                styles.categoryTextSelectedDespesa
                                            ]}
                                        >
                                            Fixo
                                        </Text>
                                    </TouchableOpacity>
                                    {/* VARIÁVEL */}
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            tipo === "VARIAVEL" &&
                                            styles.categorySelectedDespesa
                                        ]}
                                        onPress={() => setTipo("VARIAVEL")}
                                    >
                                        <Ionicons
                                            name="swap-vertical-outline"
                                            size={20}
                                            color={
                                                tipo === "VARIAVEL"
                                                    ? "#DC2626"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                tipo === "VARIAVEL" &&
                                                styles.categoryTextSelectedDespesa
                                            ]}
                                        >
                                            Variável
                                        </Text>
                                    </TouchableOpacity>
                                    {/* INVESTIMENTO */}
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            tipo === "INVESTIMENTO" &&
                                            styles.categorySelectedDespesa
                                        ]}
                                        onPress={() =>
                                            setTipo("INVESTIMENTO")
                                        }
                                    >
                                        <Ionicons
                                            name="trending-up-outline"
                                            size={20}
                                            color={
                                                tipo === "INVESTIMENTO"
                                                    ? "#DC2626"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                tipo === "INVESTIMENTO" &&
                                                styles.categoryTextSelectedDespesa
                                            ]}
                                        >
                                            Investimento
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    {/* SALÁRIO */}
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            tipo === "SALARIO" &&
                                            styles.categorySelectedReceita
                                        ]}
                                        onPress={() => setTipo("SALARIO")}
                                    >
                                        <Ionicons
                                            name="briefcase-outline"
                                            size={20}
                                            color={
                                                tipo === "SALARIO"
                                                    ? "#16A34A"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                tipo === "SALARIO" &&
                                                styles.categoryTextSelectedReceita
                                            ]}
                                        >
                                            Salário
                                        </Text>
                                    </TouchableOpacity>
                                    {/* EXTRA */}
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            tipo === "EXTRA" &&
                                            styles.categorySelectedReceita
                                        ]}
                                        onPress={() => setTipo("EXTRA")}
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={20}
                                            color={
                                                tipo === "EXTRA"
                                                    ? "#16A34A"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                tipo === "EXTRA" &&
                                                styles.categoryTextSelectedReceita
                                            ]}
                                        >
                                            Extra
                                        </Text>
                                    </TouchableOpacity>
                                    {/* RENDIMENTO */}
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            tipo === "RENDIMENTO" &&
                                            styles.categorySelectedReceita
                                        ]}
                                        onPress={() =>
                                            setTipo("RENDIMENTO")
                                        }
                                    >
                                        <Ionicons
                                            name="trending-up-outline"
                                            size={20}
                                            color={
                                                tipo === "RENDIMENTO"
                                                    ? "#16A34A"
                                                    : "#64748B"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                tipo === "RENDIMENTO" &&
                                                styles.categoryTextSelectedReceita
                                            ]}
                                        >
                                            Rendimento
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        {/*mostrarMsgTipo && (
                            <View style={styles.errorContainer}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#DC2626"
                                />
                                <Text style={styles.errorText}>
                                    {msgTipo}
                                </Text>
                            </View>
                        )*/}
                    </View>
                    {/* =========================
                        VALOR
                    ========================= */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Valor
                        </Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="cash-outline"
                                size={23}
                                color="#64748B"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex.: 50,00"
                                placeholderTextColor="#94A3B8"
                                value={valor}
                                onChangeText={setValor}
                                keyboardType="decimal-pad"
                            />
                        </View>
                        {mostrarMsgValor && (
                            <View style={styles.errorContainer}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#DC2626"
                                />
                                <Text style={styles.errorText}>
                                    {msgValor}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* =========================
                        OBSERVAÇÃO
                    ========================= */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Observação
                        </Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                styles.observacaoWrapper
                            ]}
                        >
                            <Ionicons
                                name="document-text-outline"
                                size={23}
                                color="#64748B"
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.observacaoInput
                                ]}
                                placeholder="Adicione uma observação (opcional)..."
                                placeholderTextColor="#94A3B8"
                                value={observacao}
                                onChangeText={setObservacao}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                        {mostrarMsgObservacao && (
                            <View style={styles.errorContainer}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={16}
                                    color="#DC2626"
                                />
                                <Text style={styles.errorText}>
                                    {msgObservacao}
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* =========================
                        SALVAR
                    ========================= */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={salvar}
                    >
                        <Text style={styles.saveButtonText}>
                            Salvar
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
             { mostrarPopUp && (saidaSalva || entradaSalva) && (
                <View style={styles.overlay}>
                    <View style={styles.popUp}>
                        <Image style={styles.imgPop} source={require("../assets/images/correct(2).png")}></Image>
                        <Text style={styles.titlePop}>{tipoLancamento === 'DESPESA' ? "Saída" : "Entrada"} registrada com sucesso!</Text>
                        <Text style={styles.subTitlePop}> Sua {tipoLancamento === 'DESPESA' ? "saída" : "entrada"} foi adicionada ao seu saldo corretamente.</Text>
            
                        <TouchableOpacity
                        style={styles.okButton}
                        onPress={backDash}
                        >
                        <Text style={styles.okButtonText}>
                            Ok
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 40,
    },

    // ocupa a tela inteira e centraliza o pop-up
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#3c434f91'
    },

    popUp: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        width: '70%',
        padding: 20,
        borderRadius: 20,
        backgroundColor: Colors.surface
    },

    imgPop: {
        width: 50, 
        height: 50
    },

    titlePop: {
        fontFamily: "PlusJakartaBold",
        color: Colors.text,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,

    },
    
    subTitlePop: {
        fontFamily: "PlusJakartaMedium",
        color: Colors.textSecondary,
        textAlign: 'center',
        fontSize: 12,

    },

    okButton: {
        backgroundColor: Colors.primary,
        width: '100%',
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },

    okButtonText: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.surface
    },

    // HEADER

    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 30,
    },

    backButton: {
        marginTop: 4,
        marginRight: 18,
    },

    headerText: {
        flex: 1,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 23,
        color: "#64748B",
    },


    // CONTAINERS

    inputContainer: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
    },

    label: {
        fontSize: 17,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 12,
    },


    // INPUT

    inputWrapper: {
        minHeight: 58,
        borderWidth: 1.5,
        borderColor: "#D6E0EF",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#0F172A",
        marginLeft: 13,
    },

    dateText: {
        flex: 1,
        fontSize: 16,
        color: "#0F172A",
        marginLeft: 13,
    },


    // DESPESA / RECEITA

    typeContainer: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 17,
        padding: 4,
    },

    typeButton: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },

    typeButtonSelectedDespesa: {
        backgroundColor: "#FFF1F2",
        borderWidth: 1.5,
        borderColor: "#FECDD3",
    },

    typeButtonSelectedReceita: {
        backgroundColor: "#F0FDF4",
        borderWidth: 1.5,
        borderColor: "#BBF7D0",
    },

    typeText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#64748B",
    },

    typeTextSelectedDespesa: {
        color: "#DC2626",
    },

    typeTextSelectedReceita: {
        color: "#16A34A",
    },


    // TIPO DA ENTRADA / SAÍDA

    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    categoryButton: {
        flex: 1,
        minWidth: "30%",
        minHeight: 58,
        borderWidth: 1.5,
        borderColor: "#D6E0EF",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 5,
    },

    categorySelectedDespesa: {
        backgroundColor: "#FFF1F2",
        borderColor: "#FECDD3",
    },

    categorySelectedReceita: {
        backgroundColor: "#F0FDF4",
        borderColor: "#BBF7D0",
    },

    categoryText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#64748B",
        textAlign: "center",
    },

    categoryTextSelectedDespesa: {
        color: "#DC2626",
    },

    categoryTextSelectedReceita: {
        color: "#16A34A",
    },


    // OBSERVAÇÃO

    observacaoWrapper: {
        minHeight: 110,
        alignItems: "flex-start",
        paddingTop: 16,
    },

    observacaoInput: {
        height: 90,
    },


    // ERROS

    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 5,
    },

    errorText: {
        flex: 1,
        color: "#DC2626",
        fontSize: 13,
    },


    // BOTÃO

    saveButton: {
        height: 60,
        borderRadius: 18,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: 'PlusJakartaBold'
    },
});
