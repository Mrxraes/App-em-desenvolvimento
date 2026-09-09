package com.bruno.MyFinances.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    @JsonProperty("passarPag")
    private boolean passarPag;
    @JsonProperty("mensagem")
    private String mensagem;

    public LoginResponse(boolean passarPag, String mensagem) {
        this.passarPag = passarPag;
        this.mensagem = mensagem;
    }

    public String getMensagem() {
        return mensagem;
    }

    public boolean getpassarPag() {
        return passarPag;
    }

  
}