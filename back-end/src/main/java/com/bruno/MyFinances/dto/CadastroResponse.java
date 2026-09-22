package com.bruno.MyFinances.dto;

/**
 * CadastroResquest
 */
public class CadastroResponse {

    private boolean validoNome;
    private boolean validoSobrenome;
    private boolean validoEmail;
    private boolean validoSalario;
    private boolean validoDataNascimento;
    private boolean validoSenha;

    private String mensagemNome;
    private String mensagemSobrenome;
    private String mensagemEmail;
    private String mensagemSalario;
    private String mensagemDataNascimento;
    private String mensagemSenha;
   
    public CadastroResponse(boolean validoNome,  boolean validoSobrenome, boolean validoEmail, boolean validoSalario, boolean validoDataNascimento, boolean validoSenha, String mensagemNome, String mensagemSobrenome, String mensagemEmail, String mensagemSalario ,String mensagemDataNascimento, String mensagemSenha) {
        
        this.validoNome = validoNome;
        this.validoSobrenome = validoSobrenome;
        this.validoEmail = validoEmail;
        this.validoSalario = validoSalario;
        this.validoDataNascimento = validoDataNascimento;
        this.validoSenha = validoSenha;

        this.mensagemNome = mensagemNome;
        this.mensagemSobrenome = mensagemSobrenome;
        this.mensagemEmail = mensagemEmail;
        this.mensagemSalario = mensagemSalario;
        this.mensagemDataNascimento = mensagemDataNascimento;
        this.mensagemSenha = mensagemSenha;

    }

    public CadastroResponse(String mensagem, boolean sucessoEnvio) {
        //TODO Auto-generated constructor stub
    }

    public boolean getValidoNome() {
        return validoNome;
    }

    public boolean getValidoSobrenome() {
        return validoSobrenome;
    }

    public boolean getValidoEmail() {
        return validoEmail;
    }

    public boolean getValidoSalario() {
        return validoSalario;
    }

    public boolean getValidoDataNascimento() {
        return validoDataNascimento;
    }

    public boolean getValidoSenha() {
        return validoSenha;
    }

    //

    public String getMensagemoNome() {
        return mensagemNome;
    }

    public String getMensagemSobrenome() {
        return mensagemSobrenome;
    }

    public String getMensagemEmail() {
        return mensagemEmail;
    }

    public String getMensagemSalario() {
        return mensagemSalario;
    }

    public String getMensagemDataNascimento() {
        return mensagemDataNascimento;
    }

    public String getMensagemSenha() {
        return mensagemSenha;
    }
}