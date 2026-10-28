package com.bruno.MyFinances.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AlterarMovimentacaoRequest {

    private String token;
    private String tabela;
    private Long id;

    private String nomeOriginal;
    private String tipoOriginal;
    private BigDecimal valorOriginal;
    private LocalDateTime dataRegistroOriginal;
    private String obsOriginal;

    private String novoNome;
    private String novoTipo;
    private BigDecimal novoValor;
    private LocalDateTime novaDataRegistro;
    private String novaObs;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTabela() {
        return tabela;
    }

    public void setTabela(String tabela) {
        this.tabela = tabela;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeOriginal() {
        return nomeOriginal;
    }

    public void setNomeOriginal(String nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public String getTipoOriginal() {
        return tipoOriginal;
    }

    public void setTipoOriginal(String tipoOriginal) {
        this.tipoOriginal = tipoOriginal;
    }

    public BigDecimal getValorOriginal() {
        return valorOriginal;
    }

    public void setValorOriginal(BigDecimal valorOriginal) {
        this.valorOriginal = valorOriginal;
    }

    public LocalDateTime getDataRegistroOriginal() {
        return dataRegistroOriginal;
    }

    public void setDataRegistroOriginal(LocalDateTime dataRegistroOriginal) {
        this.dataRegistroOriginal = dataRegistroOriginal;
    }

    public String getObsOriginal() {
        return obsOriginal;
    }

    public void setObsOriginal(String obsOriginal) {
        this.obsOriginal = obsOriginal;
    }

    public String getNovoNome() {
        return novoNome;
    }

    public void setNovoNome(String novoNome) {
        this.novoNome = novoNome;
    }

    public String getNovoTipo() {
        return novoTipo;
    }

    public void setNovoTipo(String novoTipo) {
        this.novoTipo = novoTipo;
    }

    public BigDecimal getNovoValor() {
        return novoValor;
    }

    public void setNovoValor(BigDecimal novoValor) {
        this.novoValor = novoValor;
    }

    public LocalDateTime getNovaDataRegistro() {
        return novaDataRegistro;
    }

    public void setNovaDataRegistro(LocalDateTime novaDataRegistro) {
        this.novaDataRegistro = novaDataRegistro;
    }

    public String getNovaObs() {
        return novaObs;
    }

    public void setNovaObs(String novaObs) {
        this.novaObs = novaObs;
    }
}