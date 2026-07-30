
package com.bruno.MyFinances.models;// é necessario declarar esse espaço como um pacote do projeto

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate; 
import java.math.BigDecimal;



@Entity // --> Selo do JPA que diz ao hibernate o que essa classe é de fato
public class Usuario {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY) // diz que isso é um Id e que deve ser gerado automaticamente
    private Long id;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String senha;

    private String nome_primeiro;
    private String sobrenome;
    private BigDecimal salario;
    private LocalDate dataNascimento;
    
    public Usuario(String nome_primeiro, String email, String senha, BigDecimal salario, LocalDate dataNascimento, String sobrenome) {
       
        this.nome_primeiro = nome_primeiro;
        this.sobrenome = sobrenome;
        this.email = email;
        this.senha = senha;
        this.salario = salario;
        this.dataNascimento = dataNascimento;

    }

  
    /*public void exe() throws InterruptedException {
        try {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        String msg = "| Nome:" + nomeComp + " | Email: " + email + " | Senha: " + senha + " | Salario: " + String.valueOf(salario) + " | Data de Nascimento: " +  String.valueOf(dataNascimento.format(formatter))  + " |";
        digitar.digitar(msg);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    } */
}