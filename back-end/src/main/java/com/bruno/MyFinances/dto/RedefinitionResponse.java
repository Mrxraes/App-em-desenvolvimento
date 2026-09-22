package com.bruno.MyFinances.dto;

public class RedefinitionResponse {

    private String mensagem;
    private boolean sucessoEnvio;

    public RedefinitionResponse(String mensagem, boolean sucessoEnvio) {
        this.mensagem = mensagem;
        this.sucessoEnvio = sucessoEnvio;
    }

    public String getMensagem() {
        return mensagem;
    }

    public boolean getsucessoEnvio() {
        return sucessoEnvio;
    }
}
