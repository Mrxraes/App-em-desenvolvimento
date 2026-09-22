package com.bruno.MyFinances.dto;

/**
 * CadastroResquest
 */
public class CadastroResquest {

    private String nome;
    private String sobrenome;
    private String email;
    private String salario;
    private String dataNascimento;
    private String senha;
    private String senhaConfirm;


    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSalario(String salario) {
        this.salario = salario;
    }
    

    // como formatar pra input digitar certin
    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }


    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setSenhaConfirm(String senhaConfirm) {
        this.senhaConfirm = senhaConfirm;
    }

    public String getNome() {
        return nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public String getEmail() {
        return email;
    }

    public String getSalario() {
        return salario;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public String getSenha() {
        return senha;
    }

    public String getSenhaConfirm() {
        return senhaConfirm;
    }
}