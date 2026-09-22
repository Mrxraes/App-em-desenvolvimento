package com.bruno.MyFinances.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Token
 */
@Entity
public class TokenRedefinirSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(name = "usuario_id")
    private Long  usuario_id;

    @Column(nullable = false)
    private LocalDateTime expiracao;

    @Column(nullable = false)
    private boolean usado = false;

    public TokenRedefinirSenha(String token, Long usuarioId, LocalDateTime expiracao, boolean usado) {
        this.token = token;
        this.usuario_id = usuarioId;
        this.expiracao = expiracao;
        this.usado = usado;
    }
}