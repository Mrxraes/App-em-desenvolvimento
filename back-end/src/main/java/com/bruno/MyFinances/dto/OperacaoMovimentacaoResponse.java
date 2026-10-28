package com.bruno.MyFinances.dto;

public class OperacaoMovimentacaoResponse {

    private boolean sucesso;
    private String mensagem;

    public OperacaoMovimentacaoResponse(
            boolean sucesso,
            String mensagem
    ) {
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