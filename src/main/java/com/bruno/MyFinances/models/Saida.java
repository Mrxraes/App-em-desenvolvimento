package com.bruno.MyFinances.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
public class Saida {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @Column(name = "DataRegistro", nullable = false)
    private LocalDate  dataRegistro;

    private String tipo; // Declarada no tipo Class, e so aceita valores iguais ao TipoSaida. 

    private BigDecimal valor;
    private String obs;

    
    private BigInteger fk_user;
    
    public Saida(String nome, LocalDate registro, String tipo, BigDecimal valor, String obs, BigInteger id) {
        this.nome = nome;
        this.dataRegistro = registro;
        this.tipo = tipo;
        this.valor = valor;
        this.obs = obs;
        this.fk_user = id;
    }

}

