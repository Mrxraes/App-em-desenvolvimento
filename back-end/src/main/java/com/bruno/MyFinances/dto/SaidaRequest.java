package com.bruno.MyFinances.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SaidaRequest {

    private String token;
    private String nome;
    private LocalDateTime data;
    private String tipo;
    private BigDecimal valor;
    private String observacao;

    public SaidaRequest(
            String token,
            String nome,
            LocalDateTime data,
            String tipo,
            BigDecimal valor,
            String observacao) {

        this.token = token;
        this.nome = nome;
        this.data = data;
        this.tipo = tipo;
        this.valor = valor;
        this.observacao = observacao;
    }

    public String getToken() {
        return token;
    }

    public String getNome() {
        return nome;
    }

    public LocalDateTime getData() {
        return data;
    }

    public String getTipo() {
        return tipo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public String getObservacao() {
        return observacao;
    }
}