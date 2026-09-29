package com.bruno.MyFinances.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TokenLogin {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private LocalDateTime criado_em;

    @Column(nullable = false)
    private LocalDateTime expira_em;

    @Column(nullable = false)
    private LocalDateTime ultimo_acesso;

    @Column(nullable = false)
    private boolean revogado;

    @Column(nullable = false)
    private Long usuario_id;

    public TokenLogin() {
        
    }

    public TokenLogin(String token, LocalDateTime criado_em, LocalDateTime expira_em, LocalDateTime ultimo_acesso, boolean revogado , Long usuario_id) {
        this.token = token;
        this.criado_em = criado_em;
        this.expira_em = expira_em;
        this.ultimo_acesso = ultimo_acesso;
        this.revogado = revogado;
        this.usuario_id = usuario_id;
    }

    // revogado é false
    // expirado é after now()
    // token is equals
    // usuario id é igual ao email

    public LocalDateTime getExpiraEm() {
        return expira_em;
    }

    public String getToken() {
        return token;
    }

    public boolean getRevogado() {
        return revogado;
    }

    public Long getFk() {
        return usuario_id;
    }


}
