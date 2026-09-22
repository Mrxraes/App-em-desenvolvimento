package com.bruno.MyFinances.dto;

public class ValidationResponse {
    private boolean loginSucedido;
    private String mensagem;
    private boolean perfilAtivo;

    public ValidationResponse(boolean loginSucedido, String mensagem, boolean perfilAtivo) {
        this.loginSucedido = loginSucedido;
        this.mensagem = mensagem;
        this.perfilAtivo = perfilAtivo;
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

}
