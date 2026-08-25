package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.Saida;
import com.bruno.MyFinances.repository.SaidaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

/**
 * CriarSaida
 */
@Service
public class CriarSaida {

    private final SaidaRepository repoSaida;
    private final UsuarioRepository repoUsuario;
    private final Email email;

    public CriarSaida(SaidaRepository repoSaida, Email email, UsuarioRepository repoUsuario) {
        this.repoSaida = repoSaida;
        this.email = email;
        this.repoUsuario = repoUsuario;
    }

    private boolean saidaSalva;

  

    public void criarSaidas(String nome, LocalDate data, String tipo, BigDecimal valor, String obs) {
        String pegarEmail = email.getEmail();
	    BigInteger fk = repoUsuario.pegarId(pegarEmail);
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