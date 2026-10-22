package com.bruno.MyFinances.dto;

public class MovimentacaoResponse {

    private String data;
    private String valor;
    private String tipo;
    private String tabela;

    public MovimentacaoResponse(
            String data,
            String valor,
            String tipo,
            String tabela
    ) {
        this.data = data;
        this.valor = valor;
        this.tipo = tipo;
        this.tabela = tabela;
    }

    public String getData() {
        return data;
    }

    public String getValor() {
        return valor;
    }

    public String getTipo() {
        return tipo;
    }

    public String getTabela() {
        return tabela;
    }
}