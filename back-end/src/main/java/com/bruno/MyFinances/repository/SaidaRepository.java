package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Saida;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaidaRepository extends JpaRepository<Saida, Long> {

    // Total de todas as saídas do primeiro dia do mês até a data informada
    @Query(value = """
        SELECT SUM(valor)
        FROM saida
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
        FROM saida
        WHERE fk_user = :fk_user
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(MONTH, 1, (DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)))
        """, nativeQuery = true)
    BigDecimal contarValoresBeforeMonth(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Total de saídas fixas no período
    @Query(value = """
        SELECT SUM(valor)
        FROM saida
        WHERE fk_user = :fk_user
          AND tipo = 'FIXA'
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal valoresFixo(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Total de saídas variáveis no período
    @Query(value = """
        SELECT SUM(valor)
        FROM saida
        WHERE fk_user = :fk_user
          AND tipo = 'VARIAVEL'
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal valoresVariavel(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Total de investimentos no período
    @Query(value = """
        SELECT SUM(valor)
        FROM saida
        WHERE fk_user = :fk_user
          AND tipo = 'INVESTIMENTOS'
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE));
        """, nativeQuery = true)
    BigDecimal valoresInvestimentos(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );

    // Lista todas as saídas do período
    @Query(value = """
        SELECT *
        FROM saida
        WHERE fk_user = :fk_user
          AND data_registro >= DATEFROMPARTS(YEAR(:data), MONTH(:data), 1)
          AND data_registro < DATEADD(DAY, 1, CAST(:data AS DATE))
        ORDER BY data_registro DESC;
        """, nativeQuery = true)
    List<Saida> selectTodos(
        @Param("fk_user") Long fk_user,
        @Param("data") LocalDateTime data
    );
}

