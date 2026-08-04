package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.EnviarEmail;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;



    @Controller //spring cria essa classe
    public class Login {

        private final Digitacao digitar;
        private final Email validarEmail;
        private final Password validarSenha;
        private final PasswordCripto senhaMatch;
        private final UsuarioRepository repositorio;
        private final BuscarIP http;
        private final HttpServletRequest request;

        public Login(Digitacao digitarRecebido, Email validarEmail, Password validarSenha,  PasswordCripto senhaMatch, UsuarioRepository repositorio, BuscarIP http, HttpServletRequest request) {
            this.digitar = digitarRecebido;
            this.validarEmail = validarEmail;
            this.validarSenha = validarSenha;
            this.senhaMatch = senhaMatch;
            this.repositorio = repositorio;
            this.http = http;
            this.request = request;
        }

        private String email;
        private String senha;
        private String emailFormatado;
        private String senhaFormatada = "";
        private String emailExiste = "";
        private Boolean irCadas;
        

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
            digitar.digitar("| Caso deseje fazer o cadastro, digite 'CADASTRO' |");
            
            while (condicaoEmail == false) {
                digiteEmail();
                
                if (!emailFormatado.toUpperCase().equals("CADASTRO")) {
                    validarEmail.validarEmail(emailFormatado);
                    condicaoEmail = validarEmail.getValida();
                    emailExiste = validarEmail.getEmailExiste();
                } else {
                    senhaFormatada = "cadastro";
                    perguntarSenha = false;
                    break;
                }

               
            }
                
           

            while (perguntarSenha == true) {
                    digiteSenha(); 

                    if (senhaFormatada.toUpperCase().equals("CADASTRO")) {
                    perguntarSenha = false;
                    break;
                    } else if (!senhaFormatada.toUpperCase().equals("CADASTRO")) {
                        condicaoSenha = validarSenha.validaSenha(senhaFormatada);
                        if (condicaoSenha == true && emailExiste.equals("1")) {
                            senhaIguais = senhaMatch.macthSenha(senhaFormatada, emailFormatado); 
                            perguntarSenha = false;
                        } else if (condicaoSenha == true && emailExiste.equals("0")) {
                            perguntarSenha = false;
                        } 
                    }
                }

            if (emailFormatado.toUpperCase().equals("CADASTRO") || senhaFormatada.toUpperCase().equals("CADASTRO")) {
                setIrCadas(true);
            } else {
                setIrCadas(false);
            }

            if (emailExiste.equals("1") && senhaIguais == true) {
            String primeiro_nome = repositorio.consultarNome(email);
            donoEmail = validarEmail.emailAutenticacao(emailFormatado, "login", primeiro_nome); 
            if (donoEmail == true)  {
                digitar.digitar("Login bem sucedido!");
                loginSucedido = true;
                http.IpLogin(request, emailFormatado, "login", primeiro_nome);
            } 
            } else if ((emailExiste.equals("0") || senhaIguais == false) && (!emailFormatado.toUpperCase().equals("CADASTRO") && !senhaFormatada.toUpperCase().equals("CADASTRO"))) {
                digitar.digitar("A senha está incorreta ou o email não corresponde.");
                digitar.digitar("Você esqueceu a senha? Digite 'REDEFINIR SENHA' para a recuperação.");
            }
            
        } 
        catch (InterruptedException e) 
        {
            e.printStackTrace();
        }   
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

        public void setIrCadas(Boolean valor) {
            irCadas = valor;
        } 

        public boolean getIrCadas() {
            return irCadas;
        }
        
        public String getEmailLogin() {
            return emailExiste;
        }
    }