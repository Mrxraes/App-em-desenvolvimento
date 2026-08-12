package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Entrada;
import com.bruno.MyFinances.repository.EntradaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

/**
 * CriarEntradas
 */
@Service
public class CriarEntradas {

    private final Email email;
    private final UsuarioRepository repoUsuario;
    private final EntradaRepository repoEntrada;

    public CriarEntradas (Email email, UsuarioRepository repositorio, EntradaRepository repoEntrada) {
        this.email = email;
        this.repoUsuario = repositorio;
        this.repoEntrada = repoEntrada;
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