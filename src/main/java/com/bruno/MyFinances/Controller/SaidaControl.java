package com.bruno.MyFinances.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.stereotype.Controller;

import com.bruno.MyFinances.service.CriarSaida;
import com.bruno.MyFinances.service.Digitacao;

@Controller
public class SaidaControl {
    private final Digitacao digitar;
    private final CriarSaida criarSaidaMet;

    public SaidaControl(Digitacao digitacao,  CriarSaida criarSaidaMet) {
        this.digitar = digitacao;
        this.criarSaidaMet = criarSaidaMet;
    }
    

    public void saidas() throws InterruptedException {

    String nome = null;
    LocalDate data = null;
    String tipo = "";
    String escolherDate;
    BigDecimal valor = null;
    String obs = "";
    String EscolhaObs;
    

   
    boolean sair = false;



    //metodo que pega o id do user 

        
        while (sair == false) { 
            boolean nomeCerto = false;
            boolean dataCerta = false;
            boolean tipoCerto = false;
            boolean valorCerto = false;
            boolean obsCerto = false;
            digitar.digitar("| SAIDAS |");
            digitar.digitar("| Digite 'VOLTAR' caso deseje retornar. |");

                while (nomeCerto == false) {
                    digitar.digitar("Qual o nome que deseja dar a saida?");
                    digitar.digitar("Exemplo: mercado, padaria, luz, água, investimento...");
                    nome = digitar.ler().trim().toLowerCase();
                    if (nome.equals("")) {
                        digitar.digitar("Nome da saída não pode ser vazio");
                    } else if (nome.equals("voltar")) {
                        sair = true;
                        break;
                    } else {
                        nomeCerto = true;
                    }
                }
                
            if (sair == false) {
                while (dataCerta == false) {
                        digitar.digitar("Qual a data dessa saída? Digite 'HOJE' para definir a data de agora ou 'DEFINIR' para informar a data que deseja.");
                        escolherDate = digitar.ler().toUpperCase().trim();

                        if (escolherDate.equals("HOJE")) {
                            data = LocalDate.now();
                            dataCerta = true;
                        } else if (escolherDate.equals("DEFINIR")) {
                            digitar.digitar("Digite a data da saída:");
                            String dataDigitada = digitar.ler();
                            try {
                                DateTimeFormatter dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy");                            
                                data = LocalDate.parse(dataDigitada, dataFormatada);
                                dataCerta = true;
                                    
                            } catch (DateTimeParseException e) {
                                    digitar.digitar("| DATA INVÁLIDA |");
                            }
                        } else if (escolherDate.equals("VOLTAR")) {
                        sair = true;
                        break;
                        }  else {
                            digitar.digitar("| OPÇÃO INVÁLIDA |");
                        }
                    }
            }

            if (sair == false) {
                while (tipoCerto == false) {    
                    digitar.digitar("Qual o tipo de saída? Digite '1' para FIXA e '2' para VARIÁVEL e '3' para INVESTIMENTOS");
                    String escolhaTipo = digitar.ler().toUpperCase().trim();

                    if (escolhaTipo.equals("1") || escolhaTipo.equals("FIXA")) {
                        tipo = "FIXA";
                        tipoCerto= true;
                    } else if (escolhaTipo.equals("2") || escolhaTipo.equals("VARIÁVEL") || escolhaTipo.equals("VARIAVEL") ) {
                        tipo = "VARIAVEL";
                        tipoCerto= true;
                    } else if (escolhaTipo.equals("3") || escolhaTipo.equals("INVESTIMENTOS")) {
                        tipo = "INVESTIMENTOS";
                        tipoCerto= true;
                    } else if (escolhaTipo.equals("VOLTAR")) {
                        sair = true;
                        break;
                    } else {
                        digitar.digitar("| OPÇÃO INVÁLIDA |");
                    }
                }
            }
            
            if (sair == false) {
                while (valorCerto == false) {
                    digitar.digitar("Qual o valor dessa saída?");
                    String valorText = digitar.ler();
                    
                    if (valorText.matches("\\d+")) {
                        valor = new BigDecimal(valorText);
                        valorCerto = true;
                    } else if (valorText.equals("VOLTAR")) {
                        sair = true;
                        break;
                    } else if (!valorText.matches("\\d+")) {
                        digitar.digitar("| Digite apenas números. |");
                    } else {
                        digitar.digitar("| OPÇÃO INVÁLIDA |");
                    }
                }
            }

            if (sair == false) {
                while (obsCerto == false) {
                    digitar.digitar("Deseja colocar observações? Responda 'SIM' ou 'NÃO'");
                    EscolhaObs = digitar.ler().toUpperCase().trim();

                    if (EscolhaObs.equals("SIM")) {
                        digitar.digitar("Escreva as suas observações:");
                        obs = digitar.ler().trim();
                            if (obs != null && !obs.equals("")) {
                                obsCerto = true;
                            } else {
                                digitar.digitar("Suas observações ficaram vazias!");
                            }
                    } else if (EscolhaObs.equals("NÃO") || EscolhaObs.equals("NAO")) {
                        obs = "Sem observações";
                        obsCerto = true;
                    } else if (EscolhaObs.equals("VOLTAR")) {
                        sair = true;
                        break;
                    } else {
                        digitar.digitar("| OPÇÃO INVÁLIDA |");
                    }
                }
            }
            // Se nenhum dado for null, chamar o service que cria saidas, este deve retornar true or false conforme o sucesso de criação enviar 'model/Saida' pro sgbd

            if (!nome.isEmpty() && data != null && !tipo.isEmpty() && valor != null && !obs.isEmpty() && sair == false) {
                criarSaidaMet.criarSaidas(nome, data, tipo, valor, obs);
                if (criarSaidaMet.getSalvarSaida()) {
                    digitar.digitar("| Saida registrada com sucesso! |");
                    break;
                } else {
                    digitar.digitar("| Não foi possível registrar essa saida. Tente novamente. |");
                } 
            }

        }    
    }
}
