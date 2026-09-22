package com.bruno.MyFinances.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.Controller.ConfirmacoesTokens;
import com.bruno.MyFinances.models.TokenConfirmarEmail;
import com.bruno.MyFinances.models.TokenRedefinirSenha;
import com.bruno.MyFinances.repository.TokenConfirmarEmailRepository;
import com.bruno.MyFinances.repository.TokenRedefinirSenhaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

/**
 * CriatrToken
 */
@Service
public class CriarToken {

    private final UsuarioRepository usuarioRepositorio;
    private final TokenRedefinirSenhaRepository TokenSRRepositorio;
    private final TokenConfirmarEmailRepository TokenCERepositorio;

    public CriarToken(UsuarioRepository usuarioRepositorio, TokenRedefinirSenhaRepository TokenRepositorio, TokenConfirmarEmailRepository TokenCERepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.TokenSRRepositorio = TokenRepositorio;
        this.TokenCERepositorio = TokenCERepositorio;
    }

    private String token;
    private LocalDateTime expiracao;

    public String inserirTokenConfirmarEmail(String emailFormatado) {
         try {
            token = UUID.randomUUID().toString();
            Long id = usuarioRepositorio.pegarId(emailFormatado);
            expiracao = LocalDateTime.now().plusMinutes(30);
            TokenConfirmarEmail criarToken = new TokenConfirmarEmail(token, id, expiracao, false);
            TokenCERepositorio.save(criarToken);


        } catch (Exception erro) {
            erro.printStackTrace();
        }
       

        return token;
    }
    

    public String criarTokenRedefinirSenha(String emailFormatado) {
        try {
            token = UUID.randomUUID().toString();
            Long id = usuarioRepositorio.pegarId(emailFormatado);
            expiracao = LocalDateTime.now().plusMinutes(30);
            TokenRedefinirSenha criarToken = new TokenRedefinirSenha(token, id, expiracao, false);
            TokenSRRepositorio.save(criarToken);

        } catch (Exception erro) {
            erro.printStackTrace();
        }
       

        return token;
    }

      public String criarTokenConfirmarCadastro(String emailFormatado) {
        try {
            token = UUID.randomUUID().toString();
            Long id = usuarioRepositorio.pegarId(emailFormatado);
            expiracao = LocalDateTime.now().plusMinutes(30);
            TokenConfirmarEmail criarToken = new TokenConfirmarEmail(token, id, expiracao, false);
            TokenCERepositorio.save(criarToken);

        } catch (Exception erro) {
            erro.printStackTrace();
        }
       

        return token;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getDateTime() {
        return expiracao;
    }

    public String getLink() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getLink'");
    }
}