    package com.bruno.MyFinances.service;
    import java.util.Scanner;

    import org.springframework.stereotype.Service;

import com.bruno.MyFinances.repository.TokenRedefinirSenhaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

    @Service
    public class Password {
        public Scanner ler = new Scanner(System.in);

       
        private final UsuarioRepository repositorio;
        private final PasswordCripto criptografarSenha;
        private final TokenRedefinirSenhaRepository tokenRepositorio;

        public Password( UsuarioRepository repositorio, PasswordCripto criptografarSenha,TokenRedefinirSenhaRepository tokenRepositorio) {
            this.repositorio = repositorio;
            this.criptografarSenha = criptografarSenha;
            this.tokenRepositorio = tokenRepositorio;
        }

        /*public static void confirmarSenha(String senha, String senhaConfirm) throws InterruptedException {
            
            }

        public static void validarTam(String senha, String senhaConfirm) throws InterruptedException {
        
        } */

        private String mensagem;

        public boolean validaSenha(String senha, String senhaConfirm) throws InterruptedException {
            String mensagemParam = "";
            System.out.println("Estamos aqui");
            System.out.println(senha);
            System.out.println(senhaConfirm);
            boolean maiuscula = false;
            boolean minuscula = false;
            boolean especial = false;
            boolean algarismo = false;
            boolean espaco = false;
            boolean valida = true;
            boolean verificar = true;

            if ((senha == null || senhaConfirm == null || senha.isEmpty() || senhaConfirm.isEmpty()) && verificar == true) {
                mensagemParam = "A senha não pode ser vazia.";
                System.out.println(mensagemParam);
                valida = false; 
                verificar = false;
            }
            if (!senha.equals(senhaConfirm) && verificar == true) {
                mensagemParam = "As senhas não coincidem.";
                System.out.println(mensagemParam);
                valida = false;
                verificar = false;
            }
            if ((senha.length() < 8 || senha.length() > 64) && verificar == true) {
                mensagemParam = "A senha deve ter no minímo 8 caracteres e no máximo 64.";
                System.out.println(mensagemParam);
                valida = false;
                verificar = false;
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

            if ((maiuscula == false || minuscula == false || algarismo == false || especial == false || espaco == true) && verificar == true) {
                mensagemParam = "A senha deve ter maiúscula, minúscula, número e caractere especial, sem espaços.";
                System.out.println(mensagemParam);
                valida = false;
                verificar = false;
            }
            setMensagem(mensagemParam);
            System.out.println("Antes de retornar: " + mensagemParam);
            return valida;
        }

        public boolean validaSenha(String senha) throws InterruptedException {
            String mensagemParam = "";
            boolean maiuscula = false;
            boolean minuscula = false;
            boolean especial = false;
            boolean algarismo = false;
            boolean espaco = false;
            boolean valida = true;
            boolean verificar = true;

            if ((senha == null || senha.isEmpty()) && verificar == false) {
                mensagemParam = "A senha não pode ser vazia.";
                System.out.println(mensagemParam);
                valida = false;
            }
            if ((senha.length() < 8 || senha.length() > 64) && verificar == true) {
                mensagemParam = "A senha deve ter no minímo 8 caracteres e no máximo 64.";
                System.out.println(mensagemParam);
                valida = false;
                return valida;
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

            if ((maiuscula == false || minuscula == false || algarismo == false || especial == false || espaco == true) && verificar == true) {
                mensagemParam = "A senha deve ter maiúscula, minúscula, número, caractere especial, sem espaços e de 8 à 64 caracteres.";
                System.out.println(mensagemParam);
                valida = false;
            }
            setMensagem(mensagemParam);
            System.out.println("Antes de retornar: " + mensagemParam);
            return valida;
        }


        public void setMensagem(String msg) {
            this.mensagem = msg;
        }

        public String getMensagem() {
            return this.mensagem;
        }

    


        public boolean redefinirSenha(String token, String senha1, String senha2) {
                    boolean redefinicaoSucedida = false;
                    try {
                        boolean senhaCorreta = validaSenha(senha1, senha2);   
                        String senhaHash;
                        if (senhaCorreta == true) {
                            String email = tokenRepositorio.pegarEmailToken(token);
                            Boolean senhasIguais = criptografarSenha.macthSenha(senha1, email);
                            System.out.println(senhasIguais);
                            if (senhasIguais) {
                                setMensagem("A nova senha deve ser diferente da antiga.");
                            } else {
                                senhaHash = criptografarSenha.criptografiaSenha().encode(senha1);
                                int mudou = repositorio.mudarSenha(email, senhaHash);
                                tokenRepositorio.usadoTrue(token);
                                    if (mudou == 1) {
                                        redefinicaoSucedida = true;
                                    } else {
                                        setMensagem("Não foi possível fazer a alteração. Tente novamente!");
                                    } 
                            }
                        }
                       
                    } catch (Exception erro) {
                        erro.printStackTrace();
                        setMensagem(erro.toString());
                    }
                   
        return redefinicaoSucedida;
    }
}