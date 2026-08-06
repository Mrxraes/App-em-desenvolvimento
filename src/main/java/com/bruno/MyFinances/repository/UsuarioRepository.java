package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Usuario;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query(value = """
        SELECT CASE 
            WHEN EXISTS (SELECT 1 FROM usuario WHERE email = :email ) 
            THEN '1'
            ELSE '0'
        END
            """, nativeQuery = true) 
    String existeEmail(@Param("email") String email);

    @Query(value = """ 
        SELECT senha FROM usuario WHERE email = :email;    
        """, nativeQuery = true)
        String consultarSenha(@Param("email") String email);
    
     @Query(value = """ 
        SELECT nome_primeiro FROM usuario WHERE email = :email;    
        """, nativeQuery = true)
        String consultarNome(@Param("email") String email);

    @Modifying // Informa ao spring que isso faz uma modificação no banco de dados e não é apenas um select
    @Transactional // Se a operação nao ocorrer da forma correta ele corta tudo
    @Query(value = """
            INSERT INTO codigoTemporario (cod) VALUES (:codigo)
            """, nativeQuery = true)  
    int inserirCod(@Param("codigo") String codigo); 

    @Query(value = """
            SELECT cod FROM codigoTemporario WHERE cod = :codigo
            """, nativeQuery = true)  
    String pegarCod(@Param("codigo") String codigo); 

    @Modifying // Informa ao spring que isso faz uma modificação no banco de dados e não é apenas um select
    @Transactional // Se a operação nao ocorrer da forma correta ele corta tudo
    @Query(value = """
            DELETE FROM codigoTemporario;
            """, nativeQuery = true)
    void excluirCod();           

    @Modifying // tudo que altera no banco de dados precisa disso, e não pode retornar string
    @Transactional
    @Query(value = """ 
        UPDATE usuario SET senha = :senha WHERE email = :email;    
        """, nativeQuery = true)
        int mudarSenha(@Param("email") String email, @Param("senha") String senha);
}
