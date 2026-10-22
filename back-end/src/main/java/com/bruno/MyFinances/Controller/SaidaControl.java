package com.bruno.MyFinances.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.service.ServiceGasto;
import com.bruno.MyFinances.dto.SaidaCriadaResponse;
import com.bruno.MyFinances.dto.SaidaRequest;
import com.bruno.MyFinances.dto.SaidaResponse;
import com.bruno.MyFinances.service.CriarSaida;
import com.bruno.MyFinances.service.Digitacao;

@RestController
@RequestMapping("/api")

public class SaidaControl {

    private final Digitacao digitar;
    private final CriarSaida criarSaidaMet;
    private final ServiceGasto gasto;

    public SaidaControl(Digitacao digitacao,  CriarSaida criarSaidaMet, ServiceGasto gasto) {
        this.digitar = digitacao;
        this.criarSaidaMet = criarSaidaMet;
        this.gasto = gasto;
    }
   

    public void verTotGastos() throws InterruptedException {
        //gasto.todosGastos();
    }

    private String token;
    private LocalDateTime data;

    @PostMapping("/dadosSaida")
    public SaidaResponse consultarGasto(@RequestBody SaidaRequest request) {
        token = request.getToken();
        data = request.getData();
        List<BigDecimal> soma = gasto.gastoTotal(token, data);
        String valorFixo = String.valueOf(soma.get(0));
        String valorVariavel = String.valueOf(soma.get(1));
        String valorInvestimentos = String.valueOf(soma.get(2));
        String valorTotal = String.valueOf(soma.get(3));
       
        int  porcentagemDiferençaInt = soma.get(4).intValue();
        String porcentagemDiferença = String.valueOf(porcentagemDiferençaInt);

        return new SaidaResponse(valorFixo , valorVariavel , valorInvestimentos, valorTotal, porcentagemDiferença);

    }

    @PostMapping("/salvarSaida")
    public SaidaCriadaResponse registrarSaidas(@RequestBody SaidaRequest request) {

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
    //  VALIDAÇÕES
    //

    boolean nomeCerto = false;
    boolean valorCerto = false;
    boolean obsCerto = false;
    boolean saidaSalva = false;
    
    //
    //  NOME
    //
    
    if (nome.equals("")) {
        mensagemNome = "O nome da saída não pode ser vazio";
    } else if (nome.length() > 255) {
        mensagemNome = "O nome não pode possuir mais de 255 caracteres";
    } else {
        nomeCerto = true;
    }
                
    //
    //  TIPO
    //       
            
    if (escolhaTipo.equalsIgnoreCase("FIXO")) {
        tipo = "FIXA";
    } else if (escolhaTipo.equalsIgnoreCase("VARIAVEL")) {
        tipo = "VARIAVEL";
    } else if (escolhaTipo.equalsIgnoreCase("INVESTIMENTO")) {
        tipo = "INVESTIMENTOS";
    } 
    
    //
    //  VALOR
    //

    if (valor == null) {
        mensagemValor = "O valor não pode ser vazio.";
    } else if (valor != null) {
        valorCerto = true;
    }

    //
    //  OBSERVAÇÕES
    //
                 
    if (!obs.equals("") && obs.length() <= 255) {
        obsCerto = true;
    } else if (obs.equals("")) {
        obs = "Sem observações";
        obsCerto = true;
    } else if (obs.length() > 255) {
        mensagemObs = "O nome não pode possuir mais de 255 caracteres";
    }

    //
    //  SALVAR SAIDA
    //  
        
    if (!nome.isEmpty() && data != null && !tipo.isEmpty() && valor != null && !obs.isEmpty()) {
        criarSaidaMet.criarSaidas(nome, data, tipo, valor, obs, token);
        if (criarSaidaMet.getSalvarSaida()) {
            mensagemSucesso = "Saida registrada com sucesso!"; 
            saidaSalva = true;
        } else {
            mensagemSucesso = "Não foi possível registrar essa saida. Tente novamente.";
        } 
    }

    return new SaidaCriadaResponse(
    mensagemNome,
    mensagemValor,
    mensagemObs,
    mensagemSucesso,
    nomeCerto,
    valorCerto,
    obsCerto,
    saidaSalva
    );

        }    
    }

