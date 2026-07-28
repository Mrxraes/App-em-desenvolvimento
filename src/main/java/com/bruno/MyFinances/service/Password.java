    package com.bruno.MyFinances.service;
    import java.util.Scanner;

    import org.springframework.stereotype.Service;

    @Service
    public class Password {
        public Scanner ler = new Scanner(System.in);

        private final Digitacao digitar;

        public Password(Digitacao digitacaoRecebida) {
            this.digitar = digitacaoRecebida;
        }

        /*public static void confirmarSenha(String senha, String senhaConfirm) throws InterruptedException {
            
            }

        public static void validarTam(String senha, String senhaConfirm) throws InterruptedException {
        
        } */

        public boolean validaSenha(String senha, String senhaConfirm) throws InterruptedException {
            boolean maiuscula = false;
            boolean minuscula = false;
            boolean especial = false;
            boolean algarismo = false;
            boolean espaco = false;
            boolean valida = true;

            if (!senha.equals(senhaConfirm)) {
                digitar.digitar("As senhas não coincidem.");
                valida = false;
            }
            if (senha.length() < 8 || senha.length() > 64) {
                digitar.digitar("A senha deve ter no minímo 8 caracteres e no máximo 64.");
                valida = false;
            }

            for (char c : senha.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    maiuscula = true;
                } else if (Character.isLowerCase(c)) {
                    minuscula = true;
                } else if (Character.isDigit(c)) {
                    algarismo = true;
                } else if (Character.isWhitespace(c)) {
                    espaco = true;   
                } else {
                    especial = true;
                }
            }

            if (maiuscula == false || minuscula == false || algarismo == false || especial == false || espaco == true) {
                digitar.digitar("A senha deve conter ao menos 1 caractere maiúsculo, 1 caractere minúsuculo, 1 número e 1 especial. Não pode haver espaços.");
                valida = false;
            }
            return valida;
        }

        public boolean validaSenha(String senha) throws InterruptedException {
            boolean maiuscula = false;
            boolean minuscula = false;
            boolean especial = false;
            boolean algarismo = false;
            boolean espaco = false;
            boolean valida = true;

            if (senha.length() < 8 || senha.length() > 64) {
                digitar.digitar("A senha deve ter no minímo 8 caracteres e no máximo 64.");
                valida = false;
            }

            for (char c : senha.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    maiuscula = true;
                } else if (Character.isLowerCase(c)) {
                    minuscula = true;
                } else if (Character.isDigit(c)) {
                    algarismo = true;
                } else if (Character.isWhitespace(c)) {
                    espaco = true;   
                } else {
                    especial = true;
                }
            }

            if (maiuscula == false || minuscula == false || algarismo == false || especial == false || espaco == true) {
                digitar.digitar("A senha deve conter ao menos 1 caractere maiúsculo, 1 caractere minúsuculo, 1 número e 1 especial. Não pode haver espaços.");
                valida = false;
            }
            return valida;
        }
    }
