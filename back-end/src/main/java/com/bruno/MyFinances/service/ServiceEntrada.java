package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Entrada;
import com.bruno.MyFinances.repository.EntradaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class ServiceEntrada {

    private final EntradaRepository repoEntrada;
    private final UsuarioRepository repoUsuario;
    private final Email email;
    private final Digitacao digitar;

    public ServiceEntrada(EntradaRepository repoEntrada, UsuarioRepository repositorio, Email existeEmail, Digitacao digitar) {
        this.repoEntrada = repoEntrada;
        this.repoUsuario = repositorio;
        this.email = existeEmail;
        this.digitar = digitar;
    }

    public  List<BigDecimal> entradaTotal() {
        List<BigDecimal> gastosDivididos = new ArrayList<>();
        //String email = existeEmail.getEmail();
        //BigInteger id = repositorio.pegarId(email);
        BigInteger id = BigInteger.valueOf(10);
        
        BigDecimal valoresSalario = repoEntrada.valoresSalario(id);
        BigDecimal valoresExtra = repoEntrada.valoresExtra(id);
        BigDecimal valoresRendimento = repoEntrada.valoresRendimentos(id);
        BigDecimal valorTotal = repoEntrada.contarValores(id); 
        if (valoresSalario == null) {
            valoresSalario = BigDecimal.valueOf(0);
        } if (valoresExtra == null) {
            valoresExtra = BigDecimal.valueOf(0);
        } if (valoresRendimento == null) {
            valoresRendimento = BigDecimal.valueOf(0);
        } if (valorTotal == null) {
            valorTotal = BigDecimal.valueOf(0);
        }
        gastosDivididos.add(valoresSalario);
        gastosDivididos.add(valoresExtra);
        gastosDivididos.add(valoresRendimento);
        gastosDivididos.add(valorTotal);
        System.out.println(gastosDivididos);
        return gastosDivididos;
    }

    public void todasEntradas() throws InterruptedException {
        //String email = existeEmail.getEmail();
        //BigInteger id = repositorio.pegarId(email);
        BigInteger id = BigInteger.valueOf(10);
        List<Entrada> entradas = repoEntrada.selectTodos(id);
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

            digitar.digitar("| " + lista + ". Nome: " + nome +  " | Data: " + dataPrint + " | Tipo: " + tipo + " | Valor: R$" + valorPrint + " | Observações: " + obs + " |");

        }
    }

     private boolean sucesso;

    public void criarEntradas(String nome, LocalDate data, BigDecimal valor, String obs, String tipo) {
        String pegarEmail = email.getEmail();
        BigInteger fk = repoUsuario.pegarId(pegarEmail);
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
