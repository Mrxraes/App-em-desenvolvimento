package com.bruno.MyFinances.dto;

public class ConfirmarCadastroRequest {
    // email
    private String email;
    private String perfilAtivo;
    private String loginSucedido;

    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }

    public String getPerfilAtivo() {
        return perfilAtivo;
    }


    public void setPerfilAtivo(String perfilAtivo) {
        this.perfilAtivo = perfilAtivo;
    }

    public String getLoginSucedido() {
        return loginSucedido;
    }


    public void setLoginSucedido(String loginSucedido) {
        this.loginSucedido = loginSucedido;
    }


}
