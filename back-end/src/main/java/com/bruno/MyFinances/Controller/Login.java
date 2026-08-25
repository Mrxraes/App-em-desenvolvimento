package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;

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
        private String senhaFormatada;
        private Boolean irCadas;
        private String emailExiste;
        

        public boolean questoesLogin() throws InterruptedException {
            boolean loginLoop = true;
            setIrCadas(false);  
            boolean loginSucedido = false;
            Integer tentativasLogin = 0;
            ArrayList<String> emails = new ArrayList<>();
            ArrayList<Boolean> iguais = new ArrayList<>();
        try 
        {

            while (loginLoop == true) {

                if (tentativasLogin >= 5) {
                    boolean deveParar = false;
                    boolean loopExec = false;

                    for (Integer i = 0; i <= 3; i++) {
                        boolean verificarEmail = emails.get(i).equals(emails.get(i+1));
                        iguais.add(verificarEmail);
                        loopExec = true;
                    }

                    if (loopExec == true) {
                    if (iguais.get(0) == true && iguais.get(1) == true && iguais.get(2) == true && iguais.get(3) == true) {
                        deveParar = true;
                        if (deveParar == true) {
                        digitar.digitar("Número de tentativas de login excedida, tente novamente.");
                        break;
                        } 
                    } else if (deveParar == false) {
                        System.out.println("Continua para nao");
                        continue;
                    }
                }
               
            } else {

                boolean perguntarSenha = true;
                boolean condicaoSenha = false;
                boolean condicaoEmail = false;
                boolean senhaIguais = false;
                boolean donoEmail = false;
                boolean executarCondicional = true;

                digitar.digitar("| LOGIN |");
                digitar.digitar("| Caso deseje fazer o cadastro, digite 'CADASTRO' |");
                digitar.digitar("| Caso deseje redefinir a senha, digite 'REDEFINIR' |");

                while (condicaoEmail == false) {
                    digiteEmail();
                    
                    if (emailFormatado.equalsIgnoreCase("CADASTRO")) {
                        senhaFormatada = "CADASTRO";
                        System.out.println("Cai aqui");
                        setEmailLogin("CADASTRO");
                        perguntarSenha = false;
                        break;
                    } else if (emailFormatado.equalsIgnoreCase("REDEFINIR")) {              
                        perguntarSenha = false;
                        setEmailLogin("voltar");
                        break;
                    }  else {
                        validarEmail.validarEmail(emailFormatado);
                        condicaoEmail = validarEmail.getValida();
                        setEmailLogin(validarEmail.getEmailExiste());
                        validarEmail.setEmail(email); 
                    }      
                }

                while (perguntarSenha == true) {
                    digiteSenha(); 
                        if (senhaFormatada.equalsIgnoreCase("CADASTRO")) {
                            perguntarSenha = false;
                            break;
                        } else if (senhaFormatada.equalsIgnoreCase("REDEFINIR")) {
                            perguntarSenha = false;
                            break;
                        } else if (!senhaFormatada.equalsIgnoreCase("CADASTRO")) {
                            condicaoSenha = validarSenha.validaSenha(senhaFormatada);
                            if (condicaoSenha == true && emailExiste.equals("1")) {
                                senhaIguais = senhaMatch.macthSenha(senhaFormatada, emailFormatado); 
                                perguntarSenha = false;
                            } else if (condicaoSenha == true && emailExiste.equals("0")) {
                                perguntarSenha = false;
                            } 
                        }
                }

                ///////
                if (emailFormatado.equalsIgnoreCase("CADASTRO") || senhaFormatada.equalsIgnoreCase("CADASTRO")) {
                    setIrCadas(true);
                    loginLoop = false;
                } else {
                    setIrCadas(false);
                }
                
                if (emailFormatado.equalsIgnoreCase("REDEFINIR") || senhaFormatada.equalsIgnoreCase("REDEFINIR")) {
                    redefinicao();
                    executarCondicional = false;
                }
                ///////

                //////
                if (getEmailLogin().equals("1") && senhaIguais == true) 
                {
                    String primeiro_nome = repositorio.consultarNome(email);
                    donoEmail = validarEmail.emailAutenticacao(emailFormatado, "login", primeiro_nome); 
                    if (donoEmail == true)  {
                        digitar.digitar("Login bem sucedido!");
                        loginSucedido = true;
                        http.IpLogin(request, emailFormatado, "login", primeiro_nome);
                        return true;
                    } 
                } 
                else if ((getEmailLogin().equals("0") || senhaIguais == false) && (!getEmailLogin().equalsIgnoreCase("CADASTRO") && !senhaFormatada.equalsIgnoreCase("CADASTRO")) && (executarCondicional == true) && (!emailFormatado.equalsIgnoreCase("REDEFINIR") && !senhaFormatada.equalsIgnoreCase("REDEFINIR"))) 
                {
                    digitar.digitar("A senha está incorreta ou o email não corresponde.");
                    tentativasLogin += 1;
                    emails.add(emailFormatado);
                }
                else if ((getEmailLogin().equals("0") || senhaIguais == false) && (!emailFormatado.equalsIgnoreCase("CADASTRO") && !senhaFormatada.equalsIgnoreCase("CADASTRO"))) 
                {
                    digitar.digitar("Digite 'REDEFINIR' para a recuperação da sua senha ou 'TENTAR' para tentar novamente.");
                    String decisao = digitar.ler().trim();
                        if (decisao.equalsIgnoreCase("TENTAR")) {
                            continue;
                        } else if (decisao.equalsIgnoreCase("REDEFINIR")) {
                            redefinicao(); 
                            continue;
                        }
                    } 
                    //////
                } 
            }
        } catch (InterruptedException e) 
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
        
        public void setEmailLogin(String emailExiste) {
            this.emailExiste = emailExiste;
        }

        public String getEmailLogin() {
            return emailExiste;
        }

        public void redefinicao() throws InterruptedException {
            //boolean redefinicao = false;
            digiteEmail();
            String nome = repositorio.consultarNome(emailFormatado);
            boolean sucedida = false;
            if (nome != null) {
                sucedida = validarSenha.redefinirSenha(emailFormatado, nome);
                if (sucedida == true) {
                    digitar.digitar("Alteração de senha bem sucedida, faça login para continuar.");
                    //redefinicao = true;
                } 
         //return redefinicao;
        }
       
    }
    
    

}