package com.bruno.MyFinances.dto;

public class TodasMovimentacaoResponse {

    private Long id;
    private String nome;
    private String dataRegistro;
    private String valor;
    private String tipo;
    private String tabela;
    private String obs;

    public TodasMovimentacaoResponse(
            Long id,
            String nome,
            String dataRegistro,
            String valor,
            String tipo,
            String tabela,
            String obs
    ) {
        this.id = id;
        this.nome = nome;
        this.dataRegistro = dataRegistro;
        this.valor = valor;
        this.tipo = tipo;
        this.tabela = tabela;
        this.obs = obs;
    }

    public Long getId() {
        return id;
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

    public String getObs() {
        return obs;
    }
}