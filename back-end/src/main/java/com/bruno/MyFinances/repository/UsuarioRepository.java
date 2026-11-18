package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Usuario;

import jakarta.transaction.Transactional;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // VERIFICA SE E-MAIL EXISTE
    @Query(value = """
        SELECT CASE 
            WHEN EXISTS (SELECT 1 FROM usuario WHERE email = :email ) 
            THEN '1'
            ELSE '0'
        END
            """, nativeQuery = true) 
    String existeEmail(@Param("email") String email);

    // PERGUNTA QUAL É A SENHA
    @Query(value = """ 
        SELECT senha FROM usuario WHERE email = :email;    
        """, nativeQuery = true)
        String consultarSenha(@Param("email") String email);

    // PERGUNTA NOME BASEADO NO E-MAIL DO USUARIO
     @Query(value = """ 
        SELECT nome_primeiro FROM usuario WHERE email = :email;    
        """, nativeQuery = true)
        String consultarNome(@Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO codigoTemporario (cod, dataCriada, fk_user, finalidade, usado)
        VALUES (:codigo, :dataCriada, :fk_user, :finalidade, 0)
        """, nativeQuery = true)
    int inserirCod(
        @Param("codigo") String codigo,
        @Param("dataCriada") LocalDateTime dataCriada,
        @Param("fk_user") BigInteger fk_user,
        @Param("finalidade") String finalidade
    ); 

    // PEGA O CODIGO DESSA TABELA
    @Query(value = """
            SELECT cod FROM codigoTemporario WHERE cod = :codigo AND dataCriada = :dataCriada
            """, nativeQuery = true)  
    String pegarCod(@Param("codigo") String codigo, @Param("dataCriada") LocalDate dataCriada); 

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

    @Query(value = """
            SELECT id FROM usuario WHERE email = :email
            """, nativeQuery = true)
        Long pegarId(@Param("email") String email);

    
    @Modifying // tudo que altera no banco de dados precisa disso, e não pode retornar string
    @Transactional
    @Query(value = """ 
        UPDATE usuario SET ativo = 1 WHERE id = :id;    
        """, nativeQuery = true)
        int usuarioAtivo(@Param("id") Long id);

    @Query(value = """
            SELECT ativo FROM usuario  WHERE email = :email; 
            """, nativeQuery = true)
    Boolean pegarAtivo(@Param("email") String email);

    @Query(value="""
            SELECT email FROM usuario WHERE id = :id
            """, nativeQuery = true)
    String getEmail(@Param("id") Long id);

    @Query(value="""
            SELECT ativo FROM usuario WHERE email = :email
            """, nativeQuery = true)
    boolean perfilAtivo(@Param("email") String email);

    @Query(value = """
    SELECT nome_primeiro
    FROM usuario
    WHERE id = :id
    """, nativeQuery = true)
String getName(@Param("id") Long id);

        @Query(value = """
    SELECT
        nome_primeiro,
        sobrenome,
        email,
        data_nascimento,
        salario
    FROM usuario
    WHERE id = :id
    """, nativeQuery = true)
List<Object[]> carregarDadosPessoais(@Param("id") Long id);

    // CÓDIGO VALIDO
    @Query(value = """
    SELECT COUNT(*)
    FROM codigoTemporario
    WHERE fk_user = :id
    AND cod = :codigo
    AND usado = 0
    AND finalidade = :finalidade
    AND dataCriada <= GETDATE()
    AND DATEADD(MINUTE, 10, dataCriada) >= GETDATE()
    """, nativeQuery = true)
    int contarCodigoValido(
        @Param("id") Long id,
        @Param("codigo") String codigo,
        @Param("finalidade") String finalidade
    );

    @Modifying
    @Query(value = """
        UPDATE codigoTemporario
        SET usado = 1
        WHERE fk_user = :id
        AND cod = :codigo
        AND usado = 0
        AND finalidade = :finalidade
        """, nativeQuery = true)
    int marcarCodigoComoUsado(
        @Param("id") Long id,
        @Param("codigo") String codigo,
        @Param("finalidade") String finalidade
    );

    // INVALIDAR CÓDIGO UTILIZADO
    @Modifying
    @Query(value = """
        DELETE FROM codigoTemporario
        WHERE fk_user = :fk_user
        AND cod = :codigo
        """, nativeQuery = true)
    int invalidarCodigo(
            @Param("fk_user") Long fk_user,
            @Param("codigo") String codigo
    );

            // ATUALIZAR NOME
        @Modifying
        @Query(value = """
            UPDATE usuario
            SET nome_primeiro = :novoValor
            WHERE id = :idUser
            """, nativeQuery = true)
        int atualizarNome(
                @Param("idUser") Long idUser,
                @Param("novoValor") String novoValor
        );


        // ATUALIZAR SOBRENOME
        @Modifying
        @Query(value = """
            UPDATE usuario
            SET sobrenome = :novoValor
            WHERE id = :idUser
            """, nativeQuery = true)
        int atualizarSobrenome(
                @Param("idUser") Long idUser,
                @Param("novoValor") String novoValor
        );


        // ATUALIZAR EMAIL
        @Modifying
        @Query(value = """
            UPDATE usuario
            SET email = :novoValor
            WHERE id = :idUser
            """, nativeQuery = true)
        int atualizarEmail(
                @Param("idUser") Long idUser,
                @Param("novoValor") String novoValor
        );


        // ATUALIZAR DATA DE NASCIMENTO
        @Modifying
        @Query(value = """
            UPDATE usuario
            SET data_nascimento = :novoValor
            WHERE id = :idUser
            """, nativeQuery = true)
        int atualizarDataNascimento(
                @Param("idUser") Long idUser,
                @Param("novoValor") String novoValor
        );


        // ATUALIZAR SALÁRIO
        @Modifying
        @Query(value = """
            UPDATE usuario
            SET salario = :novoValor
            WHERE id = :idUser
            """, nativeQuery = true)
        int atualizarSalario(
                @Param("idUser") Long idUser,
                @Param("novoValor") String novoValor
        );

        @Query(value = """
        SELECT senha
        FROM usuario
        WHERE id = :id
        """, nativeQuery = true)
    String consultarSenhaPorId(@Param("id") Long id);

    @Modifying
    @Query(value = """
        UPDATE usuario
        SET senha = :senha
        WHERE id = :id
        """, nativeQuery = true)
    int atualizarSenha(
        @Param("id") Long id,
        @Param("senha") String senha
    );
        
}
