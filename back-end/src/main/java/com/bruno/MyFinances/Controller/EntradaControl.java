package com.bruno.MyFinances.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.EntradaCriadaResponse;
import com.bruno.MyFinances.dto.EntradaRequest;
import com.bruno.MyFinances.dto.EntradaResponse;
import com.bruno.MyFinances.service.ServiceEntrada;
import com.bruno.MyFinances.service.Digitacao;

@RestController
@RequestMapping("/api")

public class EntradaControl {
    private final ServiceEntrada serviceEntradas;

    public EntradaControl(ServiceEntrada serviceEntradas) {
        this.serviceEntradas = serviceEntradas;
    }

    private String token;
    private LocalDateTime data;

    public void entradaMensal() throws InterruptedException {
        //serviceEntradas.todasEntradas();
    }

    @PostMapping("/dadosEntrada")
    public EntradaResponse dadosEntrada(@RequestBody EntradaRequest request) {
        token = request.getToken();
        data = request.getData();

        List<BigDecimal> soma = serviceEntradas.entradaTotal(token, data);
        String valorSalario = String.valueOf(soma.get(0));
        String valorExtra = String.valueOf(soma.get(1));
        String valorRendimento = String.valueOf(soma.get(2));
        String valorTotal = String.valueOf(soma.get(3));

        int  porcentagemDiferençaInt = soma.get(4).intValue();
        String porcentagemDiferença = String.valueOf(porcentagemDiferençaInt);

        return new EntradaResponse(valorSalario , valorExtra , valorRendimento, valorTotal, porcentagemDiferença);

    }

    @PostMapping("/salvarEntrada")
public EntradaCriadaResponse registrarEntradas(
        @RequestBody EntradaRequest request) {

    String token = request.getToken();

    String nome = request.getNome(); // VERIFICADO

    LocalDateTime data = request.getData(); // JÁ VEM CORRETO

    String tipo = ""; // RECEBE COM A FORMATAÇÃO CORRETA
    String escolhaTipo = request.getTipo(); // VERIFICADO

    BigDecimal valor = request.getValor(); // JÁ VEM CORRETO

    String obs = request.getObservacao(); // VERIFICADO

    String mensagemNome = "";
    String mensagemValor = "";
    String mensagemObs = "";
    String mensagemSucesso = "";

    //
    // VALIDAÇÕES
    //

    boolean nomeCerto = false;
    boolean valorCerto = false;
    boolean obsCerto = false;
    boolean entradaSalva = false;

    //
    // NOME
    //

    if (nome == null || nome.equals("")) {

        mensagemNome = "O nome da entrada não pode ser vazio";

    } else if (nome.length() > 255) {

        mensagemNome = "O nome não pode possuir mais de 255 caracteres";

    } else {

        nomeCerto = true;
    }

    //
    // TIPO
    //

    if (escolhaTipo != null) {

        if (escolhaTipo.equalsIgnoreCase("SALARIO")
                || escolhaTipo.equalsIgnoreCase("SALÁRIO")) {

            tipo = "SALARIO";

        } else if (escolhaTipo.equalsIgnoreCase("EXTRA")) {

            tipo = "EXTRA";

        } else if (escolhaTipo.equalsIgnoreCase("RENDIMENTO")) {

            tipo = "RENDIMENTOS";
        }
    }

    //
    // VALOR
    //

    if (valor == null) {

        mensagemValor = "O valor não pode ser vazio.";

    } else {

        valorCerto = true;
    }

    //
    // OBSERVAÇÕES
    //

    if (obs == null || obs.equals("")) {

        obs = "Sem observações";
        obsCerto = true;

    } else if (obs.length() <= 255) {

        obsCerto = true;

    } else if (obs.length() > 255) {

        mensagemObs = "A observação não pode possuir mais de 255 caracteres";
    }

    //
    // SALVAR ENTRADA
    //

    if (nomeCerto
            && data != null
            && !tipo.isEmpty()
            && valorCerto
            && obsCerto) {

        serviceEntradas.criarEntradas(
                nome,
                data,
                valor,
                obs,
                tipo,
                token
        );

        if (serviceEntradas.getEntradaSalva()) {

            mensagemSucesso = "Entrada registrada com sucesso!";
            entradaSalva = true;

        } else {

            mensagemSucesso =
                    "Não foi possível registrar essa entrada. Tente novamente.";
        }
    }

        return new EntradaCriadaResponse(
                mensagemNome,
                mensagemValor,
                mensagemObs,
                mensagemSucesso,
                nomeCerto,
                valorCerto,
                obsCerto,
                entradaSalva
        );
    }
}