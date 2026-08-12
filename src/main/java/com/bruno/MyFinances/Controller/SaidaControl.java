package com.bruno.MyFinances.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    String nome;
    LocalDate data = null;
    String tipo = "";
    String escolherDate;
    BigDecimal valor;
    String obs = "";
    String EscolhaObs;
    //metodo que pega o id do user 

        
        while (true) { 
            digitar.digitar("| SAIDAS |");
            digitar.digitar("Qual o nome que deseja dar saida?");
            digitar.digitar("Exemplo: mercado, padaria, luz, água, investimento...");
            nome = digitar.ler().trim();

            if (nome.equals("")) {
                digitar.digitar("Nome da saída não pode ser vazio");
            }

            digitar.digitar("Qual a data dessa saída? Digite 'HOJE' para definir a data de agora ou 'DEFINIR' para informar a data que deseja.");
            escolherDate = digitar.ler().toUpperCase().trim();

            if (escolherDate.equals("HOJE")) {
                data = LocalDate.now();
            } else if (escolherDate.equals("DEFINIR")) {
                String dataDigitada = digitar.ler();
                data = LocalDate.parse(dataDigitada);
            } else {
                digitar.digitar("| OPÇÃO INVÁLIDA |");
            }

            digitar.digitar("Qual o tipo de saída? Digite '1' para FIXA e '2' para VARIÁVEL e '3' para INVESTIMENTOS");
            String escolhaTipo = digitar.ler().toUpperCase().trim();

            if (escolhaTipo.equals("1") || escolhaTipo.equals("FIXA")) {
                tipo = "FIXA";
            } else if (escolhaTipo.equals("2") || escolhaTipo.equals("VARIÁVEL") || escolhaTipo.equals("VARIAVEL") ) {
                tipo = "VARIAVEL";
            } else if (escolhaTipo.equals("3") || escolhaTipo.equals("INVESTIMENTOS")) {
                tipo = "INVESTIMENTOS";
            } else {
                digitar.digitar("| OPÇÃO INVÁLIDA |");
            }

            digitar.digitar("Qual o valor dessa saída?");
            String valorText = digitar.ler();
            valor = new BigDecimal(valorText);

            digitar.digitar("Deseja colocar observações? Responda 'SIM' ou 'NÃO'");
            EscolhaObs = digitar.ler().toUpperCase().trim();

            if (EscolhaObs.equals("SIM")) {
                digitar.digitar("Escreva as suas observações:");
                obs = digitar.ler();
            } else if (EscolhaObs.equals("NÃO") || EscolhaObs.equals("NAO")) {
                obs = "Sem observações";
            } else {
                digitar.digitar("| OPÇÃO INVÁLIDA |");
            }
            // Se nenhum dado for null, chamar o service que cria saidas, este deve retornar true or false conforme o sucesso de criação enviar 'model/Saida' pro sgbd

            if (!nome.isEmpty() && data != null && !tipo.isEmpty() && valor != null && !obs.isEmpty()) {
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
