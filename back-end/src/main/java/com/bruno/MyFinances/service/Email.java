package com.bruno.MyFinances.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.dto.ValidationRequest;
import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class Email {

    private final UsuarioRepository existe;
  

    public Email( UsuarioRepository metodosRecebidos) {
        this.existe = metodosRecebidos;

    }

    private String mensagem;
    private String mensagemParam;
    private boolean valida;
    private String emailExistente;
    private String emailRun;
    private Boolean perfilAtivo;

    public void resultado(boolean valida, String existe, String mensagem, Boolean perfilAtivo) {
        this.valida = valida;
        this.emailExistente = existe;
        this.mensagem = mensagem;
        this.perfilAtivo = perfilAtivo;
    }

    public boolean getValida() {
        return valida;
    }

    public String getEmailExiste() {
        return emailExistente;
    }

    public String getMensagem() {
        return mensagem;
    }

    public boolean getAtivo() {
        return perfilAtivo;
    }


    public void validarEmail(String email) throws InterruptedException
    {
        boolean espaco = false;
        boolean pontoDpsArroba = false;
        valida = true;
        int contaArroba = 0;
        
        int indice = email.length() - 1;

        String existeEmail = existe.existeEmail(email);
        System.out.println(existeEmail);

        if (!email.isEmpty()) {
            if (email.charAt(0) == '@' || email.charAt(indice) == '@') {
                mensagemParam = "O e-mail não pode possuir o caracter '@' no inicío ou no fim.";
                valida = false;
            } 
            if (email.contains("@.") || email.charAt(indice) == '.' || email.contains("..")) {
                mensagemParam = "O e-mail não pode possuir o caracter '.' no inicío, no fim do dominio ou de forma consecutiva.";
                valida = false;
            }
            String emailSemCom = email.replace(".com", "");
            if (emailSemCom.length() <= 3) {
                mensagemParam = "O e-mail não pode possuir mais de três caracteres antes de '.com'.";
                valida = false;
            } 
            int antesDoArroba = email.indexOf("@");  
            if (antesDoArroba > 63) {
                mensagemParam = "O e-mail não pode possuir mais de 64 caracteres antes de '@'.";
                valida = false;
            } 
            if (email.length() > 254) {
                mensagemParam = "O e-mail não pode possuir mais de 254 caracteres.";
                valida = false;
            } 
                  
            for (char c : email.toCharArray()) {
                    if (Character.isWhitespace(c)) {
                        espaco = true;
                        break;
                    } else if (c == '@') {
                        contaArroba += 1;
                        if (contaArroba > 1) {break;}
                    } else if (contaArroba == 1 && c == '.') {
                        pontoDpsArroba = true;
                        break;
                    }
         
                }  

            if (espaco == true) {
                valida = false;
                mensagemParam = "O e-mail não pode possuir espaços";
            } else if (contaArroba > 1 || contaArroba == 0) {
                //System.out.println(contaArroba);
                valida = false;
                mensagemParam = "O e-mail deve possuir um caracter '@' ";
            } else if (pontoDpsArroba == false) {
                valida = false;
                mensagemParam = "O tipo de dominio é inválido.";
            }

        } else {
            valida = false;
            mensagemParam = "Email não pode ser nulo";
        }

        perfilAtivo = existe.pegarAtivo(email);

                resultado(valida, existeEmail, mensagemParam, perfilAtivo);
}
//request.getCodigo() -- Entender esse codigo e corrijir para que receba e valide o codigo, o envio deve ficar responsavel pelo LOGIN
   

     public void setEmail(String email) {
        this.emailRun = email;
    }

    public String getEmail() {
        return emailRun;
    }

    
}