package com.bruno.MyFinances.dto;

public class EntradaResponse {
    private String valorSalario;
    private String valorExtra;
    private String valorRendimento;
    private String valorTotal;

    public EntradaResponse(
        String valorSalario,
        String valorExtra,
        String valorRendimento,
        String valorTotal
) {
    this.valorSalario = valorSalario;
    this.valorExtra = valorExtra;
    this.valorRendimento = valorRendimento;
    this.valorTotal = valorTotal;
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
}