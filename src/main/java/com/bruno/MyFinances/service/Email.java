package com.bruno.MyFinances.service;

import org.springframework.stereotype.Service;


import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class Email {

    private final Digitacao digitar;
    private final UsuarioRepository existe;
    private final CriarCodigo criarCod;
    private final EmailAutenticacao enviarEmail;

    public Email(Digitacao digitarRecebido, UsuarioRepository metodosRecebidos, CriarCodigo criarCod,  EmailAutenticacao enviarEmail) {
        this.digitar = digitarRecebido;
        this.existe = metodosRecebidos;
        this.criarCod = criarCod;
        this.enviarEmail = enviarEmail;
    }

    public boolean valida;
    public String emailExistente;

    public void resultado(boolean valida, String existe) {
        this.valida = valida;
        this.emailExistente = existe;
    }

    public boolean getValida() {
        return valida;
    }

    public String getEmailExiste() {
        return emailExistente;
    }

    public void validarEmail(String email) throws InterruptedException
    {
        boolean espaco = false;
        boolean pontoDpsArroba = false;
        valida = true;
        int contaArroba = 0;
        
        int indice = email.length() - 1;

        String existeEmail = existe.existeEmail(email);


        if (!email.isEmpty()) {
            if (email.charAt(0) == '@' || email.charAt(indice) == '@') {
                digitar.digitar("O email não pode possuir o caracter '@' no inicío ou no fim.");
                valida = false;
            } 
            if (email.contains("@.") || email.charAt(indice) == '.' || email.contains("..")) {
                digitar.digitar("O email não pode possuir o caracter '.' no inicío ou no fim do dominio ou de forma consecutiva.");
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
                digitar.digitar("O email não pode possuir espaços");
            } else if (contaArroba > 1 || contaArroba == 0) {
                //System.out.println(contaArroba);
                valida = false;
                digitar.digitar("O email deve possuir 1 caracter '@' ");
            } else if (pontoDpsArroba == false) {
                valida = false;
                digitar.digitar("O tipo de dominio é inválido.");
            }

        } else {
            valida = false;
            digitar.digitar("Email não pode ser nulo");
        }
                resultado(valida, existeEmail);
}

    public boolean emailAutenticacao(String email, String cadsLogin, String nome) throws InterruptedException {
        boolean real = false;
        digitar.digitar("| VERIFICAÇÃO DE EMAIL |");
        digitar.digitar("Um código foi enviado ao e-mail '" + email + "', confirme para prosseguir no " + cadsLogin);
        String codigo = criarCod.criarCod();
        existe.inserirCod(codigo);
        String codigoTable =  existe.pegarCod(codigo);

        enviarEmail.enviarEmailAutenticacao(codigoTable, email, cadsLogin, nome);

        String digitarCod  = digitar.ler().toUpperCase();
        if (digitarCod.equals(codigoTable)) {
            real = true;
        } else {
            System.out.println("Não foi possível concluir " + cadsLogin );
        }
        existe.excluirCod(codigoTable);
        return real;
    }

}