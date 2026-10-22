package com.bruno.MyFinances.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
public class Saida {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @Column(name = "DataRegistro", nullable = false)
    private LocalDateTime  dataRegistro;

    private String tipo; // Declarada no tipo Class, e so aceita valores iguais ao TipoSaida. 

    private BigDecimal valor;
    private String obs;

    
    private Long fk_user;
    
    public Saida() {
        
    }

    public Saida(String nome, LocalDateTime registro, String tipo, BigDecimal valor, String obs, Long id) {
        this.nome = nome;
        this.dataRegistro = registro;
        this.tipo = tipo;
        this.valor = valor;
        this.obs = obs;
        this.fk_user = id;
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

