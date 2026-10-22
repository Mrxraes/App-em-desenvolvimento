package com.bruno.MyFinances.models;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
public class Entrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private LocalDateTime dataRegistro;
    private String tipo;
    private BigDecimal valor;
    private String obs;
    private Long fk_user;

    public Entrada() {
        
    }

    public Entrada(String nome, LocalDateTime data, BigDecimal valor, String obs, Long id, String tipo) {
        this.nome = nome;
        this.dataRegistro = data;
        this.valor = valor;
        this.obs = obs;
        this.fk_user = id;
        this.tipo = tipo;
    }

     public String getNome() {
        return nome;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public String getTipo() {
        return tipo;
    }

      public BigDecimal getValor() {
        return valor;
    }

    public String getObs() {
        return obs;
    }

    public Long getFk() {
        return fk_user;
    }

}
