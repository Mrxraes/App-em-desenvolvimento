package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Saida;
import com.bruno.MyFinances.repository.SaidaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class ServiceGasto {

    private final SaidaRepository repoSaida;
    private final UsuarioRepository repositorio;
    private final Email existeEmail;
    private final Digitacao digitar;

    public ServiceGasto(SaidaRepository repoSaida, UsuarioRepository repositorio, Email existeEmail, Digitacao digitar) {
        this.repoSaida = repoSaida;
        this.repositorio = repositorio;
        this.existeEmail = existeEmail;
        this.digitar = digitar;
    }

    public  List<BigDecimal> gastoTotal() {
        List<BigDecimal> gastosDivididos = new ArrayList<>();
        //String email = existeEmail.getEmail();
        //BigInteger id = repositorio.pegarId(email);
        BigInteger id = BigInteger.valueOf(10);
        
        BigDecimal valoresFixo = repoSaida.valoresFixo(id);
        BigDecimal valoresVariavel = repoSaida.valoresVariavel(id);
        BigDecimal valoresInvestimentos = repoSaida.valoresInvestimentos(id);
        BigDecimal valorTotal = repoSaida.contarValores(id); 
        if (valoresFixo == null) {
            valoresFixo = BigDecimal.valueOf(0);
        } if (valoresVariavel == null) {
            valoresVariavel = BigDecimal.valueOf(0);
        } if (valoresInvestimentos == null) {
            valoresInvestimentos = BigDecimal.valueOf(0);
        } if (valorTotal == null) {
            valorTotal = BigDecimal.valueOf(0);
        }
        gastosDivididos.add(valoresFixo);
        gastosDivididos.add(valoresVariavel);
        gastosDivididos.add(valoresInvestimentos);
        gastosDivididos.add(valorTotal);
        return gastosDivididos;
    }

    public void todosGastos() throws InterruptedException {
        //String email = existeEmail.getEmail();
        //BigInteger id = repositorio.pegarId(email);
        BigInteger id = BigInteger.valueOf(10);
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
    }
}
