package com.bruno.MyFinances.models;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
public class Entrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private LocalDate dataRegistro;
    private String tipo;
    private BigDecimal valor;
    private String obs;
    private BigInteger fk_user;

    public Entrada(String nome, LocalDate data, BigDecimal valor, String obs, BigInteger id, String tipo) {
        this.nome = nome;
        this.dataRegistro = data;
        this.valor = valor;
        this.obs = obs;
        this.fk_user = id;
        this.tipo = tipo;
    }

}
