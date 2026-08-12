package com.bruno.MyFinances.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.stereotype.Controller;

import com.bruno.MyFinances.service.CriarEntradas;
import com.bruno.MyFinances.service.Digitacao;

@Controller
public class EntradaControl {
    private final Digitacao digitar;
    private final CriarEntradas CriarEntradas;

    public EntradaControl(Digitacao digitacao, CriarEntradas CriarEntradas) {
        this.digitar = digitacao;
        this.CriarEntradas = CriarEntradas;
    }

    public void entradas() throws InterruptedException {

        String nome = null;
        LocalDate data = null;
        String tipo = "";
        String escolherDate;
        BigDecimal valor = null;
        String obs = "";
        String EscolhaObs;

        boolean sair = false;

        // metodo que pega o id do user

        while (sair == false) {

            boolean nomeCerto = false;
            boolean dataCerta = false;
            boolean tipoCerto = false;
            boolean valorCerto = false;
            boolean obsCerto = false;

            digitar.digitar("| ENTRADA |");
            digitar.digitar("| Digite 'VOLTAR' caso deseje retornar. |");

            // NOME
            while (nomeCerto == false) {

                digitar.digitar("Qual o nome que deseja dar a entrada?");
                digitar.digitar("Exemplo: salário, renda extra, rendimento...");

                nome = digitar.ler().trim().toLowerCase();

                if (nome.equals("")) {
                    digitar.digitar("Nome da entrada não pode ser vazio");

                } else if (nome.equals("voltar")) {
                    sair = true;
                    break;

                } else {
                    nomeCerto = true;
                }
            }

            // DATA
            if (sair == false) {

                while (dataCerta == false) {

                    digitar.digitar(
                        "Qual a data dessa entrada? Digite 'HOJE' para definir a data de agora ou 'DEFINIR' para informar a data que deseja."
                    );

                    escolherDate = digitar.ler().toUpperCase().trim();

                    if (escolherDate.equals("HOJE")) {

                        data = LocalDate.now();
                        dataCerta = true;

                    } else if (escolherDate.equals("DEFINIR")) {

                        digitar.digitar("Digite a data da entrada:");

                        String dataDigitada = digitar.ler();

                        try {

                            DateTimeFormatter dataFormatada =
                                    DateTimeFormatter.ofPattern("dd/MM/yyyy");

                            data = LocalDate.parse(dataDigitada, dataFormatada);
                            dataCerta = true;

                        } catch (DateTimeParseException e) {

                            digitar.digitar("| DATA INVÁLIDA |");
                        }

                    } else if (escolherDate.equals("VOLTAR")) {

                        sair = true;
                        break;

                    } else {

                        digitar.digitar("| OPÇÃO INVÁLIDA |");
                    }
                }
            }

            // TIPO
            if (sair == false) {

                while (tipoCerto == false) {

                    digitar.digitar(
                        "Qual o tipo de entrada? Digite '1' para SALÁRIO e '2' para EXTRA e '3' para RENDIMENTOS"
                    );

                    String escolhaTipo = digitar.ler().toUpperCase().trim();

                    if (escolhaTipo.equals("1")
                            || escolhaTipo.equals("SALÁRIO")
                            || escolhaTipo.equals("SALARIO")) {

                        tipo = "SALARIO";
                        tipoCerto = true;

                    } else if (escolhaTipo.equals("2")
                            || escolhaTipo.equals("EXTRA")) {

                        tipo = "EXTRA";
                        tipoCerto = true;

                    } else if (escolhaTipo.equals("3")
                            || escolhaTipo.equals("RENDIMENTOS")) {

                        tipo = "RENDIMENTOS";
                        tipoCerto = true;

                    } else if (escolhaTipo.equals("VOLTAR")) {

                        sair = true;
                        break;

                    } else {

                        digitar.digitar("| OPÇÃO INVÁLIDA |");
                    }
                }
            }

            // VALOR
            if (sair == false) {

                while (valorCerto == false) {

                    digitar.digitar("Qual o valor dessa entrada?");

                    String valorText = digitar.ler();

                    if (valorText.matches("\\d+")) {

                        valor = new BigDecimal(valorText);
                        valorCerto = true;

                    } else if (valorText.equalsIgnoreCase("VOLTAR")) {

                        sair = true;
                        break;

                    } else {

                        digitar.digitar("| Digite apenas números. |");
                    }
                }
            }

            // OBSERVAÇÕES
            if (sair == false) {

                while (obsCerto == false) {

                    digitar.digitar(
                        "Deseja colocar observações? Responda 'SIM' ou 'NÃO'"
                    );

                    EscolhaObs = digitar.ler().toUpperCase().trim();

                    if (EscolhaObs.equals("SIM")) {

                        digitar.digitar("Escreva as suas observações:");

                        obs = digitar.ler().trim();

                        if (obs != null && !obs.equals("")) {

                            obsCerto = true;

                        } else {

                            digitar.digitar("Suas observações ficaram vazias!");
                        }

                    } else if (EscolhaObs.equals("NÃO")
                            || EscolhaObs.equals("NAO")) {

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

            // CRIAÇÃO DA ENTRADA
            if (!nome.isEmpty()
                    && data != null
                    && !tipo.isEmpty()
                    && valor != null
                    && !obs.isEmpty()
                    && sair == false) {

                CriarEntradas.criarEntradas(
                    nome,
                    data,
                    valor,
                    obs,
                    tipo
                );

                if (CriarEntradas.getEntradaSalva()) {

                    digitar.digitar("| Entrada registrada com sucesso! |");
                    break;

                } else {

                    digitar.digitar(
                        "| Não foi possível registrar essa entrada. Tente novamente. |"
                    );
                }
            }
        }
    }
}