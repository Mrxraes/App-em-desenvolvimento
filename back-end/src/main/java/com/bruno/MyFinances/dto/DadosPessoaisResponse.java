package com.bruno.MyFinances.dto;

import java.math.BigDecimal;

public class DadosPessoaisResponse {

    private String nome;
    private String sobrenome;
    private String email;
    private String dataNascimento;
    private String salario;

    public DadosPessoaisResponse(
            String nome,
            String sobrenome,
            String email,
            String dataNascimento,
            String salario
    ) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.dataNascimento = dataNascimento;
        this.salario = salario;
    }

    public String getNome() {
        return nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public String getEmail() {
        return email;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public String getSalario() {
        return salario;
    }
}