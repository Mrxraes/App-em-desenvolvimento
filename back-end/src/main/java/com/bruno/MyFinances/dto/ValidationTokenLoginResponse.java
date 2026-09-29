package com.bruno.MyFinances.dto;

public class ValidationTokenLoginResponse {

    private boolean tokenValido;
    private String email;
    private Long fk_user;

    public ValidationTokenLoginResponse(boolean tokenValido) {
        this.tokenValido = tokenValido;
    }

    public boolean getTokenValido() {
        return tokenValido;
    }
}

