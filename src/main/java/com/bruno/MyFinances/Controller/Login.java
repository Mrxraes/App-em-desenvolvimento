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
        private String emailExiste;
        private Boolean irCadas;        

        public boolean questoesLogin() throws InterruptedException {

            boolean loginSucedido = false;
            Integer tentativasLogin = 0;
            ArrayList<String> emails = new ArrayList<>();
            ArrayList<Boolean> iguais = new ArrayList<>();
        try 
        {

            while (true) {

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
                
                if (!emailFormatado.toUpperCase().equals("CADASTRO") && !emailFormatado.toUpperCase().equals("REDEFINIR")) {
                    validarEmail.validarEmail(emailFormatado);
                    condicaoEmail = validarEmail.getValida();
                    emailExiste = validarEmail.getEmailExiste();
                    validarEmail.setEmail(email); 
                } else if (emailFormatado.toUpperCase().equals("CADASTRO")) {
                    senhaFormatada = "CADASTRO";
                    perguntarSenha = false;
                    break;
                } else if (emailFormatado.toUpperCase().equals("REDEFINIR")) {              
                    perguntarSenha = false;
                    break;
                }
                
               
            }
                
           

            while (perguntarSenha == true) {
                    digiteSenha(); 

                    if (senhaFormatada.toUpperCase().equals("CADASTRO")) {
                        perguntarSenha = false;
                        break;
                    } else if (senhaFormatada.toUpperCase().equals("REDEFINIR")) {
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
            if (emailFormatado.toUpperCase().equals("REDEFINIR") || senhaFormatada.toUpperCase().equals("REDEFINIR")) {
                redefinicao();
                executarCondicional = false;
            }


            if (emailExiste.equals("1") && senhaIguais == true) 
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
            else if ((emailExiste.equals("0") || senhaIguais == false) && (!emailFormatado.toUpperCase().equals("CADASTRO") && !senhaFormatada.toUpperCase().equals("CADASTRO")) && (executarCondicional == true) && (!emailFormatado.toUpperCase().equals("REDEFINIR") && !senhaFormatada.toUpperCase().equals("REDEFINIR"))) 
            {
                digitar.digitar("A senha está incorreta ou o email não corresponde.");
                tentativasLogin += 1;
                emails.add(emailFormatado);
                System.out.println(emailFormatado);
            }
            else if ((emailExiste.equals("0") || senhaIguais == false) && (!emailFormatado.toUpperCase().equals("CADASTRO") && !senhaFormatada.toUpperCase().equals("CADASTRO"))) 
            {
                digitar.digitar("Digite 'REDEFINIR' para a recuperação da sua senha ou 'TENTAR' para tentar novamente.");
                String decisao = digitar.ler().toUpperCase().trim();
                if (decisao.equals("TENTAR")) {
                    continue;
                } else if (decisao.equals("REDEFINIR")) {
                    redefinicao(); 
                    continue;
                }
            }
              
            
            } 
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
         digitar.digitar(
        "Se existir uma conta associada a este e-mail, as instruções foram enviadas."
        );
    }
    
    

}