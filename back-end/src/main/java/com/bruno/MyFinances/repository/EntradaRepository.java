package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Entrada;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntradaRepository extends JpaRepository<Entrada, Long> {

    // Soma todas as entradas do mês até a data informada
    @Query(value = """
        SELECT SUM(valor)
        FROM entrada
        WHERE fk_user = :fk_user
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal contarValores(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    @Query(value = """
        SELECT SUM(valor)
        FROM entrada
        WHERE fk_user = :fk_user
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(:data), MONTH(:data), 1));
        """, nativeQuery = true)
    BigDecimal contarValoresMesAnterior(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );
    // Soma os salários do período
    @Query(value = """
        SELECT SUM(valor)
        FROM entrada
        WHERE fk_user = :fk_user
          AND tipo = 'SALARIO'
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal valoresSalario(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Soma as entradas extras do período
    @Query(value = """
        SELECT SUM(valor)
        FROM entrada
        WHERE fk_user = :fk_user
          AND tipo = 'EXTRA'
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal valoresExtra(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Soma os rendimentos do período
    @Query(value = """
        SELECT SUM(valor)
        FROM entrada
        WHERE fk_user = :fk_user
          AND tipo = 'RENDIMENTOS'
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal valoresRendimentos(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Lista todas as entradas do período, da mais recente para a mais antiga
    @Query(value = """
        SELECT *
        FROM entrada
        WHERE fk_user = :fk_user
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE))
        ORDER BY data_registro DESC;
        """, nativeQuery = true)
    List<Entrada> selectTodos(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );
}
