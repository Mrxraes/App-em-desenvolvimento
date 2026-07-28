package com.bruno.MyFinances.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
public class Saida {

    public static enum TipoSaida { // estabele os valores que são permitidos
    VARIAVEL,
    FIXO, 
    INVESTIMENTO
}


    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private LocalDate  dataRegistro;

    @Enumerated(EnumType.STRING) // Salva o número do enum no BD, mas possui uma formatação "STRING"
    private TipoSaida tipo; // Declarada no tipo Class, e so aceita valores iguais ao TipoSaida. 

    private BigDecimal Valor;
    private String obs;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Usuario usuario;
}

