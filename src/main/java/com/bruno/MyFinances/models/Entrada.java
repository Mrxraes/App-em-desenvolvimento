package com.bruno.MyFinances.models;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
public class Entrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private LocalDate dataRegistro;
    private BigDecimal valor;
    private String obs;

    @ManyToOne // relação varios pra 1 --> um tem em muitos -- Hibernate entende que é o id por causa do selo @Id;
    @JoinColumn(name = "user_id") // cria a coluna
    private Usuario usuario; // variavel criada pela classe usuario
}
