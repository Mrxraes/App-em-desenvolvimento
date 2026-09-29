import { Colors } from '@/constants/Colors';
import { useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet,Text, View, Image, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';


export default function HomeScreen() {


  const [data, setData] = useState(new Date())
  const [entradasValorTotal, setEntradasValorTotal] = useState('')
  const [mostrarPicker, setMostrarPicker] = useState(false)

  const { token } = useLocalSearchParams<{
    token?: string
  }>()

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

  useEffect(() => {
    entradasOpening();
  }, [])

      const entradasOpening = async () => {
        const response = await fetch("http://192.168.15.6:8080/api/dadosEntrada", {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify ({
            token: token,
            data: data
          })
        })

        const resposta = await response.json()
        setEntradasValorTotal(resposta.valorTotal)
        console.log(resposta.valorTotal)
      }

  return (    
    <LinearGradient colors={[Colors.border, Colors.background, Colors.background, Colors.surface, Colors.surface, Colors.surface, Colors.border]} style={styles.container}>
      
      <View style={styles.subContainer}>
          { // ========================================================
            // HEADER
            // ========================================================
          }
            <View style={styles.containerHeader}>
              {
                // ========================================================
                // NOME DO APP
                // ========================================================
              }
                <View style={styles.subContainerNameApp}>
                  <Image style={styles.logo} source={require("../../assets/images/crescimentoAzul.png")}></Image>
                  <Text style={styles.textNameApp}>My<Text style={styles.textNameApp2}>Finances</Text></Text>
                </View>
              {
                // ========================================================
                // ICONE
                // ========================================================
              }
                <View style={styles.subContainerIcons}>
                    <Ionicons name="notifications" size={20}></Ionicons>
                    <Ionicons name="person-outline" size={20}></Ionicons>
                </View>
            </View>
          {
            // ========================================================
            // TITLE
            // ========================================================
          }
            <View style={styles.containerTitle}>

                <View style={styles.textTitleCont}>

                  <Text style={styles.title}>
                    Olá, <Text style={styles.titleNome}>Bruno!</Text>
                  </Text>

                  <View style={styles.selectDate}>
                    <Ionicons name="calendar-outline" size={16}></Ionicons>
                    <Text style={styles.textDate}>{data.toLocaleDateString('pt-BR')}</Text>
                    <TouchableOpacity onPress={() => setMostrarPicker(!mostrarPicker)}>
                      <Ionicons name="chevron-down-outline" size={14}></Ionicons>
                    </TouchableOpacity>
                  </View>

                  {mostrarPicker && (
                    <DateTimePicker
                      value={data}
                      mode='date'
                      display='default'
                      onChange={(event, selectedDate) => {
                        setMostrarPicker(false)

                        if (selectedDate) {
                          setData(selectedDate)
                        }
                      }}
                    />
                  )}

                </View>
                
              </View>

              <Text style={styles.subTitle}>Seu controle financeiro está em dia</Text>
                  
          {
            // ========================================================
            // ENTRADAS E GASTOS
            // ========================================================
          }
          <View style={styles.containerDados}>

          {
            // ========================================================
            // ENTRADAS
            // ========================================================
          }
            <View style={styles.containerEntradas}>
              <View>
                <Image style={styles.imgDados}source={require('../../assets/images/entradas.png')}></Image>
              </View>
              <View style={styles.subContainerDados}>
                <Text style={styles.titleDados}>Entradas</Text>
                <Text style={styles.titleValue}>{entradasValorTotal}</Text>
                  <View style={styles.containerMonthBefore}>
                    {
                      // fazer depois um verificador que muda o grau da seta conforme uma verdade
                    }
                    <Ionicons name="arrow-up-outline" style={{ transform: [{ rotate: '45deg' }] }} color={Colors.success} size={14}></Ionicons>
                    <Text style={styles.porcentagemText}>+12%</Text>
                    <Text style={styles.monthText}> vs. mês anterior</Text>
                  </View>
              </View>
            </View>
          {
            // ========================================================
            // SAIDAS
            // ========================================================
          }
            <View style={styles.containerSaidas}>
                <View>
                  <Image style={styles.imgDados}source={require('../../assets/images/saidas.png')}></Image>
                </View>
                <View style={styles.subContainerDados}>
                  <Text style={styles.titleDados}>Gastos</Text>
                  <Text style={styles.titleValue}>R$1.400,00</Text>
                    <View style={styles.containerMonthBefore}>
                      {
                        // fazer depois um verificador que muda o grau da seta conforme uma verdade
                      }
                      <Ionicons name="arrow-up-outline" style={{ transform: [{ rotate: '45deg' }] }} color={Colors.error} size={14}></Ionicons>
                      <Text style={styles.porcentagemGastosText}>+4%</Text>
                      <Text style={styles.monthText}> vs. mês anterior</Text>
                    </View>
                </View>
              </View>
          </View>

          {
            // ========================================================
            // SALDO
            // ========================================================
          }

          <View style={styles.containerSaldo}>

                <View>
                  <Image style={styles.imgDadosSaldo}source={require('../../assets/images/saldo_em_conta.png')}></Image>
                
                  </View>
                <View style={styles.espacoAlinha}>
                    <View style={styles.subContainerDados}>
                      <Text style={styles.titleDados}>Saldo do mês</Text>
                      <Text style={styles.titleValue}>R$1.400,00</Text>
                    </View>

                    <View>
                      <Image  style={styles.imgSaldo} source={require("../../assets/images/crescimento.png")}></Image>
                    </View>
                </View>
           </View>
              
          {
            // ========================================================
            // FUNCIONALIDADES
            // ========================================================
          }

          <View style={styles.containerMethods}>

            <View style={styles.blockMethod}>
              <Image style={styles.imgMethod} source={require("../../assets/images/addDespesa.png")}></Image>
              <Text style={styles.textMethod}>Adicionar</Text>
              <Text style={styles.textMethod}>despesa</Text>
            </View>

            <View style={styles.blockMethod}>
              <Image style={styles.imgMethod} source={require("../../assets/images/addReceita.png")}></Image>
              <Text style={styles.textMethod}>Adicionar</Text>
              <Text style={styles.textMethod}>receita</Text>
            </View>

            <View style={styles.blockMethod}>
              <Image style={styles.imgMethod} source={require("../../assets/images/relatorio.png")}></Image>
              <Text style={styles.textMethod}>Ver</Text>
              <Text style={styles.textMethod}>relatórios</Text>
            </View>

            <View style={styles.blockMethod}>
              <Image style={styles.imgMethod} source={require("../../assets/images/config.png")}></Image>
              <Text style={styles.textMethod}>Categorias</Text>
            </View>

          </View>

      </View>

      {
        // ========================================================
        // ULTIMAS MOVIMENTAÇÕES
        // ========================================================
      }

      <View style={styles.containerMove}>

      {
        // ========================================================
        // TITLE
        // ========================================================
      }

            <View style={styles.containerTitleMove}>
              <View>
                <Text style={styles.titleMove}>Últimas Movimentações</Text>
              </View>
                <View style={styles.btnAcessMove}>
                  <Text style={styles.textMove}>Ver todas</Text>
                  <Ionicons name="chevron-forward" color={Colors.primary}size={14} style={{ marginTop: 2}}></Ionicons>
                </View>
            </View>
            
      {
        // ========================================================
        // MOVIMENTAÇÃO
        // ========================================================
      }
 
            <View style={styles.blockMove}>
              <View style={styles.blockLeft}>
                <View>
                  <Image  style={styles.imgMove} source={require("../../assets/images/addDespesa.png")}></Image>
                </View>
                <View style={styles.contName}>
                  <Text style={styles.nomeColocado}>Name</Text>
                  <Text style={styles.categoriaColocada}>Categoria</Text>
                </View>
              </View>
              <View style={styles.blockRight}>
                  <View style={styles.alinharRight}>
                    <Text style={styles.dateMove}>Hoje</Text>
                  </View>
                  <View style={styles.alinharRight}>
                    <Text style={styles.valueMove}>- R$200</Text>
                    <Ionicons name="chevron-forward" color={Colors.textSecondary}size={14} style={{ marginTop: 2}}></Ionicons>
                  </View>
              </View>
            </View>

            <View style={styles.line}></View>

      {
      //
      }

           <View style={styles.blockMove}>
              <View style={styles.blockLeft}>
                <View>
                  <Image  style={styles.imgMove} source={require("../../assets/images/addDespesa.png")}></Image>
                </View>
                <View style={styles.contName}>
                  <Text style={styles.nomeColocado}>Name</Text>
                  <Text style={styles.categoriaColocada}>Categoria</Text>
                </View>
              </View>
              <View style={styles.blockRight}>
                  <View style={styles.alinharRight}>
                    <Text style={styles.dateMove}>Hoje</Text>
                  </View>
                  <View style={styles.alinharRight}>
                    <Text style={styles.valueMove}>- R$200</Text>
                    <Ionicons name="chevron-forward" color={Colors.textSecondary}size={14} style={{ marginTop: 2}}></Ionicons>
                  </View>
              </View>
            </View>

            <View style={styles.line}></View>

      {
      //
      }

           <View style={styles.blockMove}>
              <View style={styles.blockLeft}>
                <View>
                  <Image  style={styles.imgMove} source={require("../../assets/images/addDespesa.png")}></Image>
                </View>
                <View style={styles.contName}>
                  <Text style={styles.nomeColocado}>Name</Text>
                  <Text style={styles.categoriaColocada}>Categoria</Text>
                </View>
              </View>
              <View style={styles.blockRight}>
                  <View style={styles.alinharRight}>
                    <Text style={styles.dateMove}>Hoje</Text>
                  </View>
                  <View style={styles.alinharRight}>
                    <Text style={styles.valueMove}>- R$200</Text>
                    <Ionicons name="chevron-forward" color={Colors.textSecondary}size={14} style={{ marginTop: 2}}></Ionicons>
                  </View>
              </View>
            </View>

            <View style={styles.line}></View>

      {
      //
      }

           <View style={styles.blockMove}>
              <View style={styles.blockLeft}>
                <View>
                  <Image  style={styles.imgMove} source={require("../../assets/images/addDespesa.png")}></Image>
                </View>
                <View style={styles.contName}>
                  <Text style={styles.nomeColocado}>Name</Text>
                  <Text style={styles.categoriaColocada}>Categoria</Text>
                </View>
              </View>
              <View style={styles.blockRight}>
                  <View style={styles.alinharRight}>
                    <Text style={styles.dateMove}>Hoje</Text>
                  </View>
                  <View style={styles.alinharRight}>
                    <Text style={styles.valueMove}>- R$200</Text>
                    <Ionicons name="chevron-forward" color={Colors.textSecondary}size={14} style={{ marginTop: 2}}></Ionicons>
                  </View>
              </View>
            </View>
      {
      //
      }
        
      </View>

      


    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: "center"

    },

    subContainer: {
      width: '100%',
    },

    text: {
      color: '#000000',
      fontSize: 24,
      fontWeight: 'bold',
    },

    containerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop:20,
      height: '15%'
    },

    subContainerNameApp: {
       flexDirection: 'row',
       alignItems: 'center'
     },

     logo: {
      width: 30,
      height: 30
     },

    textNameApp: {
      fontFamily: "PlusJakartaMedium",
      fontSize: 18
    },

    textNameApp2: {
      fontFamily: "PlusJakartaBold",
      fontSize: 18
    },

    subContainerIcons: {
      flexDirection: 'row',
      gap: 8,
    },

    containerTitle: {
      flexDirection: "row",
      width: '100%',
    },

    textTitleCont: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 40,
      width: '100%',
    },

    title: {
      fontFamily: "PlusJakartaSemiBold",
      fontSize: 25,
      color: Colors.text
    },

    titleNome: {
        fontFamily: "PlusJakartaBold",
      fontSize: 25,
      color: Colors.text
    },

    subTitle: {
      fontFamily: "PlusJakartaMedium",
      fontSize: 12,
      color: Colors.textSecondary
    }, 

    selectDate: {
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      borderWidth: 1, 
      flex: 0.75,
      height: 40,
      borderRadius: 15,
      borderColor: "#aeadad",
      backgroundColor: Colors.surface,
      
    },

    textDate: {
      fontFamily: "PlusJakartaBold",
      fontSize: 8,
      color: Colors.text
    },

    containerDados: {
      flexDirection: 'row',
      justifyContent: "space-between",
      gap: 10, 
      width: '100%',
      marginTop: 15
    },

    containerEntradas: {
      borderWidth: 1,
      padding: 10,
      height: 85,
      flexDirection: 'row',
      backgroundColor: '#F0FAF7',
      borderColor: '#bfded5',
      borderRadius: 10,
      flex: 1
    },

    subContainerDados: {
      flexDirection: 'column',
      marginLeft: 10
    },

    imgDados: {
      width: 35,
      height: 35,

    },

    imgDadosSaldo: {
      width: 60,
      height: 60,
    },

    espacoAlinha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 30,
      alignItems: 'center'
    },  

    imgSaldo: {
      width: 130,
      height: 40,
    },

    titleDados: {
      fontFamily: 'PlusJakartaMedium',
      color: Colors.textSecondary,
      fontSize: 10,
    },

    titleValue: {
      fontFamily: "PlusJakartaBold",
      fontSize: 16,
      marginBottom: 5
    },

    containerMonthBefore: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },

    metricasEntradas: {
      width: 25,
      height: 25
    },

    porcentagemText: {
      fontSize: 9,
      fontFamily: "PlusJakartaSemiBold",
      color: Colors.success
    },

    

    monthText: {
      fontSize: 7,
      fontFamily: "PlusJakartaMedium",
      marginLeft: 5,
      color: Colors.textSecondary
    },

    containerSaidas: {
      borderWidth: 1,
      padding: 10,
      height: 85,
      flexDirection: 'row',
      backgroundColor: '#FBF1F6',
      borderColor:  '#dbd0d6',
      borderRadius: 10,
      flex: 1
    },

    porcentagemGastosText: {
      fontSize: 9,
      fontFamily: "PlusJakartaSemiBold",
      color: Colors.error
    },

    containerSaldo: {
      borderWidth: 1,
      padding: 10,
      height: 80,
      flexDirection: 'row',
      backgroundColor: '#EDF4FD',
      borderColor:  '#c5cfdc',
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center'
    },

    containerMethods: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      gap: 5,
      
    },

    blockMethod: {
      borderWidth: 1,
      backgroundColor: '#ffffff',
      borderColor: '#dedee0',
      alignItems: 'center',
      flex: 1,
      padding: 10,
      height: 100, 
      borderRadius: 10,
      boxShadow:  '0px 4px 10px rgba(0, 0, 0, 0.10)',
    },

    imgMethod: {
      width: 50,
      height: 50,
      marginBottom: 5
      
    },

    textMethod: {
      fontFamily: 'PlusJakartaSemiBold',
      color: Colors.text,
      marginTop: -5,
      fontSize: 11,
    },

    containerMove: {
      borderWidth: 1,
      backgroundColor: '#ffffff',
      borderColor: '#dedee0',
      padding: 10,
      borderRadius: 10,
      boxShadow:  '0px 4px 10px rgba(0, 0, 0, 0.10)',
      width: '100%',
      flex: 1,
      marginTop: -15 
    },

    containerTitleMove: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  
    },

    blockMove: {
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      //borderWidth: 1
    },

    blockLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },

    blockRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      marginTop: -5
    },

    alinharRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5
    },

    imgMove: {
      width: 30,
      height: 30
    },

    titleMove: {
      fontFamily: 'PlusJakartaBold',
      fontSize: 14,
    },

    textMove: {
      fontFamily: 'PlusJakartaSemiBold',
      fontSize: 12,
      color:Colors.primary,
    },

    btnAcessMove: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5
    },

    contName: {
      marginLeft: 5
    },

    nomeColocado: {
      fontFamily: 'PlusJakartaBold',
      color: Colors.text,
      fontSize: 12
    },

    categoriaColocada: {
      fontFamily: 'PlusJakartaMedium',
      color: Colors.textSecondary,
      fontSize: 10,
      marginTop: -2
    },

    dateMove: {
      fontFamily: 'PlusJakartaSemiBold',
      color: Colors.textSecondary,
      fontSize: 10,
    },

    valueMove: {
      color: Colors.error,
      fontFamily: 'PlusJakartaSemiBold',
      fontSize: 13
    },

    line: {
    height: 1,
    backgroundColor: 'rgba(144, 144, 144, 0.5)',
    }

  }
)