package com.bruno.MyFinances.repository;


import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bruno.MyFinances.models.TokenLogin;

import jakarta.transaction.Transactional;


/**
 * TokenRepository
 */
public interface TokenLoginRepository extends JpaRepository<TokenLogin, Long> {
        @Query(value="""
                SELECT expiracao FROM token_login WHERE token = :token
                """, nativeQuery = true
        )
        LocalDateTime getDate(@Param("token") String token);

        
        @Query(value="""
                SELECT token FROM token_login WHERE usuario_id = :usuario_id
                """, nativeQuery = true
        )
        String getToken(@Param("usuario_id") Long usuario_id);

        @Query(value="""
                SELECT usado FROM token_login WHERE token = :token
                """, nativeQuery = true
        )
        Boolean getUsado(@Param("token") String token);

        @Query(value="""
                SELECT usuario_id FROM token_login WHERE token = :token
                """, nativeQuery = true
        )
        Long getId(@Param("token") String token);

        @Query(value="""
                SELECT email FROM usuario WHERE id = :usuario_id
                """, nativeQuery = true
        )
        String pegarEmailToken(@Param("usuario_id") Long usuario_id);

        @Modifying
        @Transactional
        @Query(value="""
                UPDATE token_login SET revogado = 1 WHERE token = :token
                """, nativeQuery = true
        )
        void revogadoTrue(@Param("token") String token);

        @Query(value = """
                SELECT * FROM token_login WHERE token = :token
                        """, nativeQuery = true
        )
        Optional<TokenLogin> dadosTokenLogin(@Param("token") String token);

}