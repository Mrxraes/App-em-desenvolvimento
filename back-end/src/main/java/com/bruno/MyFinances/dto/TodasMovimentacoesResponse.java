
package com.bruno.MyFinances.dto;

public class TodasMovimentacoesResponse {

    private String nome;
    private String dataRegistro;
    private String valor;
    private String tipo;
    private String tabela;

    public TodasMovimentacoesResponse(
            String nome,
            String dataRegistro,
            String valor,
            String tipo,
            String tabela
    ) {
        this.nome = nome;
        this.dataRegistro = dataRegistro;
        this.valor = valor;
        this.tipo = tipo;
        this.tabela = tabela;
    }

    public String getNome() {
        return nome;
    }

    public String getDataRegistro() {
        return dataRegistro;
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

