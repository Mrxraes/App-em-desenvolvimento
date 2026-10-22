package com.bruno.MyFinances.dto;

/**
 * UserResponse
 */
public class UserResponse {
    private String nome;
    

    public UserResponse(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

}