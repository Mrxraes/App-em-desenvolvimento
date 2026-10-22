package com.bruno.MyFinances.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EntradaResponse {
    private String valorSalario;
    private String valorExtra;
    private String valorRendimento;
    private String valorTotal;
    @JsonProperty("porcentagemDiferenca")
    private String porcentagemDiferenca;

    public EntradaResponse(
        String valorSalario,
        String valorExtra,
        String valorRendimento,
        String valorTotal,
        String porcentagemDiferença
) {
    this.valorSalario = valorSalario;
    this.valorExtra = valorExtra;
    this.valorRendimento = valorRendimento;
    this.valorTotal = valorTotal;
    this.porcentagemDiferenca =  porcentagemDiferença;
}

public String getValorSalario() {
    return valorSalario;
}

public String getValorExtra() {
    return valorExtra;
}

public String getValorRendimento() {
    return valorRendimento;
}

public String getValorTotal() {
    return valorTotal;

}

public String getPorcentagemDiferença() {
    return porcentagemDiferenca;

}
}