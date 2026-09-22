package com.bruno.MyFinances.dto;

/**
 * SenhasReponse
 */
public class SenhasResponse {

    private String mensagem;
    private boolean sucesso;

    public SenhasResponse(String mensagem, boolean sucesso) {
        this.mensagem = mensagem;
        this.sucesso = sucesso;
    }

    public String getMensagem() {
        return mensagem;
    }

    public boolean getSucesso() {
        return sucesso;
    }
}