package com.bruno.MyFinances.dto;

public class ValidationResponse {
    private boolean loginSucedido;
    private String mensagem;

    public ValidationResponse(boolean loginSucedido, String mensagem) {
        this.loginSucedido = loginSucedido;
        this.mensagem = mensagem;
    }

    public boolean getloginSucedido() {
        return loginSucedido;
    }

    public String getMensagem() {
        return mensagem;
    }

}
