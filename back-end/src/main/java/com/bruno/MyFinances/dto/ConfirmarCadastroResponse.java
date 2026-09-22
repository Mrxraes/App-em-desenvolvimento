package com.bruno.MyFinances.dto;

public class ConfirmarCadastroResponse {
    private String mensagem;
    private boolean sucesso;

    public ConfirmarCadastroResponse(String mensagem, boolean sucesso) {
        this.mensagem = mensagem;
        this.sucesso = sucesso;
    }

    public String getMensagem() {
        return mensagem;
    }

    public boolean getSucesso() {
        return sucesso;
    }

    // entender o que eu to fazendo e como conectar os pontos

}
