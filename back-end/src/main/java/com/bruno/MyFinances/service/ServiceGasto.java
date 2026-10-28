package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Saida;
import com.bruno.MyFinances.repository.SaidaRepository;
import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class ServiceGasto {

    private final SaidaRepository repoSaida;
    private final TokenLoginRepository tokenLoginRepositorio;

    public ServiceGasto(SaidaRepository repoSaida, TokenLoginRepository tokenLoginRepositorio) {
        this.repoSaida = repoSaida;
        this.tokenLoginRepositorio = tokenLoginRepositorio;
    }

    public  List<BigDecimal> gastoTotal(String token, LocalDateTime data) {
        List<BigDecimal> gastosDivididos = new ArrayList<>();
        Long id =  tokenLoginRepositorio.getId(token);
      
        
        BigDecimal valoresFixo = repoSaida.valoresFixo(id, data);
        BigDecimal valoresVariavel = repoSaida.valoresVariavel(id, data);
        BigDecimal valoresInvestimentos = repoSaida.valoresInvestimentos(id, data);
        BigDecimal valorTotal = repoSaida.contarValores(id, data);
        BigDecimal valueMonthBefore = repoSaida.contarValoresBeforeMonth(id, data.minusMonths(1)); 

        if (valoresFixo == null) {
            valoresFixo = BigDecimal.valueOf(0);
        } if (valoresVariavel == null) {
            valoresVariavel = BigDecimal.valueOf(0);
        } if (valoresInvestimentos == null) {
            valoresInvestimentos = BigDecimal.valueOf(0);
        } if (valorTotal == null) {
            valorTotal = BigDecimal.valueOf(0);
        } if (valueMonthBefore == null) {
            valueMonthBefore = BigDecimal.valueOf(0);
        }

         BigDecimal porcentagemDiferençaBig = null;

        if (valueMonthBefore == BigDecimal.valueOf(0) && valorTotal == BigDecimal.valueOf(0)) {
            porcentagemDiferençaBig = new BigDecimal(0);
        } else if (valueMonthBefore == BigDecimal.valueOf(0) && valorTotal != BigDecimal.valueOf(0)) {
            porcentagemDiferençaBig = valorTotal;
        } else {
            Double porcentagemDiferença = 
            (valorTotal.doubleValue() - valueMonthBefore.doubleValue()) 
            / valueMonthBefore.doubleValue() * 100;
            porcentagemDiferençaBig = new BigDecimal(porcentagemDiferença);   
        }

        gastosDivididos.add(valoresFixo);
        gastosDivididos.add(valoresVariavel);
        gastosDivididos.add(valoresInvestimentos);
        gastosDivididos.add(valorTotal);
        gastosDivididos.add(porcentagemDiferençaBig);
        return gastosDivididos;
    }

    public BigDecimal investimentosBeforeMonth(String token, LocalDateTime data) {
        Long id =  tokenLoginRepositorio.getId(token);

         BigDecimal valueMonthBefore = repoSaida.contarValoresBeforeMonthInvestimentos(id, data.minusMonths(1));

         if (valueMonthBefore == null) {
            valueMonthBefore = BigDecimal.valueOf(0);
        }

        return valueMonthBefore;
    }

    /* 
    public void todosGastos() throws InterruptedException {
        
        Long id =  tokenLoginRepositorio.getId(token);
        List<Saida> saidas = repoSaida.selectTodos(id);
        int lista = 0;
        for (Saida saida: saidas) {
            lista += 1;

            String nome = saida.getNome();

            LocalDate data = saida.getDataRegistro();
            DateTimeFormatter dataFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String dataPrint =  data.format(dataFormat);

            String tipo = saida.getTipo();

            BigDecimal valor = saida.getValor();
            String valorPrint = String.valueOf(valor);

            String obs = saida.getObs();

            digitar.digitar("| " + lista + ". Nome: " + nome +  " | Data: " + dataPrint + " | Tipo: " + tipo + " | Valor: R$" + valorPrint + " | Observações: " + obs + " |");

        }
    */
    }

