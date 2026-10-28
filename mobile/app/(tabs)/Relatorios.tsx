import { Colors } from "@/constants/Colors";
import { useData } from "@/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store"
import GraficoPizza from "../../components/GraficoPizza";



export default function() {

    //////////////////
    //  ESTADOS
    //////////////////

    const [token, setToken] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const requestId = useRef(0)

    //////////////////
    //  ESTADOS ENTRADAS
    //////////////////

    const [valorTotalEntrada, setValorTotalEntrada] = useState("")
    const [valorSalario, setValorSalario] = useState("")
    const [valorExtra, setValorExtra] = useState("")
    const [valorRendimento, setValorRendimento] = useState("")
    const [mostrarMsgEntrada, setMostrarMsgEntrada] = useState(false)
    const [titleEntrada, setTitleEntrada] = useState("")
    const [msgEntrada, setMsgEntrada] = useState("")


    //////////////////
    //  ESTADOS SAIDAS
    //////////////////

    const [valorTotalSaida, setValorTotalSaida] = useState("")
    const [valorFixo, setValorFixo] = useState("")
    const [valorVariavel, setValorVariavel] = useState("")
    const [valorInvestimento, setValorInvestimento] = useState("")
    const [mostrarMsgSaida, setMostrarMsgSaida] = useState(false)
    const [titleGasto, setTitleGasto] = useState("")
    const [msgSaida, setMsgSaida] = useState("")


    
    //////////////////
    //  ESTADOS INVESTIMENTO
    //////////////////

    const [mostrarMsgInvestimentos, setMostrarMsgInvestimentos] = useState(false)
    const [titleInvestimentos, setTitleInvestimentos] = useState("")
    const [msgInvestimentos, setMsgInvestimentos] = useState("")

    //////////////////
    //  SALDO MES
    //////////////////

    const [mostrarMsgSaldo, setMostrarMsgSaldo] = useState(false)
    const [titleSaldo, setTitleSaldo] = useState("")
    const [msgSaldo, setMsgSaldo] = useState("")
    const [tipoSaldo, setTipoSaldo] = useState(false)

    const { data, setData } = useData();

    const dataReferencia = useMemo(
        () => data instanceof Date && !Number.isNaN(data.getTime()) ? data : new Date(),
        [data],
    );
    const [mostrarPicker, setMostrarPicker] = useState(false);
    
    

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
            porcentagem: Number(formatarPorcentagem(valorTotalSaida, valorFixo)),
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

        const idAtual = ++requestId.current
        setCarregando(true)
        setErro('')
        try {
          const [entradas, saidas, investimento] = await Promise.all([
            requisicaoPost<entradasDados>('/api/dadosEntrada'),
            requisicaoPost<saidasDados>('/api/dadosSaida'),
            requisicaoPost<saidasDados>('/api/dadosInvestimentoBefore'),
          ])
          // Ignora respostas antigas se o usuário mudou de período durante a consulta.
          if (idAtual !== requestId.current) return

        //////
        // ENTRAdAS
        /////

        setValorTotalEntrada(String(entradas.valorTotal ?? 0));
        setValorSalario(String(entradas.valorSalario ?? 0));
        setValorExtra(String(entradas.valorExtra ?? 0));
        setValorRendimento(String(entradas.valorRendimento ?? 0));

        const salario = Number(entradas.valorSalario ?? 0)
        const extra = Number(entradas.valorExtra ?? 0)
        const rendimento = Number(entradas.valorRendimento ?? 0)
        const totalEntradas = Number(entradas.valorTotal ?? 0)

        // Uma categoria zerada não deve esconder o insight das outras categorias.
        if (totalEntradas <= 0) {
            setMostrarMsgEntrada(false)
        } else if (salario >= extra && salario >= rendimento) {
            setMostrarMsgEntrada(true)
            setTitleEntrada("Sua principal fonte de renda é o salário.")
            setMsgEntrada(`O salário representa ${formatarPorcentagemFormatada(totalEntradas, salario)} das suas entradas neste mês.`)
        } else if (extra >= salario && extra >= rendimento) {
            setMostrarMsgEntrada(true)
            setTitleEntrada("Você recebe mais dinheiro de serviços extras.")
            setMsgEntrada(`Os extras representam ${formatarPorcentagemFormatada(totalEntradas, extra)} das suas entradas neste mês.`)
        } else {
            setMostrarMsgEntrada(true)
            setTitleEntrada("Você recebe mais dinheiro de rendimentos.")
            setMsgEntrada(`Os rendimentos representam ${formatarPorcentagemFormatada(totalEntradas, rendimento)} das suas entradas neste mês.`)
        }


        /////
        // SAIDAS
        /////
        
        setValorTotalSaida(String(saidas.valorTotal ?? 0));
        setValorFixo(String(saidas.valorFixo ?? 0));
        setValorVariavel(String(saidas.valorVariavel ?? 0));
        setValorInvestimento(String(saidas.valorInvestimentos ?? 0));
        
        const fixo = Number(saidas.valorFixo ?? 0)
        const variavel = Number(saidas.valorVariavel ?? 0)
        const investimentoAtual = Number(saidas.valorInvestimentos ?? 0)
        const totalSaidas = Number(saidas.valorTotal ?? 0)

        // Categorias sem gastos continuam aparecendo na tabela, mas não bloqueiam a análise.
        if (totalSaidas <= 0) {
            setMostrarMsgSaida(false)
        } else if (fixo >= variavel && fixo >= investimentoAtual) {
            setMostrarMsgSaida(true)
            setTitleGasto("Sua maior categoria de gastos é a fixa.")
            setMsgSaida(`Os gastos fixos representam ${formatarPorcentagemFormatada(totalSaidas, fixo)} das suas saídas neste mês.`)
        } else if (variavel >= fixo && variavel >= investimentoAtual) {
            setMostrarMsgSaida(true)
            setTitleGasto("Você gasta mais com valores variáveis.")
            setMsgSaida(`Os gastos variáveis representam ${formatarPorcentagemFormatada(totalSaidas, variavel)} das suas saídas neste mês.`)
        } else {
            setMostrarMsgSaida(true)
            setTitleGasto("Você gasta mais com investimentos.")
            setMsgSaida(`Os investimentos representam ${formatarPorcentagemFormatada(totalSaidas, investimentoAtual)} das suas saídas neste mês.`)
        }
     
        //////
        // COMPARAÇÃO DE INVESTIMENTOS COM O MÊS ANTERIOR
        /////
        const investimentoAnterior = Number(investimento.valorInvestimentos ?? 0)
        const atual = Number(saidas.valorInvestimentos ?? 0)

        if (atual === 0 && investimentoAnterior === 0) {
            setMostrarMsgInvestimentos(false)
            setTitleInvestimentos("")
            setMsgInvestimentos("")
        } else if (atual === 0 && investimentoAnterior > 0) {
            setMostrarMsgInvestimentos(true)
            setTitleInvestimentos("Você não investiu neste mês.")
            setMsgInvestimentos(`No mês anterior, você destinou ${formatarDinheiro(investimentoAnterior)} para investimentos.`)
        } else if (investimentoAnterior === 0 && atual > 0) {
            setMostrarMsgInvestimentos(true)
            setTitleInvestimentos("Você começou a investir neste período.")
            setMsgInvestimentos(`Você destinou ${formatarDinheiro(atual)} para investimentos. Como o mês anterior não teve investimentos, não há uma porcentagem de aumento a calcular.`)
        } else {
            const diferencaValue = ((atual - investimentoAnterior) / investimentoAnterior) * 100
            const percentual = Math.abs(diferencaValue).toFixed(2).replace('.', ',')

            setMostrarMsgInvestimentos(true)
            if (diferencaValue > 0) {
                setTitleInvestimentos("Seus investimentos aumentaram.")
                setMsgInvestimentos(`Você destinou ${percentual}% a mais para investimentos em comparação com ${formatarMes(dataReferencia)}.`)
            } else if (diferencaValue < 0) {
                setTitleInvestimentos("Seus investimentos diminuíram.")
                setMsgInvestimentos(`Você destinou ${percentual}% a menos para investimentos em comparação com ${formatarMes(dataReferencia)}.`)
            } else {
                setTitleInvestimentos("Seus investimentos se mantiveram.")
                setMsgInvestimentos(`Você destinou o mesmo valor para investimentos que em ${formatarMes(dataReferencia)}.`)
            }
        }

        } catch (error) {
          if (idAtual === requestId.current) {
            console.error('Erro ao carregar dashboard:', error)
            setErro('Não foi possível atualizar os dados financeiros.')
          }
        } finally {
          if (idAtual === requestId.current) setCarregando(false)
        }
      }, [token, requisicaoPost])

      // Recarrega o token ao voltar para a tela; a busca dos dados fica em um único efeito.
      useFocusEffect(useCallback(() => {
        let ativo = true
        SecureStore.getItemAsync('tokenLogin')
          .then(tokenSalvo => {
            if (!ativo) return
            if (tokenSalvo) {
              setErro('')
              setToken(tokenSalvo)
              setRefreshKey(chave => chave + 1)
            } else {
              setToken('')
              setErro('Não foi possível identificar sua sessão. Entre novamente.')
            }
          })
          .catch(() => {
            if (ativo) setErro('Não foi possível recuperar sua sessão.')
          })
        return () => { ativo = false }
      }, []))

      useEffect(() => {
        if (token) carregarDashboard()
      }, [token, dataReferencia, refreshKey, carregarDashboard])

      useEffect(() => {
        saldoMes()
      }, [valorTotalEntrada, valorTotalSaida])

    function selecionarData(event: { type: string }, selectedDate?: Date) {
        setMostrarPicker(false)
        if (event.type === 'set' && selectedDate) setData(selectedDate)
    }

    function mudarMes(deslocamento: number) {
        const novaData = new Date(dataReferencia.getFullYear(), dataReferencia.getMonth() + deslocamento, 1)
        const hoje = new Date()
        const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        if (novaData > mesAtual) return
        setData(novaData)
    }

    const podeAvancarMes = dataReferencia.getFullYear() < new Date().getFullYear() ||
        (dataReferencia.getFullYear() === new Date().getFullYear() && dataReferencia.getMonth() < new Date().getMonth())

    function formatarData (date: Date): string {

        let month = date.toLocaleDateString('pt-br', {month: 'long'})
        let year = date.getFullYear();

        return month.charAt(0).toUpperCase() + month.slice(1) + " " + year

    }

    function formatarMes(data: Date): string {
        const numberMonth = data.getMonth()
        const nomeMonth = new Date(data.getFullYear(), numberMonth - 1).toLocaleDateString('pt-br', {month: 'long'})
        return nomeMonth
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
        if (numeroValorTotal <= 0) return '0'
        const percentual = Number((numeroValorParte / numeroValorTotal) * 100)
        return `${String(percentual)}`
    }

    
    function formatarPorcentagemFormatada(
        valorTotal: string | number | null | undefined,
        valorParte: string | number | null | undefined
    ): string {
        const numeroValorTotal = Number(valorTotal ?? 0)
        const numeroValorParte = Number(valorParte ?? 0)
        if (numeroValorTotal <= 0) return '0%'
        const percentual = ((numeroValorParte / numeroValorTotal) * 100).toFixed(2)
        return `${String(percentual)}%`
    }

    function saldoMes() {
        let diferenca = Number(valorTotalEntrada) - Number(valorTotalSaida)

        console.log(diferenca + " DIFERENCAAA")
        console.log(Number(valorTotalEntrada))
        console.log(Number(valorTotalSaida))

        if (diferenca > 0) {
            setMostrarMsgSaldo(true)
            setTitleSaldo("Você teve um bom mês!")
            setMsgSaldo(`Seu saldo positivo foi de ${formatarDinheiro(diferenca)}`)
            setTipoSaldo(true)
        } else if (diferenca === 0 && Number(valorTotalEntrada) != 0 && Number(valorTotalSaida) != 0) {
            setMostrarMsgSaldo(true)
            setTitleSaldo("Você teve um mês neutro.")
            setMsgSaldo(`Você gastou aquilo que ganhou.`)
            setTipoSaldo(true)
        } else if (diferenca < 0) {
            setMostrarMsgSaldo(true)
            setTitleSaldo("Você teve um mau mês.")
            setMsgSaldo(`Seu saldo negativo foi de ${formatarDinheiro(Math.abs(diferenca))}`)
            setTipoSaldo(false)
        } else if (Number(valorTotalEntrada) === 0 && Number(valorTotalSaida) === 0) {
            setMostrarMsgSaldo(false)
        } else {
            setMostrarMsgSaldo(false)
        }
    }

    const renderizarCategoria = (
        nome: string,
        valor: string,
        total: string,
        cor: string,
        ultima = false,
    ) => (
        <View style={[styles.categoryRow, ultima && styles.lastCategoryRow]}>
            <View style={styles.categoryName}>
                <View style={[styles.categoryDot, { backgroundColor: cor }]} />
                <Text style={styles.categoryLabel}>{nome}</Text>
            </View>
            <Text style={styles.categoryValue}>{formatarDinheiro(valor)}</Text>
            <Text style={styles.categoryPercentage}>{formatarPorcentagemFormatada(total, valor)}</Text>
        </View>
    );  

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.headerTop, {   marginTop: 20 }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerTextTitle}>Relatórios</Text>
                        <Text style={styles.headerTextSubTitle}>Acompanhe sua vida financeira</Text>
                    </View>
                </View>

                <View style={styles.selectDate}>
                    <View style={styles.dateIcon}>
                        <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                    </View>
                    <TouchableOpacity
                        style={styles.dateTextContainer}
                        onPress={() => setMostrarPicker(true)}
                        accessibilityRole="button"
                        accessibilityLabel={`Escolher período: ${formatarData(dataReferencia)}`}
                    >
                        <Text style={styles.dateCaption}>PERÍODO DO RELATÓRIO</Text>
                        <Text style={styles.textDate}>{formatarData(dataReferencia)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.dateNavigationButton}
                        onPress={() => mudarMes(-1)}
                        accessibilityRole="button"
                        accessibilityLabel="Mês anterior"
                    >
                        <Ionicons name="chevron-back" size={19} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.dateNavigationButton, !podeAvancarMes && styles.dateNavigationDisabled]}
                        onPress={() => mudarMes(1)}
                        disabled={!podeAvancarMes}
                        accessibilityRole="button"
                        accessibilityLabel="Próximo mês"
                    >
                        <Ionicons name="chevron-forward" size={19} color={podeAvancarMes ? Colors.text : Colors.border} />
                    </TouchableOpacity>
                </View>

                {mostrarPicker && (
                    <DateTimePicker
                        value={dataReferencia}
                        mode="date"
                        display="default"
                        onChange={selecionarData}
                        maximumDate={new Date()}
                    />
                )}

                <View style={styles.summaryCards}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total de entradas</Text>
                        <Text style={[styles.summaryValue, { color: Colors.success }]} numberOfLines={1} adjustsFontSizeToFit>
                            {formatarDinheiro(valorTotalEntrada)}
                        </Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total de saídas</Text>
                        <Text style={[styles.summaryValue, { color: Colors.error }]} numberOfLines={1} adjustsFontSizeToFit>
                            {formatarDinheiro(valorTotalSaida)}
                        </Text>
                    </View>
                </View>

                {erro ? (
                    <View style={styles.errorNotice}>
                        <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
                        <Text style={styles.errorText}>{erro}</Text>
                        <TouchableOpacity onPress={carregarDashboard} accessibilityRole="button">
                            <Text style={styles.retryText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                {carregando ? (
                    <View style={styles.loadingNotice}>
                        <Ionicons name="sync-outline" size={15} color={Colors.primary} />
                        <Text style={styles.loadingText}>{valorTotalEntrada || valorTotalSaida ? 'Atualizando relatório...' : 'Carregando relatório...'}</Text>
                    </View>
                ) : null}

                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleGroup}>
                            <View style={[styles.sectionIcon, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="trending-up" size={20} color={Colors.success} />
                            </View>
                            <View style={styles.sectionTitleTexts}>
                                <Text style={styles.sectionTitle}>Entradas</Text>
                                <Text style={styles.sectionSubtitle}>De onde vem seu dinheiro</Text>
                            </View>
                        </View>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalCaption}>TOTAL</Text>
                            <Text style={[styles.sectionTotal, { color: Colors.success }]}>{formatarDinheiro(valorTotalEntrada)}</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <GraficoPizza dados={dadosEntradas} tamanho={142} espessura={25}></GraficoPizza>
                    </View>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.categoryHeaderLabel}>CATEGORIA</Text>
                        <Text style={[styles.categoryHeaderLabel, {textAlign: 'center'}]}>VALOR</Text>
                        <Text style={[styles.categoryHeaderLabel, styles.percentageHeader]}>%</Text>
                    </View>
                    {renderizarCategoria('Salário', valorSalario, valorTotalEntrada, Colors.success)}
                    {renderizarCategoria('Extra', valorExtra, valorTotalEntrada, '#1476FD')}
                    {renderizarCategoria('Rendimento', valorRendimento, valorTotalEntrada, '#6C35F3', true)}
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleGroup}>
                            <View style={[styles.sectionIcon, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="trending-down" size={20} color={Colors.error} />
                            </View>
                            <View style={styles.sectionTitleTexts}>
                                <Text style={styles.sectionTitle}>Saídas</Text>
                                <Text style={styles.sectionSubtitle}>Para onde vai seu dinheiro</Text>
                            </View>
                        </View>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalCaption}>TOTAL</Text>
                            <Text style={[styles.sectionTotal, { color: Colors.error }]}>{formatarDinheiro(valorTotalSaida)}</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <GraficoPizza dados={dadosSaidas} tamanho={142} espessura={20} />
                    </View>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.categoryHeaderLabel}>CATEGORIA</Text>
                        <Text style={[styles.categoryHeaderLabel, {textAlign: 'center'}]}>VALOR</Text>
                        <Text style={[styles.categoryHeaderLabel, styles.percentageHeader]}>%</Text>
                    </View>
                    {renderizarCategoria('Fixo', valorFixo, valorTotalSaida, Colors.error)}
                    {renderizarCategoria('Variável', valorVariavel, valorTotalSaida, '#FA982F')}
                    {renderizarCategoria('Investimento', valorInvestimento, valorTotalSaida, '#7D47D7', true)}
                    
                </View>

               

                <View style={styles.sectionCard}>
                    <View style={styles.headerTop}>
                        <View style={styles.backgroundIoniconLamp}>
                            <Ionicons name="bulb-outline"  size={24} style={{color: Colors.primary}}></Ionicons>
                        </View>
                        <View style={styles.headerTitles}>
                            <Text style={[styles.sectionTitle]}>Insights</Text>
                            <Text style={styles.sectionSubtitle}>Análises rápidas sobre seu comportamento financeiro.</Text>
                        </View>
                    </View>

                    {mostrarMsgEntrada && (<View style={[styles.containerInsight, {backgroundColor:'#F3FAF8', borderColor: '#dcfff6'}]}>
                        <View style={[styles.backgroundIoniconLamp, {backgroundColor: Colors.success}]}>
                            <Ionicons name='arrow-up-outline' style={{transform: [{rotate : '45deg'}], color: Colors.border}} size={20}></Ionicons>
                        </View>
                        <View style={[styles.containerTextInsight]}>
                            <Text style={styles.textTitleInsight}>{titleEntrada}</Text>
                            <Text style={styles.textTextInsight}>{msgEntrada}</Text>
                        </View>
                    </View>)}

                    { mostrarMsgSaida && (<View style={[styles.containerInsight, {backgroundColor:'#faf3f3', borderColor: '#ffe4e4'}]}>
                        <View style={[styles.backgroundIoniconLamp, {backgroundColor: Colors.error}]}>
                            <Ionicons name='arrow-up-outline' style={{transform: [{rotate : '90deg'}], color: Colors.border}} size={20}></Ionicons>
                        </View>
                        <View style={[styles.containerTextInsight]}>
                            <Text style={styles.textTitleInsight}>{titleGasto}</Text>
                            <Text style={styles.textTextInsight}>{msgSaida}</Text>
                        </View>
                    </View>)}

                    { mostrarMsgInvestimentos && (<View style={[styles.containerInsight, {backgroundColor:'#EDF4FD', borderColor: '#d5e9ff'}]}>
                        <View style={[styles.backgroundIoniconLamp, {backgroundColor: "#2482FF"}]}>
                            <Ionicons name='bar-chart-outline' style={{color: Colors.border}} size={20}></Ionicons>
                        </View>
                        <View style={[styles.containerTextInsight]}>
                            <Text style={styles.textTitleInsight}>{titleInvestimentos}</Text>
                            <Text style={styles.textTextInsight}>{msgInvestimentos}</Text>
                        </View>
                    </View>)}

                    
                    { mostrarMsgSaldo && (<View style={[styles.containerInsight, 
                        tipoSaldo ? 
                        {backgroundColor:'#F5F2FD', borderColor: '#e5e0ff'} :
                        {backgroundColor:'#faf3f3', borderColor: '#ffe4e4'}
                    ]}>
                        <View
                            style={[styles.backgroundIoniconLamp, tipoSaldo ? {backgroundColor: "#7C40F5"} : {backgroundColor: Colors.error}]}
                        >
                            <Ionicons name='star' style={{color: Colors.border}} size={20}></Ionicons>
                        </View>
                        <View style={[styles.containerTextInsight]}>
                            <Text style={styles.textTitleInsight}>{titleSaldo}</Text>
                            <Text style={styles.textTextInsight}>{msgSaldo}</Text>
                        </View>
                    </View>)}
                    
                    {!mostrarMsgEntrada && !mostrarMsgSaida && !mostrarMsgInvestimentos && !mostrarMsgSaldo && (
                        <View style={styles.estadoContainer}>
                            {Number(valorTotalEntrada) === 0 && Number(valorTotalSaida) === 0 ? (
                                <>
                                    <Ionicons name="cloud-offline" size={32} color={Colors.textSecondary} />
                                    <Text style={styles.estadoTitulo}>Nenhuma movimentação neste período.</Text>
                                    <Text style={styles.estadoTexto}>Registre entradas ou saídas para acompanhar sua vida financeira.</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="bulb-outline" size={32} color={Colors.textSecondary} />
                                    <Text style={styles.estadoTitulo}>Sem novas análises.</Text>
                                    <Text style={styles.estadoTexto}>Há movimentações neste período, mas ainda não temos outros insights para mostrar.</Text>
                                </>
                            )}
                        </View>
                    )}
                </View>

                 <Text style={styles.footerNote}>Os valores são referentes ao período selecionado.</Text>
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 32,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    headerTitles: {
        flex: 1,
    },
    headerTextTitle: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
        fontSize: 24,
        letterSpacing: -0.5,
    },
    headerTextSubTitle: {
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 3,
    },
    selectDate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        marginBottom: 18,
    },
    dateIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
    },
    dateTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    dateNavigationButton: {
        width: 30,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    dateNavigationDisabled: {
        opacity: 0.45,
    },
    dateCaption: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 9,
        letterSpacing: 0.8,
        color: Colors.textSecondary,
        marginBottom: 3,
    },
    textDate: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
        fontSize: 14,
        textTransform: 'capitalize',
    },
    summaryCards: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 22,
    },
    summaryCard: {
        flex: 1,
        minWidth: 0,
        minHeight: 92,
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderRadius: 22,
        backgroundColor: '#EAE7F8',
    },
    summaryLabel: {
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
        fontSize: 11,
        marginBottom: 9,
    },
    summaryValue: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
        fontSize: 18,
        letterSpacing: -0.4,
    },
    errorNotice: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
        marginBottom: 16,
    },
    errorText: {
        flex: 1,
        fontFamily: 'PlusJakartaMedium',
        color: Colors.error,
        fontSize: 12,
    },
    retryText: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.primary,
        fontSize: 12,
    },
    loadingNotice: {
        flexDirection: 'row',
        gap: 8,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
    },
    loadingText: {
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
        fontSize: 12,
    },
    sectionCard: {
        backgroundColor: Colors.surface,
        borderRadius: 22,
        padding: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    sectionTitleGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minWidth: 0,
    },
    sectionIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitleTexts: {
        flex: 1,
        minWidth: 0,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
        fontSize: 16,
    },
    sectionSubtitle: {
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
        fontSize: 10,
        marginTop: 3,
    },
    totalContainer: {
        alignItems: 'flex-end',
        flexShrink: 0,
    },
    totalCaption: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 9,
        color: Colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: 3,
    },
    sectionTotal: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 16,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 9,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        //borderWidth: 1,
        gap: 10
    },
    categoryHeaderLabel: {
        flex: 1,
        fontFamily: 'PlusJakartaBold',
        fontSize: 9,
        color: Colors.textSecondary,
        letterSpacing: 0.7,
        //borderWidth: 1,
    },
    percentageHeader: {
        flex: 0,
        width: 42,
        textAlign: 'right',
    },
    categoryRow: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: 8,
    },
    lastCategoryRow: {
        borderBottomWidth: 0,
    },
    categoryName: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    categoryDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
    },
    categoryLabel: {
        flexShrink: 1,
        fontFamily: 'PlusJakartaMedium',
        color: Colors.text,
        fontSize: 12,
    },
    categoryValue: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'PlusJakartaBold',
        color: Colors.text,
        fontSize: 12,
        //borderWidth: 1
    },
    categoryPercentage: {
        width: 42,
        textAlign: 'right',
        fontFamily: 'PlusJakartaMedium',
        color: Colors.textSecondary,
        fontSize: 11,
    },
    footerNote: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 10,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 2,
        marginBottom: 8,
    },
    backgroundIoniconLamp: {
        backgroundColor: '#EBF3FD',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    containerInsight: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        padding: 12,
        borderRadius: 14,
        marginBottom: 10,
    },
    containerTextInsight: {
        flex: 1
    },
    textTitleInsight: {
        fontFamily: 'PlusJakartaBold',
        fontSize: 13,
        lineHeight: 19,
        color: Colors.text,
        marginBottom: 3,
    },
    textTextInsight: {
        fontFamily: 'PlusJakartaMedium',
        fontSize: 11,
        lineHeight: 17,
        color: Colors.textSecondary,
    },
    estadoContainer: { minHeight: 130, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 8 },
    estadoTitulo: { fontFamily: 'PlusJakartaBold', color: Colors.text, fontSize: 13 },
    estadoTexto: { fontFamily: 'PlusJakartaMedium', color: Colors.textSecondary, fontSize: 11, textAlign: 'center' },
});
