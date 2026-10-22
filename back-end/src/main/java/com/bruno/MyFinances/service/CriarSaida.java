package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Saida;
import com.bruno.MyFinances.models.Usuario;
import com.bruno.MyFinances.repository.SaidaRepository;
import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

/**
 * CriarSaida
 */
@Service
public class CriarSaida {

    private final SaidaRepository repoSaida;
    private final TokenLoginRepository tokenLoginRepositorio;
    private final Email email;

    public CriarSaida(SaidaRepository repoSaida, Email email, TokenLoginRepository tokenLoginRepositorio) {
        this.repoSaida = repoSaida;
        this.email = email;
        this.tokenLoginRepositorio = tokenLoginRepositorio;
    }

    private boolean saidaSalva;

  

    public void criarSaidas(String nome, LocalDateTime data, String tipo, BigDecimal valor, String obs, String token) {
	    Long fk = tokenLoginRepositorio.getId(token);
        Saida criar = new Saida(nome, data, tipo, valor, obs, fk);
            try {
                repoSaida.save(criar);
                setSalvarSaida(true);
            } catch (Exception e) {
                e.printStackTrace();
                setSalvarSaida(false);
            }
    }

    public void setSalvarSaida(boolean saidaSalva) {
        this.saidaSalva = saidaSalva;
    }

    public boolean getSalvarSaida() {
        return saidaSalva; 
    }
}