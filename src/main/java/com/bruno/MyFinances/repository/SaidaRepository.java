package com.bruno.MyFinances.repository;

import com.bruno.MyFinances.models.Saida;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaidaRepository extends JpaRepository<Saida, Long> {

    /*@Modifying
    @Transactional
    @Query(value = """
            INSERT INTO saida (nome, dataRegistro, tipo, valor, obs, user_id) VALUES (:nome, :registro, :tipo, :valor, :obs, :fk)
            """, nativeQuery = true)
    void criarSaida(@Param("nome") String nome, @Param("dataRegistro") LocalDate registro, @Param("tipo")String tipo, @Param("valor")BigDecimal valor, @Param("obs")String obs, @Param("fk_user")BigInteger fk); */
}
