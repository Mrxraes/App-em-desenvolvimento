package com.bruno.MyFinances.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EntradaRequest {

    private String token;

    private String nome;

    private LocalDateTime data;

    private String tipo;

    private BigDecimal valor;

    private String observacao;

    // TOKEN

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    // NOME

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    // DATA

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public LocalDateTime getData() {
        return data;
    }

    // TIPO

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTipo() {
        return tipo;
    }

    // VALOR

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public BigDecimal getValor() {
        return valor;
    }

    // OBSERVAÇÃO

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public String getObservacao() {
        return observacao;
    }
}