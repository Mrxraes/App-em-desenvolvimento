package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Entrada;
import com.bruno.MyFinances.models.Usuario;
import com.bruno.MyFinances.repository.EntradaRepository;
import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class ServiceEntrada {

    private final EntradaRepository repoEntrada;
    private final UsuarioRepository repoUsuario;
    private final Email email;
    private final TokenLoginRepository tokenLoginRepositorio;

    public ServiceEntrada(EntradaRepository repoEntrada, UsuarioRepository repositorio, Email existeEmail, TokenLoginRepository tokenLoginRepositorio) {
        this.repoEntrada = repoEntrada;
        this.repoUsuario = repositorio;
        this.email = existeEmail;
        this.tokenLoginRepositorio = tokenLoginRepositorio;
    }

    public  List<BigDecimal> entradaTotal(String token, LocalDateTime data) {
        List<BigDecimal> entradasDivididos = new ArrayList<>();
        Long id = tokenLoginRepositorio.getId(token);
        
        
        BigDecimal valoresSalario = repoEntrada.valoresSalario(id, data);
        BigDecimal valoresExtra = repoEntrada.valoresExtra(id, data);
        BigDecimal valoresRendimento = repoEntrada.valoresRendimentos(id, data);
        BigDecimal valorTotal = repoEntrada.contarValores(id, data); 
        if (valoresSalario == null) {
            valoresSalario = BigDecimal.valueOf(0);
        } if (valoresExtra == null) {
            valoresExtra = BigDecimal.valueOf(0);
        } if (valoresRendimento == null) {
            valoresRendimento = BigDecimal.valueOf(0);
        } if (valorTotal == null) {
            valorTotal = BigDecimal.valueOf(0);
        }
        entradasDivididos.add(valoresSalario);
        entradasDivididos.add(valoresExtra);
        entradasDivididos.add(valoresRendimento);
        entradasDivididos.add(valorTotal);
        System.out.println(entradasDivididos);
        return entradasDivididos;
    }

    public void todasEntradas(String token, LocalDateTime dataR) throws InterruptedException {
        Long id = tokenLoginRepositorio.getId(token);
        List<Entrada> entradas = repoEntrada.selectTodos(id, dataR);
        int lista = 0;
        for (Entrada entrada: entradas) {
            lista += 1;

            String nome = entrada.getNome();

            LocalDate data = entrada.getDataRegistro();
            DateTimeFormatter dataFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String dataPrint =  data.format(dataFormat);

            String tipo = entrada.getTipo();

            BigDecimal valor = entrada.getValor();
            String valorPrint = String.valueOf(valor);

            String obs = entrada.getObs();

        }
    }

     private boolean sucesso;

    public void criarEntradas(String nome, LocalDate data, BigDecimal valor, String obs, String tipo) {
        String pegarEmail = email.getEmail();
        Long fk = repoUsuario.pegarId(pegarEmail);
        Entrada criar = new Entrada(nome, data, valor, obs, fk, tipo);
        try {
            repoEntrada.save(criar);
            setEntradaSalva(true);
        } catch (Exception e) {
            e.printStackTrace();
            setEntradaSalva(false);
        }
    }

    public void setEntradaSalva(boolean salvo) {
        sucesso = salvo;
    }

    public boolean getEntradaSalva() {
        return sucesso;
    }
}
