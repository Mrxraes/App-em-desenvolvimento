package com.bruno.MyFinances.dto;

public class DadosPessoaisResponseStatus {

    private boolean sucesso;
    private String mensagem;

    public DadosPessoaisResponseStatus(boolean sucesso, String mensagem) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
    }

    public boolean isSucesso() {
        return sucesso;
    }

    public String getMensagem() {
        return mensagem;
    }
}