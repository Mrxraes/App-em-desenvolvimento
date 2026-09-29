package com.bruno.MyFinances.dto;

import java.time.LocalDateTime;

public class EntradaRequest {
    private String token;
    private LocalDateTime data;

    public void setToken(String token) {
        this.token = token;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getData() {
        return data; 
    }

}
