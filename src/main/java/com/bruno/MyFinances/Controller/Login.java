package com.bruno.MyFinances.Controller;
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

        public Login(Digitacao digitarRecebido, Email validarEmail, Password validarSenha,  PasswordCripto senhaMatch) {
            this.digitar = digitarRecebido;
            this.validarEmail = validarEmail;
            this.validarSenha = validarSenha;
            this.senhaMatch = senhaMatch;
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

        try 
        {

            digitar.digitar("| LOGIN |");
            
            while (condicaoEmail == false) {
                digiteEmail();
                validarEmail.validarEmail(emailFormatado);
                condicaoEmail = validarEmail.getValida();
                emailExiste = validarEmail.getEmailExiste();
                if (emailExiste.equals("0") && condicaoEmail == true) {
                    perguntarSenha = false;
                }
            
            }
                
                    //System.out.println("passa pra frente");


            while (condicaoSenha == false || senhaIguais == false || perguntarSenha == true) {
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
                
            if (condicaoEmail == true && condicaoSenha == true && perguntarSenha == false && emailExiste.equals("1") && senhaIguais == true)  {
                loginSucedido = true;
                digitar.digitar("Login bem sucedido!");
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