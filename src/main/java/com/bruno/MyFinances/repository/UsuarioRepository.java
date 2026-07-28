package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
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
    
}
