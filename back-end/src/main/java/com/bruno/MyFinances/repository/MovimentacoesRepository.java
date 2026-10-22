package com.bruno.MyFinances.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bruno.MyFinances.models.Entrada;
import com.bruno.MyFinances.models.Saida;
import com.bruno.MyFinances.models.TokenConfirmarEmail;

public interface MovimentacoesRepository extends JpaRepository<Saida, Long> {
 
    @Query(value = """
        SELECT TOP 4 *
        FROM (
            SELECT data_registro, valor, tipo, 'entrada' AS tabela
            FROM entrada
            WHERE fk_user = :fk_user AND data_registro <= DATEADD(DAY, 1, :data_registro)
 
            UNION ALL

            SELECT data_registro, valor, tipo, 'saida' AS tabela
            FROM saida
            WHERE fk_user = :fk_user AND data_registro <= DATEADD(DAY, 1, :data_registro)
            ) AS movimentacoes
        ORDER BY data_registro DESC
        """, nativeQuery = true)
    List<Object[]> buscarUltimasMovimentacoes(@Param("fk_user") Long fk_user , @Param("data_registro") LocalDateTime data_registro);
    

    @Query(value = """
        SELECT
            movimentacoes.nome,
            movimentacoes.data_registro,
            movimentacoes.valor,
            movimentacoes.tipo,
            movimentacoes.tabela

        FROM (

            SELECT
                nome,
                data_registro,
                valor,
                tipo,
                'entrada' AS tabela

            FROM entrada

            WHERE fk_user = :fk_user AND data_registro <= DATEADD(DAY, 1, :data_registro)

            UNION ALL

            SELECT
                nome,
                data_registro,
                valor,
                tipo,
                'saida' AS tabela

            FROM saida

            WHERE fk_user = :fk_user AND data_registro <= DATEADD(DAY, 1, :data_registro)

        ) AS movimentacoes

        ORDER BY movimentacoes.data_registro DESC

        """, nativeQuery = true)
    List<Object[]> buscarTodasMovimentacoes(
        @Param("fk_user") Long fk_user,
        @Param("data_registro") LocalDateTime data_registro
    );
}
