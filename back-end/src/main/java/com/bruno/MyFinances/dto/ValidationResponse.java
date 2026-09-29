package com.bruno.MyFinances.dto;

public class ValidationResponse {
    private boolean loginSucedido;
    private String mensagem;
    private boolean perfilAtivo;
    private String token;

    public ValidationResponse(boolean loginSucedido, String mensagem, boolean perfilAtivo, String token) {
        this.loginSucedido = loginSucedido;
        this.mensagem = mensagem;
        this.perfilAtivo = perfilAtivo;
        this.token = token;
    }

    public boolean getloginSucedido() {
        return loginSucedido;
    }

    public String getMensagem() {
        return mensagem;
    }

    public boolean getPerfilAtivo() {
        return perfilAtivo;
    }

    public String getToken() {
        return token;
    }

}
