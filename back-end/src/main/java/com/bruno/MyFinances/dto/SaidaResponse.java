package com.bruno.MyFinances.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SaidaResponse {
private String valorFixo;
private String valorVariavel;
private String valorInvestimentos;
private String valorTotal;
@JsonProperty("porcentagemDiferenca")
private String porcentagemDiferenca;


public SaidaResponse(
        String valorFixo,
        String valorVariavel,
        String valorInvestimentos,
        String valorTotal,
        String porcentagemDiferenca
) {
    this.valorFixo = valorFixo;
    this.valorVariavel = valorVariavel;
    this.valorInvestimentos = valorInvestimentos;
    this.valorTotal = valorTotal;
    this.porcentagemDiferenca = porcentagemDiferenca;
}

public String getValorFixo() {
    return valorFixo;
}

public String getValorVariavel() {
    return valorVariavel;
}

public String getValorInvestimentos() {
    return valorInvestimentos;
}

public String getValorTotal() {
    return valorTotal;
}

public String getPorcentagemDiferença() {
    return porcentagemDiferenca;

}
}