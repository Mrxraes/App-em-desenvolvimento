package com.bruno.MyFinances.dto;

public class AtualizarDadosRequest {

    private String token;
    private String campo;
    private String novoValor;
    private String codigo;

    public String getToken() {
        return token;
    }

    public String getCampo() {
        return campo;
    }

    public String getNovoValor() {
        return novoValor;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setCampo(String campo) {
        this.campo = campo;
    }

    public void setNovoValor(String novoValor) {
        this.novoValor = novoValor;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
}