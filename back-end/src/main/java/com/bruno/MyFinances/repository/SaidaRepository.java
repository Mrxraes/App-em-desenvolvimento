package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Saida;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.Param;

public interface SaidaRepository extends JpaRepository<Saida, Long> {

    /*@Modifying
    @Transactional
    @Query(value = """
            INSERT INTO saida (nome, dataRegistro, tipo, valor, obs, user_id) VALUES (:nome, :registro, :tipo, :valor, :obs, :fk)
            """, nativeQuery = true)
    void criarSaida(@Param("nome") String nome, @Param("dataRegistro") LocalDate registro, @Param("tipo")String tipo, @Param("valor")BigDecimal valor, @Param("obs")String obs, @Param("fk_user")BigInteger fk); */

    @Query(value = """
        SELECT SUM(valor) FROM saida WHERE fk_user = :fk_user AND data_registro >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
            """, nativeQuery = true)
    BigDecimal contarValores(@Param("fk_user") BigInteger fk_user);

    @Query(value = """
            SELECT SUM(valor) FROM saida WHERE fk_user = :fk_user AND tipo = 'FIXA' AND data_registro >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
            """, nativeQuery = true)
    BigDecimal valoresFixo(@Param("fk_user") BigInteger fk_user);

    @Query(value = """
            SELECT SUM(valor) FROM saida WHERE fk_user = :fk_user AND tipo = 'VARIAVEL' AND data_registro >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
            """, nativeQuery = true)
    BigDecimal valoresVariavel(@Param("fk_user") BigInteger fk_user);

    @Query(value = """
            SELECT SUM(valor) FROM saida WHERE fk_user = :fk_user AND tipo = 'INVESTIMENTOS' AND data_registro >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
            """, nativeQuery = true)
    BigDecimal valoresInvestimentos(@Param("fk_user") BigInteger fk_user);

    @Query (value = """
        SELECT * FROM saida WHERE fk_user = :fk_user AND data_registro >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
                                                                AND data_registro < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));
                    """, nativeQuery = true)
        List<Saida> selectTodos(@Param("fk_user") BigInteger fk_user);
}
