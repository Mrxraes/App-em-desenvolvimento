package com.bruno.MyFinances.dto;

public class SenhasRequest {
    private String senha1;
    private String senha2;

    public void setSenha1(String senha1) {
        this.senha1 = senha1;
    }

    public void setSenha2(String senha2) {
        this.senha2 = senha2;
    }

    public String getSenha1() {
        return senha1;
    }

    public String getSenha2() {
        return senha2;
    }

}
