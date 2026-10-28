import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFonts } from '@expo-google-fonts/poppins';
import { useData } from '../../context/DataContext';

const API_URL = 'http://192.168.15.6:8080';

type Movimentacao = {
  data: string;
  valor: string | number;
  tipo: string;
  tabela: string;
};

type ResumoFinanceiro = {
  valorTotal: string | number | null;
  porcentagemDiferenca: string | number | null;
};

function inicioDoDia(data: Date): number {
  const copia = new Date(data);
  copia.setHours(0, 0, 0, 0);
  return copia.getTime();
}

function formatarDataMovimentacao(dataMovimentacao: string, dataReferencia: Date): string {
  if (!dataMovimentacao) return 'Data indisponível';
  const dataMov = new Date(dataMovimentacao);
  if (Number.isNaN(dataMov.getTime())) return 'Data indisponível';

  const diferenca = Math.round(
    (inicioDoDia(dataReferencia) - inicioDoDia(dataMov)) / (1000 * 60 * 60 * 24),
  );

  if (diferenca === 0) return 'Hoje';
  if (diferenca === 1) return 'Ontem';
  return dataMov.toLocaleDateString('pt-BR');
}

function formatarDinheiro(valor: string | number | null | undefined): string {
  const numero = Number(valor ?? 0);
  return (Number.isFinite(numero) ? numero : 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarCategoria(tipo: string): string {
  const categorias: Record<string, string> = {
    EXTRA: 'Extra',
    SALARIO: 'Salário',
    RENDIMENTO: 'Rendimento',
    RENDIMENTOS: 'Rendimento',
    FIXO: 'Fixo',
    FIXA: 'Fixo',
    VARIAVEL: 'Variável',
    INVESTIMENTOS: 'Investimento',
    ALIMENTACAO: 'Alimentação',
    TRANSPORTE: 'Transporte',
    LAZER: 'Lazer',
    MORADIA: 'Moradia',
  };
  return categorias[tipo] ?? 'Indefinido';
}

function obterIconeMovimentacao(movimento: Movimentacao): keyof typeof Ionicons.glyphMap {
  if (movimento.tabela === 'entrada') {
    switch (movimento.tipo) {
      case 'SALARIO': return 'briefcase-outline';
      case 'EXTRA': return 'cash-outline';
      case 'RENDIMENTO':
      case 'RENDIMENTOS': return 'trending-up-outline';
      default: return 'add-circle-outline';
    }
  }

  switch (movimento.tipo) {
    case 'ALIMENTACAO': return 'restaurant-outline';
    case 'TRANSPORTE': return 'car-outline';
    case 'LAZER': return 'game-controller-outline';
    case 'MORADIA': return 'home-outline';
    case 'INVESTIMENTO': return 'trending-up-outline';
    default: return 'remove-circle-outline';
  }
}

function obterEstiloVariacao(porcentagem: string, tipo: 'entrada' | 'saida') {
  const valor = Number(porcentagem.replace('%', '').replace(',', '.'));

  if (!Number.isFinite(valor) || valor === 0) {
    return { cor: Colors.textSecondary, icone: 'remove-outline' as const };
  }

  const resultadoPositivo = tipo === 'entrada' ? valor > 0 : valor < 0;
  return {
    cor: resultadoPositivo ? Colors.success : Colors.error,
    icone: valor > 0 ? ('trending-up-outline' as const) : ('trending-down-outline' as const),
  };
}

export default function HomeScreen() {
  const { data, setData } = useData();
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  const tokenAtual = Array.isArray(token) ? token[0] : token;

  const [nameUser, setNameUser] = useState('');
  const [entradasValorTotal, setEntradasValorTotal] = useState('0');
  const [porcentagemEntradaMonth, setPorcentagemEntradaMonth] = useState('0');
  const [saidasValorTotal, setSaidasValorTotal] = useState('0');
  const [porcentagemSaidaMonth, setPorcentagemSaidaMonth] = useState('0');
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [fontsLoaded] = useFonts({
    PlusJakartaExtraLight: require('../../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
    PlusJakartaMedium: require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
    PlusJakartaBold: require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
    PlusJakartaSemiBold: require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    PlusJakartaExtraLignItalic: require('../../assets/fonts/PlusJakartaSans-ExtraLightItalic.ttf'),
  });

  const dataReferencia =
    data instanceof Date && !Number.isNaN(data.getTime()) ? data : new Date();

  const saldoAtual = Number(entradasValorTotal) - Number(saidasValorTotal);

  const requisicaoPost = useCallback(async <T,>(endpoint: string): Promise<T> => {
    if (!tokenAtual) throw new Error('Token de autenticação não encontrado.');

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenAtual, data: dataReferencia }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição ${endpoint}: HTTP ${response.status}`);
    }
    return response.json() as Promise<T>;
  }, [tokenAtual, dataReferencia]);

  const getName = useCallback(async () => {
    if (!tokenAtual) return;

    const response = await fetch(`${API_URL}/api/getNameUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenAtual }),
    });

    if (!response.ok) throw new Error('Não foi possível carregar o usuário.');
    const resposta = await response.json();
    setNameUser(resposta.nome ?? '');
  }, [tokenAtual]);

  const carregarDashboard = useCallback(async () => {
    if (!tokenAtual) {
      setErro('Não foi possível identificar sua sessão.');
      return;
    }

    setCarregando(true);
    setErro('');
    try {
      const [entradas, saidas, movimentos] = await Promise.all([
        requisicaoPost<ResumoFinanceiro>('/api/dadosEntrada'),
        requisicaoPost<ResumoFinanceiro>('/api/dadosSaida'),
        requisicaoPost<Movimentacao[]>('/api/quatroMovimentacoes'),
      ]);

      setEntradasValorTotal(String(entradas.valorTotal ?? 0));
      setPorcentagemEntradaMonth(String(entradas.porcentagemDiferenca ?? 0));
      setSaidasValorTotal(String(saidas.valorTotal ?? 0));
      setPorcentagemSaidaMonth(String(saidas.porcentagemDiferenca ?? 0));
      setMovimentacoes(Array.isArray(movimentos) ? movimentos : []);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setErro('Não foi possível atualizar os dados financeiros.');
    } finally {
      setCarregando(false);
    }
  }, [tokenAtual, requisicaoPost]);

  useEffect(() => {
    getName().catch((error) => console.error('Erro ao buscar nome:', error));
    carregarDashboard();

  }, [getName, dataReferencia, data,entradasValorTotal, saidasValorTotal]);

  useFocusEffect(useCallback(() => {
    carregarDashboard();
  }, [carregarDashboard]));

  function adicionarDespesa() {
    router.push({ pathname: '/Add', params: { escolha: 'DESPESA', token: tokenAtual } });
  }

  function adicionarReceita() {
    router.push({ pathname: '/Add', params: { escolha: 'RECEITA', token: tokenAtual } });
  }

  function verTodasMovimentacoes() {
    router.push({ pathname: '/Transacoes', params: { token: tokenAtual } });
  }

  function relatorios() {
    router.push({ pathname: '/Relatorios', params: { token: tokenAtual} });
  }

  function gerenciarTransacoes() {
    router.push({ pathname: '/Transacoes', params: { token: tokenAtual,  modoGerenciamento: "true"  } });
  }


  function selecionarData(event: { type: string }, selectedDate?: Date) {
    setMostrarPicker(false);
    if (event.type === 'set' && selectedDate) setData(selectedDate);
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const entradaVariacao = obterEstiloVariacao(porcentagemEntradaMonth, 'entrada');
  const saidaVariacao = obterEstiloVariacao(porcentagemSaidaMonth, 'saida');

  const mostrarPercentual = (valor: string) =>
    `${valor}${valor.includes('%') ? '' : '%'}`;

  return (
    <LinearGradient colors={[Colors.background, Colors.surface, Colors.surface]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.subContainer}>
          {/* CABEÇALHO */}
          <View style={styles.containerHeader}>
            <View style={styles.subContainerNameApp}>
              <Image
                style={styles.logo}
                source={require('../../assets/images/crescimentoAzul.png')}
              />
              <Text style={styles.textNameApp}>
                My<Text style={styles.textNameApp2}>Finances</Text>
              </Text>
            </View>
            <View style={styles.subContainerIcons}>
              <Pressable accessibilityRole="button" accessibilityLabel="Notificações" hitSlop={8}>
                <Ionicons name="notifications-outline" size={22} color={Colors.text} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Perfil" hitSlop={8}>
                <Ionicons name="person-circle-outline" size={24} color={Colors.text} />
              </Pressable>
            </View>
          </View>

          {/* SAUDAÇÃO E DATA */}
          <View style={styles.containerTitle}>
            <View style={styles.textTitleCont}>
              <View style={styles.greetingContainer}>
                <Text style={styles.title}>
                  Olá,<Text style={styles.titleNome}> {nameUser || 'Usuário'}!</Text>
                </Text>
                <Text style={styles.subTitle}>Seu controle financeiro em um só lugar.</Text>
              </View>
              <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.selectDate}>
                <Ionicons name="calendar-outline" size={17} color={Colors.primary} />
                <Text style={styles.textDate}>{dataReferencia.toLocaleDateString('pt-BR')}</Text>
                <Ionicons name="chevron-down-outline" size={13} color={Colors.textSecondary} />
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
          </View>

          {/* SALDO EM DESTAQUE COM ENTRADAS E GASTOS ABAIXO */}
          <View style={styles.containerSaldo}>
            <View style={styles.saldoInfo}>
              <View style={styles.saldoTituloContainer}>
                <Text style={styles.titleSaldo}>Saldo atual</Text>
                <Ionicons name="eye-outline" size={17} color="#FFFFFF" />
              </View>

              <Text style={styles.valorSaldo} numberOfLines={1} adjustsFontSizeToFit>
                {formatarDinheiro(saldoAtual)}
              </Text>

              <View style={styles.resumoSaldo}>
                <View style={styles.resumoItem}>
                  <View style={styles.resumoTitulo}>
                    <Ionicons name="arrow-down-circle-outline" size={15} color="#D1FAE5" />
                    <Text style={styles.resumoLabel}>Entradas</Text>
                  </View>
                  <Text style={styles.resumoValor} numberOfLines={1} adjustsFontSizeToFit>
                    {formatarDinheiro(entradasValorTotal)}
                  </Text>
                  <View style={styles.resumoVariacao}>
                    <Ionicons
                      name={entradaVariacao.icone}
                      size={13}
                      color={entradaVariacao.cor}
                    />
                    <Text style={[styles.resumoPercentual, { color: entradaVariacao.cor }]}>
                      {mostrarPercentual(porcentagemEntradaMonth)}
                    </Text>
                  </View>
                  <Text style={styles.resumoComparacao}>vs. mês anterior</Text>
                </View>

                <View style={styles.divisorSaldo} />

                <View style={styles.resumoItem}>
                  <View style={styles.resumoTitulo}>
                    <Ionicons name="arrow-up-circle-outline" size={15} color="#FECACA" />
                    <Text style={styles.resumoLabel}>Gastos</Text>
                  </View>
                  <Text style={styles.resumoValor} numberOfLines={1} adjustsFontSizeToFit>
                    {formatarDinheiro(saidasValorTotal)}
                  </Text>
                  <View style={styles.resumoVariacao}>
                    <Ionicons
                      name={saidaVariacao.icone}
                      size={13}
                      color={saidaVariacao.cor}
                    />
                    <Text style={[styles.resumoPercentual, { color: saidaVariacao.cor }]}>
                      {mostrarPercentual(porcentagemSaidaMonth)}
                    </Text>
                  </View>
                  <Text style={styles.resumoComparacao}>vs. mês anterior</Text>
                </View>
              </View>
            </View>

            <View style={styles.saldoIcon}>
              <Ionicons
                name={saldoAtual >= 0 ? 'trending-up-outline' : 'trending-down-outline'}
                size={30}
                color="#FFFFFF"
              />
            </View>
          </View>

          {/* AÇÕES RÁPIDAS */}
          <View style={styles.containerMethods}>
            <TouchableOpacity style={styles.blockMethod} onPress={adicionarDespesa}>
              <View style={[styles.methodIcon, styles.methodIconExpense]}>
                <Ionicons name="remove-circle-outline" size={24} color={Colors.error} />
              </View>
              <Text style={styles.textMethod}>Adicionar</Text>
              <Text style={styles.textMethod}>despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blockMethod} onPress={adicionarReceita}>
              <View style={[styles.methodIcon, styles.methodIconIncome]}>
                <Ionicons name="add-circle-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.textMethod}>Adicionar</Text>
              <Text style={styles.textMethod}>receita</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blockMethod} onPress={gerenciarTransacoes}>
              <View style={styles.methodIcon}>
                <Ionicons name="grid-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.textMethod}>Gerenciar</Text>
              <Text style={styles.textMethod}>Transações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blockMethod} onPress={relatorios}>
              <View style={styles.methodIcon}>
                <Ionicons name="bar-chart-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.textMethod}>Ver</Text>
              <Text style={styles.textMethod}>relatórios</Text>
            </TouchableOpacity>

          </View>

          {/* ÚLTIMAS MOVIMENTAÇÕES */}
          <View style={styles.containerMove}>
            <View style={styles.containerTitleMove}>
              <View>
                <Text style={styles.titleMove}>Últimas movimentações</Text>
                <Text style={styles.subtitleMove}>Acompanhe suas atividades recentes</Text>
              </View>
              <Pressable onPress={verTodasMovimentacoes} style={styles.btnAcessMove}>
                <Text style={styles.textMove}>Ver todas</Text>
                <Ionicons name="chevron-forward" color={Colors.primary} size={15} />
              </Pressable>
            </View>

            {carregando && movimentacoes.length === 0 ? (
              <View style={styles.estadoContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.estadoTexto}>Carregando movimentações...</Text>
              </View>
            ) : erro && movimentacoes.length === 0 ? (
              <View style={styles.estadoContainer}>
                <Ionicons name="cloud-offline-outline" size={28} color={Colors.textSecondary} />
                <Text style={styles.estadoTexto}>{erro}</Text>
                <Pressable onPress={carregarDashboard}>
                  <Text style={styles.textMove}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : movimentacoes.length === 0 ? (
              <View style={styles.estadoContainer}>
                <Ionicons name="receipt-outline" size={32} color={Colors.textSecondary} />
                <Text style={styles.estadoTitulo}>Nenhuma movimentação</Text>
                <Text style={styles.estadoTexto}>Suas entradas e gastos aparecerão aqui.</Text>
              </View>
            ) : (
              movimentacoes.slice(0, 4).map((movimento, index, lista) => {
                const ehEntrada = movimento.tabela === 'entrada';
                return (
                  <View key={`${movimento.data}-${movimento.tipo}-${index}`}>
                    <View style={styles.blockMove}>
                      <View style={styles.blockLeft}>
                        <View
                          style={[
                            styles.moveIcon,
                            { backgroundColor: ehEntrada ? '#F0FAF7' : '#FFF1F2' },
                          ]}
                        >
                          <Ionicons
                            name={obterIconeMovimentacao(movimento)}
                            size={22}
                            color={ehEntrada ? Colors.success : Colors.error}
                          />
                        </View>
                        <View style={styles.contName}>
                          <Text style={styles.nomeColocado} numberOfLines={1}>
                            {ehEntrada ? 'Entrada' : 'Saída'}
                          </Text>
                          <Text style={styles.categoriaColocada} numberOfLines={1}>
                            {formatarCategoria(movimento.tipo)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.blockRight}>
                        <Text style={styles.dateMove}>
                          {formatarDataMovimentacao(movimento.data, dataReferencia)}
                        </Text>
                        <Text
                          style={[
                            styles.valueMove,
                            { color: ehEntrada ? Colors.success : Colors.error },
                          ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {ehEntrada ? '+ ' : '- '}{formatarDinheiro(movimento.valor)}
                        </Text>
                      </View>
                    </View>
                    {index < lista.length - 1 && <View style={styles.line} />}
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28, marginTop: 15},
  subContainer: { width: '100%' },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    marginTop: 12,
  },
  subContainerNameApp: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 30, height: 30, resizeMode: 'contain' },
  textNameApp: { fontFamily: 'PlusJakartaMedium', fontSize: 19, color: Colors.text },
  textNameApp2: { fontFamily: 'PlusJakartaBold', color: Colors.primary },
  subContainerIcons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  containerTitle: { width: '100%', marginTop: 24 },
  textTitleCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  greetingContainer: { flex: 1 },
  title: { fontFamily: 'PlusJakartaMedium', fontSize: 21, color: Colors.text },
  titleNome: { fontFamily: 'PlusJakartaBold' },
  subTitle: { fontFamily: 'PlusJakartaMedium', fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  selectDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    minHeight: 38,
    borderRadius: 12,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  textDate: { fontFamily: 'PlusJakartaSemiBold', fontSize: 10, color: Colors.text },

  /* SALDO EM DESTAQUE */
  containerSaldo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 220,
    marginTop: 22,
    padding: 20,
    backgroundColor: Colors.primary,
    borderWidth: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  saldoInfo: { flex: 1, minWidth: 0 },
  saldoTituloContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleSaldo: { fontFamily: 'PlusJakartaMedium', fontSize: 13, color: '#DBEAFE' },
  valorSaldo: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 29,
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 22,
  },
  resumoSaldo: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 2 },
  resumoItem: { flex: 1, minWidth: 0, paddingRight: 8 },
  resumoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 7 },
  resumoLabel: { fontFamily: 'PlusJakartaMedium', fontSize: 11, color: '#DBEAFE' },
  resumoValor: { fontFamily: 'PlusJakartaBold', fontSize: 13, color: '#FFFFFF' },
  resumoVariacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  resumoPercentual: {
    fontFamily: 'PlusJakartaBold',
    fontSize: 11,
  },
  resumoComparacao: {
    fontFamily: 'PlusJakartaMedium',
    fontSize: 9,
    color: '#DBEAFE',
    marginTop: 2,
  },
  divisorSaldo: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 10,
  },
  saldoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },


  /* AÇÕES RÁPIDAS */
  containerMethods: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 18,
  },
  blockMethod: {
    flex: 1,
    minWidth: 0,
    minHeight: 104,
    paddingVertical: 10,
    paddingHorizontal: 3,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  methodIconExpense: { backgroundColor: '#FFF1F2' },
  methodIconIncome: { backgroundColor: '#F0FAF7' },
  textMethod: { fontFamily: 'PlusJakartaSemiBold', color: Colors.text, fontSize: 9, textAlign: 'center' },

  /* ÚLTIMAS MOVIMENTAÇÕES */
  containerMove: {
    width: '100%',
    marginTop: 22,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  containerTitleMove: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  titleMove: { fontFamily: 'PlusJakartaBold', fontSize: 14, color: Colors.text },
  subtitleMove: { fontFamily: 'PlusJakartaMedium', fontSize: 10, color: Colors.textSecondary, marginTop: 3 },
  btnAcessMove: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  textMove: { fontFamily: 'PlusJakartaSemiBold', fontSize: 11, color: Colors.primary },
  blockMove: {
    minHeight: 70,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  blockLeft: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center' },
  moveIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  contName: { flex: 1, minWidth: 0, marginLeft: 10 },
  nomeColocado: { fontFamily: 'PlusJakartaBold', color: Colors.text, fontSize: 12 },
  categoriaColocada: { fontFamily: 'PlusJakartaMedium', color: Colors.textSecondary, fontSize: 10, marginTop: 3 },
  blockRight: { maxWidth: '48%', alignItems: 'flex-end', justifyContent: 'center', gap: 5 },
  dateMove: { fontFamily: 'PlusJakartaMedium', color: Colors.textSecondary, fontSize: 10 },
  valueMove: { fontFamily: 'PlusJakartaSemiBold', fontSize: 12 },
  line: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  estadoContainer: { minHeight: 130, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 8 },
  estadoTitulo: { fontFamily: 'PlusJakartaBold', color: Colors.text, fontSize: 13 },
  estadoTexto: { fontFamily: 'PlusJakartaMedium', color: Colors.textSecondary, fontSize: 11, textAlign: 'center' },
});
