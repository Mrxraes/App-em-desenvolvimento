package com.bruno.MyFinances.dto;

public class EntradaCriadaResponse {

    private String mensagemNome;
    private String mensagemValor;
    private String mensagemObs;
    private String mensagemSucesso;

    //
    // VALIDAÇÕES
    //

    private boolean nomeCerto;
    private boolean valorCerto;
    private boolean obsCerto;
    private boolean entradaSalva;

    public EntradaCriadaResponse(
            String mensagemNome,
            String mensagemValor,
            String mensagemObs,
            String mensagemSucesso,
            boolean nomeCerto,
            boolean valorCerto,
            boolean obsCerto,
            boolean entradaSalva) {

        this.mensagemNome = mensagemNome;
        this.mensagemValor = mensagemValor;
        this.mensagemObs = mensagemObs;
        this.mensagemSucesso = mensagemSucesso;

        this.nomeCerto = nomeCerto;
        this.valorCerto = valorCerto;
        this.obsCerto = obsCerto;
        this.entradaSalva = entradaSalva;
    }

    public String getMensagemNome() {
        return mensagemNome;
    }

    public String getMensagemValor() {
        return mensagemValor;
    }

    public String getMensagemObs() {
        return mensagemObs;
    }

    public String getMensagemSucesso() {
        return mensagemSucesso;
    }

    public boolean isNomeCerto() {
        return nomeCerto;
    }

    public boolean isValorCerto() {
        return valorCerto;
    }

    public boolean isObsCerto() {
        return obsCerto;
    }

    public boolean isEntradaSalva() {
        return entradaSalva;
    }
}