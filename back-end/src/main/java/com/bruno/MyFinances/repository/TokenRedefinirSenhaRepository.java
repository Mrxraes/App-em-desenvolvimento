package com.bruno.MyFinances.repository;


import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bruno.MyFinances.models.TokenRedefinirSenha;

import jakarta.transaction.Transactional;


/**
 * TokenRepository
 */
public interface TokenRedefinirSenhaRepository extends JpaRepository<TokenRedefinirSenha, Long> {
        @Query(value="""
                SELECT expiracao FROM token_redefinir_senha WHERE token = :token
                """, nativeQuery = true
        )
        LocalDateTime getDate(@Param("token") String token);

        
        @Query(value="""
                SELECT token FROM token_redefinir_senha WHERE token = :token
                """, nativeQuery = true
        )
        String getToken(@Param("token") String token);

        @Query(value="""
                SELECT usado FROM token_redefinir_senha WHERE token = :token
                """, nativeQuery = true
        )
        Boolean getUsado(@Param("token") String token);

        @Query(value="""
                SELECT usuario_id FROM token_redefinir_senha WHERE usuario_id = :usuario_id
                """, nativeQuery = true
        )
        Long getId(@Param("usuario_id") Long usuario_id);

        @Query(value="""
                SELECT email FROM usuario WHERE id IN (SELECT usuario_id FROM token_redefinir_senha WHERE token = :token)
                """, nativeQuery = true
        )
        String pegarEmailToken(@Param("token") String token);

        @Modifying
        @Transactional
        @Query(value="""
                UPDATE token_redefinir_senha SET usado = 1 WHERE token = :token
                """, nativeQuery = true
        )
        void usadoTrue(@Param("token") String token);

}