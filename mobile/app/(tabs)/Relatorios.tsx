import { Colors } from "@/constants/Colors";
import { useData } from "@/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store"
import Svg, { Circle, G, Path } from "react-native-svg";
import GraficoPizza from "../../components/GraficoPizza";



export default function() {

    //////////////////
    //  ESTADOS
    //////////////////

    const [token, setToken] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    //////////////////
    //  ESTADOS ENTRADAS
    //////////////////

    const [valorTotalEntrada, setValorTotalEntrada] = useState("")
    const [valorSalario, setValorSalario] = useState("")
    const [valorExtra, setValorExtra] = useState("")
    const [valorRendimento, setValorRendimento] = useState("")

     //////////////////
    //  ESTADOS SAIDAS
    //////////////////

    const [valorTotalSaida, setValorTotalSaida] = useState("")
    const [valorFixo, setValorFixo] = useState("")
    const [valorVariavel, setValorVariavel] = useState("")
    const [valorInvestimento, setValorInvestimento] = useState("")

    //////////////////


    const { data, setData } = useData();

    const dataReferencia =
    data instanceof Date && !Number.isNaN(data.getTime()) ? data : new Date();const [mostrarPicker, setMostrarPicker] = useState(false);
    
    

const API_URL = 'http://192.168.15.6:8080';
     
type entradasDados = {
  valorTotal: string | number | null;
  valorSalario: string | number | null;
  valorExtra: string | number | null;
  valorRendimento: string | number | null;
  porcentagemDiferenca: string | number | null;
};

type saidasDados = {
  valorTotal: string | number | null;
  valorFixo: string | number | null;
  valorVariavel: string | number | null;
  valorInvestimentos    : string | number | null;
  porcentagemDiferenca: string | number | null;
};
    

    const dadosEntradas = [
        {
            nome: 'Salário',
            porcentagem: Number(formatarPorcentagem(valorTotalEntrada, valorSalario)),
            cor: Colors.success
        },
        {
            nome: 'Extra',
            porcentagem: Number(formatarPorcentagem(valorTotalEntrada, valorExtra)),
            cor: '#1476FD'
        },
        {
            nome: 'Rendimento',
            porcentagem: Number(formatarPorcentagem(valorTotalEntrada, valorRendimento)),
            cor: '#6C35F3'
        }
    ]

    
    const dadosSaidas = [
        {
            nome: 'Fixo',
            porcentagem: Number(formatarPorcentagem(valorTotalSaida, valorSalario)),
            cor: Colors.error
        },
        {
            nome: 'Variável',
            porcentagem: Number(formatarPorcentagem(valorTotalSaida, valorVariavel)),
            cor: '#FA982F'
        },
        {
            nome: 'Investimento',
            porcentagem: Number(formatarPorcentagem(valorTotalSaida, valorInvestimento)),
            cor: '#7D47D7'
        }
    ]

    const requisicaoPost = useCallback(async <T,>(endpoint: string): Promise<T> => {
        if (!token) throw new Error('Token de autenticação não encontrado.');
    
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token, data: dataReferencia }),
        });
    
        if (!response.ok) {
          throw new Error(`Erro na requisição ${endpoint}: HTTP ${response.status}`);
        }
        return response.json() as Promise<T>;
      }, [token, dataReferencia]);
    
      const carregarDashboard = useCallback(async () => {
        if (!token) {
          setErro('Não foi possível identificar sua sessão.');
          return;
        }
    
        setCarregando(true);
        setErro('');
        try {
          const [entradas, saidas] = await Promise.all([
            requisicaoPost<entradasDados>('/api/dadosEntrada'),
            requisicaoPost<saidasDados>('/api/dadosSaida'),
          ]);

        //////
        // ENTRAdAS
        /////

        setValorTotalEntrada(String(entradas.valorTotal ?? 0));
        setValorSalario(String(entradas.valorSalario ?? 0));
        setValorExtra(String(entradas.valorExtra ?? 0));
        setValorRendimento(String(entradas.valorRendimento ?? 0));

        /////
        // SAIDAS
        /////
        
        setValorTotalSaida(String(saidas.valorTotal ?? 0));
        setValorFixo(String(saidas.valorFixo ?? 0));
        setValorVariavel(String(saidas.valorVariavel ?? 0));
        setValorInvestimento(String(saidas.valorInvestimentos ?? 0));
        
        
     
          
        } catch (error) {
          console.error('Erro ao carregar dashboard:', error);
          setErro('Não foi possível atualizar os dados financeiros.');
        } finally {
          setCarregando(false);
        }
      }, [token, requisicaoPost]);
    
      useFocusEffect(useCallback(() => {

        getToken();

        carregarDashboard();

      }, []));

      useEffect(() => {
        carregarDashboard();

        console.log(valorTotalEntrada)
        console.log(valorSalario)
        console.log(valorExtra)
        console.log(valorRendimento)
        console.log(valorTotalSaida)
        console.log(valorFixo)
        console.log(valorVariavel)
        console.log(valorInvestimento)

        }, [dataReferencia, token, carregarDashboard, valorTotalEntrada, valorTotalSaida]);

    const getToken = async () => {
        const token = await SecureStore.getItemAsync(
            "tokenLogin", 
            )
        if (!token) {
            return "Token inválido"
        }
        setToken(token)

    }

    function selecionarData(event: { type: string }, selectedDate?: Date) {
        setMostrarPicker(false);
        if (event.type === 'set' && selectedDate) setData(selectedDate);
    }

    function formatarData (date: Date): string {

        let month = date.toLocaleDateString('pt-br', {month: 'long'})
        let year = date.getFullYear();

        return month.charAt(0).toUpperCase() + month.slice(1) + " " + year

    }

    function formatarDinheiro(valor: string | number | null | undefined): string {
        const numero = Number(valor ?? 0);
        return (Number.isFinite(numero) ? numero : 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    function formatarPorcentagem(
        valorTotal: string | number | null | undefined,
        valorParte: string | number | null | undefined
    ): string {
        const numeroValorTotal = Number(valorTotal ?? 0)
        const numeroValorParte = Number(valorParte ?? 0)
        const percentual = (numeroValorParte / numeroValorTotal) * 100
        return `${String(percentual)}`
    }

    
    function formatarPorcentagemFormatada(
        valorTotal: string | number | null | undefined,
        valorParte: string | number | null | undefined
    ): string {
        const numeroValorTotal = Number(valorTotal ?? 0)
        const numeroValorParte = Number(valorParte ?? 0)
        const percentual = Math.trunc((numeroValorParte / numeroValorTotal) * 100)
        return `${String(percentual)}%`
    }

    return(
        <LinearGradient colors={[Colors.background, Colors.surface, Colors.surface]} style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {
                    //////////////////////////
                    // HEADER
                    //////////////////////////

                    <View style={styles.containerHeader}>

                        <TouchableOpacity
                            style={styles.backButton}
                            accessibilityRole="button"
                            accessibilityLabel="Voltar"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="chevron-back" size={22} color={Colors.primary} />
                        </TouchableOpacity>
                        
                        <View>
                            <Text style={styles.headerTextTitle}>
                                Relatórios
                            </Text>
    
                            <Text style={styles.headerTextSubTitle}>
                                Veja como está o seu dinheiro
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.selectDate}>
                            <Ionicons name="calendar-outline" size={12} color={Colors.primary} style={{marginLeft: 5}} />
                            <Text style={styles.textDate}>{formatarData(dataReferencia)}
                            </Text>
                            <Ionicons name="chevron-down-outline" size={13} color={Colors.textSecondary} style={{marginRight: 5}}/>
                        </TouchableOpacity>

                        <View>
                            {mostrarPicker && (
                            <DateTimePicker
                                value={dataReferencia}
                                mode="date"
                                display="default"
                                onChange={selecionarData}
                                maximumDate={new Date()}
                            />
                            )}
                        </View>

                    </View>
                }

                {
                    //////////////////////////
                    // ENTRADAS
                    //////////////////////////

                    <View>

                        {
                        //////////////////////////
                        // HEADER 
                        //////////////////////////
                        }

                        <View style={[styles.headerDados, {backgroundColor: '#F3FBFC'}, {borderColor: '#e0eaeb'}]}>

                            <View style={styles.contentHeaderEntrada}>


                                <View style={styles.contentTitle}>
                                    <View style={[styles.iconArrow, { backgroundColor: Colors.success }]}>
                                        <Ionicons name="arrow-forward" color={Colors.surface} size={20} style={{ transform: [{ rotate: "-45deg" }] }}></Ionicons>
                                    </View>
                                    <View>
                                        <Text style={styles.entradaTextTitle}>
                                            Entradas
                                        </Text>
                                        <Text style={styles.entradaTextSubTitle}>
                                            De onde vem o seu dinheiro
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.contentTotValue}>
                                    <Text style={styles.entradaTextSubTitle}>Total</Text>
                                    <Text style={styles.valorTotalText}>{formatarDinheiro(valorTotalEntrada)}</Text>
                                </View>


                            </View>

                            
                            {
                                //////////////////////////
                                // DADOS 
                                //////////////////////////
                            }

                            <View style={styles.containerDados}>


                                <GraficoPizza
                                    dados={dadosEntradas}
                                    tamanho={120}
                                    espessura={25}
                                >
                                </GraficoPizza>

                                 {
                                    //////////////////////////
                                    // SALÁRIO 
                                    //////////////////////////
                                }

                                <View style={styles.subContainerDados}> 
                                    <View style={styles.containerTipos}>
                                        <View style={styles.contentType}>
                                            <View style={styles.nameType}>
                                                <View style={[styles.circleType, {backgroundColor: Colors.success}]}></View>
                                                <Text style={styles.textType}>Salário</Text>
                                            </View>
                                            <View style={styles.valueType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaBold'}]}> {formatarDinheiro(valorSalario)} </Text>
                                            </View>

                                             <View  style={styles.perType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaMedium'}, {color: Colors.textSecondary}]}>{formatarPorcentagemFormatada(valorTotalEntrada, valorSalario)}</Text>
                                            </View>

                                        </View>
                                    </View>

                                    <View  style={styles.alinhaLine}>
                                        <View style={[styles.espacoLine]}></View>
                                        <View style={styles.line}></View>
                                    </View>
                                    {
                                        //////////////////////////
                                        // EXTRA
                                        //////////////////////////
                                    }
                                    <View style={styles.containerTipos}>
                                        <View style={styles.contentType}>
                                            <View style={styles.nameType}>
                                                <View style={[styles.circleType, {backgroundColor: '#1476FD'}]}></View>
                                                <Text style={styles.textType}>Extra</Text>
                                            </View>

                                            <View style={styles.valueType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaBold'}]}> {formatarDinheiro(valorExtra)} </Text>
                                            </View>

                                            <View  style={styles.perType}> 
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaMedium'}, {color: Colors.textSecondary}]}> {formatarPorcentagemFormatada(valorTotalEntrada, valorExtra)}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View  style={styles.alinhaLine}>
                                        <View style={[styles.espacoLine]}></View>
                                        <View style={styles.line}></View>
                                    </View>

                                    {
                                        //////////////////////////
                                        // RENDIMENTO
                                        //////////////////////////
                                    }
                                    <View style={styles.containerTipos}>
                                        <View style={styles.contentType}>
                                            <View style={styles.nameType}>
                                                <View style={[styles.circleType, {backgroundColor: '#6C35F3'}]}></View>
                                                <Text style={styles.textType}>Rendimento</Text>
                                            </View>
                                            <View style={styles.valueType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaBold'}]}>  {formatarDinheiro(valorRendimento)}  </Text>
                                            </View>

                                            <View style={styles.perType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaMedium'}, {color: Colors.textSecondary}]}>  {formatarPorcentagemFormatada(valorTotalEntrada, valorRendimento)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>

                            </View>
                    </View>

                }


                 {
                    //////////////////////////
                    // SAIDAS
                    //////////////////////////

                    <View>

                        {
                        //////////////////////////
                        // HEADER 
                        //////////////////////////
                        }

                        <View style={[styles.headerDados, {backgroundColor: '#fcf3f3'}, {borderColor: '#e0eaeb'}]}>

                            <View style={styles.contentHeaderEntrada}>


                                <View style={styles.contentTitle}>
                                    <View style={[styles.iconArrow, { backgroundColor: Colors.error }]}>
                                        <Ionicons name="arrow-forward" color={Colors.surface} size={20} style={{ transform: [{ rotate: "90deg" }] }}></Ionicons>
                                    </View>
                                    <View>
                                        <Text style={styles.entradaTextTitle}>
                                            Saídas
                                        </Text>
                                        <Text style={styles.entradaTextSubTitle}>
                                            Para onde vai o seu dinheiro.
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.contentTotValue}>
                                    <Text style={[styles.entradaTextSubTitle, {color:Colors.error} ]}>Total</Text>
                                    <Text style={[styles.valorTotalText, {color:Colors.error}]}>{formatarDinheiro(valorTotalSaida)}</Text>
                                </View>


                            </View>

                            
                            {
                                //////////////////////////
                                // DADOS 
                                //////////////////////////
                            }

                            <View style={styles.containerDados}>

                                
                                <GraficoPizza
                                    dados={dadosSaidas}
                                    tamanho={120}
                                    espessura={25}
                                >
                                </GraficoPizza>

                                 {
                                    //////////////////////////
                                    // FIXO 
                                    //////////////////////////
                                }

                                <View style={styles.subContainerDados}> 
                                    <View style={styles.containerTipos}>
                                        <View style={styles.contentType}>
                                            <View style={styles.nameType}>
                                                <View style={[styles.circleType, {backgroundColor: Colors.error}]}></View>
                                                <Text style={styles.textType}>Fixo</Text>
                                            </View>
                                            <View style={styles.valueType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaBold'}]}> {formatarDinheiro(valorFixo)} </Text>
                                            </View>

                                            <View style={styles.perType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaMedium'}, {color: Colors.textSecondary}]}> {formatarPorcentagemFormatada(valorTotalSaida, valorFixo)}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View  style={styles.alinhaLine}>
                                        <View style={[styles.espacoLine]}></View>
                                        <View style={styles.line}></View>
                                    </View>
                                    {
                                        //////////////////////////
                                        // VARIÁVEL
                                        //////////////////////////
                                    }
                                    <View style={styles.containerTipos}>
                                        <View style={styles.contentType}>
                                            <View style={styles.nameType}>
                                                <View style={[styles.circleType, {backgroundColor: '#FA982F'}]}></View>
                                                <Text style={styles.textType}>Variável</Text>
                                            </View>
                                            <View style={styles.valueType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaBold'}]}> {formatarDinheiro(valorVariavel)} </Text>
                                            </View>
                                            <View style={styles.perType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaMedium'}, {color: Colors.textSecondary}]}> {formatarPorcentagemFormatada(valorTotalSaida, valorVariavel)}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View  style={styles.alinhaLine}>
                                        <View style={[styles.espacoLine]}></View>
                                        <View style={styles.line}></View>
                                    </View>

                                    {
                                        //////////////////////////
                                        // INVESTIMENTO
                                        //////////////////////////
                                    }
                                    <View style={styles.containerTipos}>
                                        <View style={styles.contentType}>
                                            <View style={styles.nameType}>
                                                <View style={[styles.circleType, {backgroundColor: '#7D47D7'}]}></View>
                                                <Text style={styles.textType}>Investimento</Text>
                                            </View>
                                            <View style={styles.valueType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaBold'}]}> {formatarDinheiro(valorInvestimento)} </Text>
                                            </View>

                                            <View style={styles.perType}>
                                                <Text style={[styles.textType, {fontFamily: 'PlusJakartaMedium'}, {color: Colors.textSecondary}]}> {formatarPorcentagemFormatada(valorTotalSaida, valorInvestimento)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>

                            </View>
                    </View>

                }

            </ScrollView>

        </LinearGradient>

     
    )
}


    const styles = StyleSheet.create({
        container: { flex: 1 },

        scrollContent: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28, marginTop: 15 },
       
        containerHeader: {
              flexDirection: "row",
            alignItems: "flex-end",
            gap: 12,
            marginTop: 20,
            width: "100%",
        },

        backButton: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },

        headerTextTitle: {
            fontFamily: "PlusJakartaBold", color: Colors.text, fontSize: 22 
        },

        headerTextSubTitle: {
            fontFamily: "PlusJakartaMedium", color: Colors.textSecondary, fontSize: 12, marginTop: 3
        },

         selectDate: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            flex: 1,
            gap: 5,
            borderWidth: 1,
            minHeight: 38,
            borderRadius: 12,
            borderColor: Colors.border,
            backgroundColor: Colors.surface,
        },

        textDate: {
            fontFamily: "PlusJakartaMedium",
            color: Colors.primary,
            fontSize: 12,
            flexShrink: 1,
            textAlign: "center",
        },

        headerDados: {
            marginTop: 20,
            flexDirection: 'column',
            padding: 10,
            borderWidth: 1,
            borderRadius: 15
        },

        contentTitle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        contentHeaderEntrada: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        contentTotValue: {
            marginRight: 10,
        },

        iconArrow: {
            width: 35,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            marginRight: 10
        },

        entradaTextTitle: {
            fontFamily: "PlusJakartaBold", color: Colors.text, fontSize: 16
        },

        entradaTextSubTitle: {
            fontFamily: "PlusJakartaMedium", color: Colors.textSecondary, fontSize: 10, marginTop: 3
        },

        valorTotalText: {
            fontFamily: 'PlusJakartaBold',
            color:Colors.success,
            marginLeft: 5,
            marginTop: -5,
            fontSize: 18
        },

        subContainerDados: {
            marginTop: 20,
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#efefefa8',
            padding: 5,
            backgroundColor: Colors.background,
            boxShadow: '1px 4px 10px #0000000f'
        },

        containerDados: {
             flexDirection: 'column',
            marginTop: 20,
            alignItems: 'center',
            width: '100%',
            minWidth: 0,
        },

        containerTipos: {
            flex: 1,
            minWidth: 0,
            flexDirection: 'column',
            backgroundColor: Colors.background,
            height: '80%',
            padding: 5,
        },

        contentType: {
           flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: 0,
            gap: 5,
        },

        nameType: {
            flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start', flex: 1, gap: 10
            //borderWidth: 1
        },

        valueType: {
            //borderWidth: 1, 
            flex: 1, alignItems: 'center'
        },

        perType: {
            //borderWidth: 1, 
            flex: 0.5, alignItems: 'flex-end',
        },

        circleType: {
            width: 15,
            height: 15,
            borderRadius: '100%'
        },

        textType: {
            fontFamily: 'PlusJakartaMedium',
            fontSize: 14,
            color: Colors.text
        },

        alinhaLine: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: Colors.background,
            //borderWidth: 1,
            
            //padding: 5,

        },

        espacoLine: {
            width: 15,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: '100%'
        },

        line: {flex: 1, height: 1, backgroundColor: "#c8c6c6", marginRight: 5
        },

        grafico: {
            width: 120,
            height: 120,
            borderWidth:1,
            borderRadius: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
            marginRight: 20,
        },

        

    }) 