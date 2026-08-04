package com.bruno.MyFinances.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;


import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class Email {

    private final Digitacao digitar;
    private final UsuarioRepository existe;
    private final CriarCodigo criarCod;
    private final EnviarEmail enviarEmail;

    public Email(Digitacao digitarRecebido, UsuarioRepository metodosRecebidos, CriarCodigo criarCod,  EnviarEmail enviarEmail) {
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
        String codigoTable = "";
        boolean real;
        LocalDateTime criado = LocalDateTime.now();
        digitar.digitar("| VERIFICAÇÃO DE EMAIL |");
        digitar.digitar("Um código de 6 dígitos foi enviado ao e-mail '" + email + " , confirme para prosseguir no " + cadsLogin);
        String codigo = criarCod.criarCod();
        existe.inserirCod(codigo);
        codigoTable =  existe.pegarCod(codigo);
        enviarEmail.enviarEmailAutenticacao(codigoTable, email, cadsLogin, nome);
        digitar.digitar("Caso precise de um novo código, digite 'ENVIAR'");

        boolean codigoExpirado = false;
        boolean sair = false;
            while (true) {
            //ARRUMAR ESSE FLUXO
            real = false;
            String digitarCod = null; 
            String escolha = null;  

            if (codigoExpirado == true) {
                digitarCod = "ENVIAR";
            } else if (codigoExpirado == false) {
                if (sair == true) {
                digitar.digitar("Saindo...");
                break;
            } else {
                digitarCod =  digitar.ler().toUpperCase();
            }

            } 
            
            LocalDateTime agora = LocalDateTime.now();
            Duration tempo = Duration.between(criado, agora);
            System.out.println("voltou");
            if (digitarCod.equals(codigoTable)) {
                if (tempo.toSeconds() < 300) {
                real = true;
                break; }
                else {
                    digitar.digitar("Código expirado!");
                    digitar.digitar("Digite 'ENVIAR' para obter um novo código ou 'SAIR' para finalizar.");
                    escolha  = digitar.ler().toUpperCase();
                    if (escolha.equals("ENVIAR")) {
                        codigoExpirado = true;
                    } else if (escolha.equals("SAIR")) {
                        sair = true;
                    } else {
                        digitar.digitar("Opção inválida.");
                    }
                }
            } else if (digitarCod.equals("ENVIAR") || codigoExpirado == true) {
                digitar.digitar("Um novo email com seu código foi enviado.");
                codigo = criarCod.criarCod();
                existe.inserirCod(codigo);
                codigoTable =  existe.pegarCod(codigo);
                enviarEmail.enviarEmailAutenticacao(codigoTable, email, cadsLogin, nome);
                codigoExpirado = false;
            } else {
                digitar.digitar("| Não foi possível concluir " + cadsLogin + " |");
                digitar.digitar("Código inválido. Tente novamente! ");
                if (digitarCod.length() > 6) {
                    digitar.digitar("O código possui apenas 6 dígitos.");
                }
            }

        }
        existe.excluirCod();
        return real;
    }

}