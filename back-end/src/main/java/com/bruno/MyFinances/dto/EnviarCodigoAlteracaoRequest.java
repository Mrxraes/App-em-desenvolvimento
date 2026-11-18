package com.bruno.MyFinances.dto;

public class EnviarCodigoAlteracaoRequest {

    private String token;
    private String campo;

    public String getToken() {
        return token;
    }

    public String getCampo() {
        return campo;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setCampo(String campo) {
        this.campo = campo;
    }
}