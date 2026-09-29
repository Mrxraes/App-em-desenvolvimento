package com.bruno.MyFinances.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.models.TokenConfirmarEmail;
import com.bruno.MyFinances.models.TokenLogin;
import com.bruno.MyFinances.models.TokenRedefinirSenha;
import com.bruno.MyFinances.models.Usuario;
import com.bruno.MyFinances.repository.TokenConfirmarEmailRepository;
import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.TokenRedefinirSenhaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

/**
 * CriatrToken
 */
@Service
public class Token {

    private final UsuarioRepository usuarioRepositorio;
    private final TokenRedefinirSenhaRepository TokenSRRepositorio;
    private final TokenConfirmarEmailRepository TokenCERepositorio;
    private final TokenLoginRepository tokenLoginRepository;

    public Token(UsuarioRepository usuarioRepositorio, TokenRedefinirSenhaRepository TokenRepositorio, TokenConfirmarEmailRepository TokenCERepositorio, TokenLoginRepository TokenLoginRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.TokenSRRepositorio = TokenRepositorio;
        this.TokenCERepositorio = TokenCERepositorio;
        this.tokenLoginRepository = TokenLoginRepositorio;
    }

    private String token;
    private LocalDateTime expiracao;


    public String inserirTokenConfirmarEmail(String emailFormatado) {
         try {
            String token = UUID.randomUUID().toString();
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

    public String criarTokenLogin(String emailFormatado) {
        try {
            token = UUID.randomUUID().toString();
            Long id = usuarioRepositorio.pegarId(emailFormatado);
            LocalDateTime criado_em = LocalDateTime.now();
            LocalDateTime ultimo_acesso = LocalDateTime.now();
            LocalDateTime expira_em = LocalDateTime.now().plusDays(30);
            boolean revogado = false;

            TokenLogin criarToken = new TokenLogin(token, criado_em, expira_em, ultimo_acesso, revogado, id);

            tokenLoginRepository.save(criarToken);

        } catch (Exception erro) {
            erro.printStackTrace();
        }
       

        return token;
    }

    private Long fk;
    private String tokenBD;

    public boolean validarToken(String token) {

        boolean tokenValido = false;
        boolean revogado = true;
        LocalDateTime expira_em = null;

        if (token != null) {
            Optional<TokenLogin> resultado = tokenLoginRepository.dadosTokenLogin(token);
            revogado = resultado.get().getRevogado();
            expira_em = resultado.get().getExpiraEm();
        }

        if (!revogado && expira_em.isAfter(LocalDateTime.now())) {
            tokenValido = true;
        }

        return tokenValido;
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