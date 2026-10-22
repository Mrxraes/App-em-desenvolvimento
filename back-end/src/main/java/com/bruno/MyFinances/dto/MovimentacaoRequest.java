package com.bruno.MyFinances.dto;

import java.time.LocalDateTime;

public class MovimentacaoRequest {

    private String token;
    private LocalDateTime data;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }
}