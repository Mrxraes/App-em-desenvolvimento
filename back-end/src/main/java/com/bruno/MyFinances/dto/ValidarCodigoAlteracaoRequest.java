package com.bruno.MyFinances.dto;

public class ValidarCodigoAlteracaoRequest {

    private String token;
    private String codigo;
    private String campo;

    public String getToken() {
        return token;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getCampo() {
        return campo;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setCampo(String campo) {
        this.campo = campo;
    }
}