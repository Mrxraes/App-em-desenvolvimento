package com.bruno.MyFinances.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bruno.MyFinances.models.Saida;

public interface MovimentacoesRepository
        extends JpaRepository<Saida, Long> {

    @Query(value = """
        SELECT TOP 4
            movimentacoes.data_registro,
            movimentacoes.valor,
            movimentacoes.tipo,
            movimentacoes.tabela
        FROM (
            SELECT
                data_registro,
                valor,
                tipo,
                'entrada' AS tabela
            FROM entrada
            WHERE fk_user = :fk_user
              AND data_registro < DATEADD(DAY, 1, CAST(:data_registro AS DATE))

            UNION ALL

            SELECT
                data_registro,
                valor,
                tipo,
                'saida' AS tabela
            FROM saida
            WHERE fk_user = :fk_user
              AND data_registro < DATEADD(DAY, 1, CAST(:data_registro AS DATE))
        ) AS movimentacoes
        ORDER BY movimentacoes.data_registro DESC
        """, nativeQuery = true)
    List<Object[]> buscarUltimasMovimentacoes(
            @Param("fk_user") Long fk_user,
            @Param("data_registro") LocalDateTime data_registro
    );

    @Query(value = """
        SELECT
            movimentacoes.id,
            movimentacoes.nome,
            movimentacoes.data_registro,
            movimentacoes.valor,
            movimentacoes.tipo,
            movimentacoes.tabela,
            movimentacoes.obs
        FROM (
            SELECT
                id,
                nome,
                data_registro,
                valor,
                tipo,
                'entrada' AS tabela,
                obs
            FROM entrada
            WHERE fk_user = :fk_user
              AND data_registro >= DATEFROMPARTS(
                  YEAR(:data_registro),
                  MONTH(:data_registro),
                  1
              )
              AND data_registro < DATEADD(
                  MONTH,
                  1,
                  DATEFROMPARTS(
                      YEAR(:data_registro),
                      MONTH(:data_registro),
                      1
                  )
              )

            UNION ALL

            SELECT
                id,
                nome,
                data_registro,
                valor,
                tipo,
                'saida' AS tabela,
                obs
            FROM saida
            WHERE fk_user = :fk_user
              AND data_registro >= DATEFROMPARTS(
                  YEAR(:data_registro),
                  MONTH(:data_registro),
                  1
              )
              AND data_registro < DATEADD(
                  MONTH,
                  1,
                  DATEFROMPARTS(
                      YEAR(:data_registro),
                      MONTH(:data_registro),
                      1
                  )
              )
        ) AS movimentacoes
        ORDER BY movimentacoes.data_registro DESC
        """, nativeQuery = true)
    List<Object[]> buscarTodasMovimentacoes(
            @Param("fk_user") Long fk_user,
            @Param("data_registro") LocalDateTime data_registro
    );

    /*
     * A exclusão só acontece se o registro ainda corresponder
     * aos dados originais enviados pelo aplicativo.
     */

    @Modifying
    @Query(value = """
        DELETE FROM entrada
        WHERE id = :id
          AND fk_user = :fk_user
          AND nome = :nome
          AND tipo = :tipo
          AND valor = :valor
          AND data_registro = :dataRegistro
          AND (
              obs = :obs
              OR (obs IS NULL AND :obs IS NULL)
          )
        """, nativeQuery = true)
    int removerEntrada(
            @Param("id") Long id,
            @Param("fk_user") Long fkUser,
            @Param("nome") String nome,
            @Param("tipo") String tipo,
            @Param("valor") java.math.BigDecimal valor,
            @Param("dataRegistro") LocalDateTime dataRegistro,
            @Param("obs") String obs
    );

    @Modifying
    @Query(value = """
        DELETE FROM saida
        WHERE id = :id
          AND fk_user = :fk_user
          AND nome = :nome
          AND tipo = :tipo
          AND valor = :valor
          AND data_registro = :dataRegistro
          AND (
              obs = :obs
              OR (obs IS NULL AND :obs IS NULL)
          )
        """, nativeQuery = true)
    int removerSaida(
            @Param("id") Long id,
            @Param("fk_user") Long fkUser,
            @Param("nome") String nome,
            @Param("tipo") String tipo,
            @Param("valor") java.math.BigDecimal valor,
            @Param("dataRegistro") LocalDateTime dataRegistro,
            @Param("obs") String obs
    );

    /*
     * A alteração também exige que todos os dados originais
     * correspondam ao registro existente.
     */

    @Modifying
    @Query(value = """
        UPDATE entrada
        SET nome = :novoNome,
            valor = :novoValor,
            tipo = :novoTipo,
            data_registro = :novaDataRegistro,
            obs = :novaObs
        WHERE id = :id
          AND fk_user = :fk_user
          AND nome = :nomeOriginal
          AND tipo = :tipoOriginal
          AND valor = :valorOriginal
          AND data_registro = :dataRegistroOriginal
          AND (
              obs = :obsOriginal
              OR (obs IS NULL AND :obsOriginal IS NULL)
          )
        """, nativeQuery = true)
    int alterarEntrada(
            @Param("id") Long id,
            @Param("fk_user") Long fkUser,
            @Param("nomeOriginal") String nomeOriginal,
            @Param("tipoOriginal") String tipoOriginal,
            @Param("valorOriginal") java.math.BigDecimal valorOriginal,
            @Param("dataRegistroOriginal") LocalDateTime dataRegistroOriginal,
            @Param("obsOriginal") String obsOriginal,
            @Param("novoNome") String novoNome,
            @Param("novoValor") java.math.BigDecimal novoValor,
            @Param("novoTipo") String novoTipo,
            @Param("novaDataRegistro") LocalDateTime novaDataRegistro,
            @Param("novaObs") String novaObs
    );

    @Modifying
    @Query(value = """
        UPDATE saida
        SET nome = :novoNome,
            valor = :novoValor,
            tipo = :novoTipo,
            data_registro = :novaDataRegistro,
            obs = :novaObs
        WHERE id = :id
          AND fk_user = :fk_user
          AND nome = :nomeOriginal
          AND tipo = :tipoOriginal
          AND valor = :valorOriginal
          AND data_registro = :dataRegistroOriginal
          AND (
              obs = :obsOriginal
              OR (obs IS NULL AND :obsOriginal IS NULL)
          )
        """, nativeQuery = true)
    int alterarSaida(
            @Param("id") Long id,
            @Param("fk_user") Long fkUser,
            @Param("nomeOriginal") String nomeOriginal,
            @Param("tipoOriginal") String tipoOriginal,
            @Param("valorOriginal") java.math.BigDecimal valorOriginal,
            @Param("dataRegistroOriginal") LocalDateTime dataRegistroOriginal,
            @Param("obsOriginal") String obsOriginal,
            @Param("novoNome") String novoNome,
            @Param("novoValor") java.math.BigDecimal novoValor,
            @Param("novoTipo") String novoTipo,
            @Param("novaDataRegistro") LocalDateTime novaDataRegistro,
            @Param("novaObs") String novaObs
    );
}