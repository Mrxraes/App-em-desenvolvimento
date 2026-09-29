package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Entrada;
import com.bruno.MyFinances.models.Saida;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntradaRepository extends JpaRepository<Entrada, Long> {

    /*@Modifying
    @Transactional
    @Query(value = """
            INSERT INTO saida (nome, dataRegistro, tipo, valor, obs, user_id) VALUES (:nome, :registro, :tipo, :valor, :obs, :fk)
            """, nativeQuery = true)
    void criarSaida(@Param("nome") String nome, @Param("dataRegistro") LocalDate registro, @Param("tipo")String tipo, @Param("valor")BigDecimal valor, @Param("obs")String obs, @Param("fk_user")BigInteger fk); */

        @Query(value = """
        SELECT SUM(valor) FROM entrada WHERE fk_user = :fk_user AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
            """, nativeQuery = true)
    BigDecimal contarValores(@Param("fk_user") Long fk_user, @Param("data_Registro") LocalDateTime data);

     @Query(value = """
            SELECT SUM(valor) FROM entrada WHERE fk_user = :fk_user AND tipo = 'SALARIO' AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(:data), MONTH(:data), 1));
            """, nativeQuery = true)
    BigDecimal valoresSalario(@Param("fk_user") Long fk_user, @Param("data_Registro") LocalDateTime data);

    @Query(value = """
            SELECT SUM(valor) FROM entrada WHERE fk_user = :fk_user AND tipo = 'EXTRA' AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(:data), MONTH(:data), 1));
            """, nativeQuery = true)
    BigDecimal valoresExtra(@Param("fk_user") Long fk_user, @Param("data_Registro") LocalDateTime data);

    @Query(value = """
            SELECT SUM(valor) FROM entrada WHERE fk_user = :fk_user AND tipo = 'RENDIMENTOS' AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(:data), MONTH(:data), 1));
            """, nativeQuery = true)
    BigDecimal valoresRendimentos(@Param("fk_user") Long fk_user, @Param("data_Registro") LocalDateTime data);


    @Query (value = """
        SELECT * FROM entrada WHERE fk_user = :fk_user AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(:data), MONTH(:data), 1));
                    """, nativeQuery = true)
        List<Entrada> selectTodos(@Param("fk_user") Long fk_user, @Param("data_Registro") LocalDateTime data);

}
