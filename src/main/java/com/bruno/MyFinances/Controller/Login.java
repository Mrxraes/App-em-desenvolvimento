package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;

import org.springframework.stereotype.Controller;



    @Controller //spring cria essa classe
    public class Login {

        private final Digitacao digitar;
        private final Email validarEmail;
        private final Password validarSenha;
        private final PasswordCripto senhaMatch;
        private final UsuarioRepository repositorio;

        public Login(Digitacao digitarRecebido, Email validarEmail, Password validarSenha,  PasswordCripto senhaMatch, UsuarioRepository repositorio) {
            this.digitar = digitarRecebido;
            this.validarEmail = validarEmail;
            this.validarSenha = validarSenha;
            this.senhaMatch = senhaMatch;
            this.repositorio = repositorio;
        }

        private String email;
        private String senha;
        private String emailFormatado;
        private String senhaFormatada;
        private String emailExiste;
        

        public boolean questoesLogin() throws InterruptedException {
        
            boolean perguntarSenha = true;
            boolean loginSucedido = false;
            boolean condicaoSenha = false;
            boolean condicaoEmail = false;
            boolean senhaIguais = false;
            boolean donoEmail = false;

        try 
        {

            digitar.digitar("| LOGIN |");
            
            while (condicaoEmail == false) {
                digiteEmail();
                validarEmail.validarEmail(emailFormatado);
                condicaoEmail = validarEmail.getValida();
                emailExiste = validarEmail.getEmailExiste();
                if (emailExiste.equals("0")) {
                    perguntarSenha = false;
                    break;
                }
                
            }
                
                    //System.out.println("passa pra frente");

            while (senhaIguais == false && perguntarSenha == true) {
                    digiteSenha(); 
                    condicaoSenha = validarSenha.validaSenha(senhaFormatada);
                    senhaIguais = senhaMatch.macthSenha(senhaFormatada, emailFormatado); 
                    if (condicaoSenha == true && senhaIguais == true) {
                        perguntarSenha = false;
                    }
            }
        } 
        catch (InterruptedException e) 
        {
            e.printStackTrace();
        }   
            String primeiro_nome = repositorio.consultarNome(email);
            donoEmail = validarEmail.emailAutenticacao(emailFormatado, "login", primeiro_nome); 
            if (condicaoEmail == true && condicaoSenha == true && perguntarSenha == false && emailExiste.equals("1") && senhaIguais == true && donoEmail == true)  {
                digitar.digitar("Login bem sucedido!");
                loginSucedido = true;
            }
                    //System.out.println("retorna");
            setEmailLogin(emailExiste);
            return loginSucedido;
        }

        public void digiteEmail() throws InterruptedException 
        {
            digitar.digitar("Qual o seu endereço de email? "); 
            email = digitar.ler();;
            emailFormatado = email.trim().toLowerCase();
        }

        public void digiteSenha() throws InterruptedException 
        {
            digitar.digitar("Digite a sua senha: "); 
            senha = digitar.ler();
            senhaFormatada = senha.trim();
        }

        public void setEmailLogin(String existe) {
            this.emailExiste = existe;
        } 
        
        public String getEmailLogin() {
            return emailExiste;
        }
    }