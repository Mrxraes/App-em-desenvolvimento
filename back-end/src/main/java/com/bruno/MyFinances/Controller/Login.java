package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Codigo;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.EnviarEmail;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;
import com.bruno.MyFinances.dto.LoginRequest;
import com.bruno.MyFinances.dto.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.ArrayList;



    @RestController
    @RequestMapping("/api") // cria a porta de entrada para a classe e informa que é uma API
    public class Login {

        private final Email validarEmail;
        private final Password validarSenha;
        private final PasswordCripto senhaMatch;
   


        public Login(Email validarEmail, Password validarSenha,  PasswordCripto senhaMatch) {
            this.validarEmail = validarEmail;
            this.validarSenha = validarSenha;
            this.senhaMatch = senhaMatch;
        }

        private String email;
        private String senha;
        private String emailFormatado;
        private String senhaFormatada;
        private String emailExiste;
        private String mensagem;
        private boolean passarPag;
        private boolean senhaIguais;
        private LocalDateTime criado;

        
        @PostMapping("/login")   
        public LoginResponse questoesLogin(@RequestBody LoginRequest request) throws InterruptedException {
            email = "";
            senha = "";
            mensagem = "";
            passarPag = false;
            senhaIguais = false;
            System.out.println(email + " 1 " + senha);
            Integer tentativasLogin = 0;
            ArrayList<String> emails = new ArrayList<>();
            ArrayList<Boolean> iguais = new ArrayList<>();
        try 
        {
        System.out.println(email + " 2 " + senha);


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
                        mensagem = "Número de tentativas de login excedida, tente novamente.";
                        } 
                    } else if (deveParar == false) {
                    }
                }
               
            } else {

                boolean condicaoSenha = false;
                boolean condicaoEmail = false;
 
                email = request.getEmail();
                emailFormatado = email.trim().toLowerCase();
                validarEmail.validarEmail(emailFormatado);
                condicaoEmail = validarEmail.getValida();
                System.out.println(condicaoEmail);
                if (condicaoEmail == false) {
                    mensagem = validarEmail.getMensagem();
                    System.out.println(mensagem);

                }
                setEmailLogin(validarEmail.getEmailExiste());
                validarEmail.setEmail(emailFormatado); 
                
            

        
                senha = request.getSenha();
                senhaFormatada = senha.trim();
                condicaoSenha = validarSenha.validaSenha(senhaFormatada);
                if (condicaoSenha == true && emailExiste.equals("1")) {
                    senhaIguais = senhaMatch.macthSenha(senhaFormatada, emailFormatado); 
                } 
                if (condicaoSenha == false) {
                    mensagem += "\n" + validarSenha.getMensagem();
                }
            
                System.out.println(senhaIguais);
                String ver = getEmailLogin();
                System.out.println(ver);

                // Cuida da passagem para página de verificação
                if (emailExiste.equals("1") && senhaIguais == true) {
                    passarPag = true;
                    System.out.println(passarPag);
                } else if (emailFormatado.isEmpty() || senhaFormatada.isEmpty()) {
                    mensagem = "E-mail e senha não podem ser vazios."; // resposta pra la
                } else if (condicaoSenha == false) {
                    mensagem = validarSenha.getMensagem();
                } else if (emailExiste.equals("0") || senhaIguais == false || condicaoEmail == false || condicaoSenha == false )
                {
                    mensagem = "A senha está incorreta ou o e-mail não corresponde."; // resposta pra la
                    System.out.println(mensagem);
                    passarPag = false;
                    tentativasLogin += 1;
                    emails.add(emailFormatado);
                }
                // Cuida da passagem para a página de verificação
    
                
                

            }
        
        } catch (InterruptedException e) 
                {
                    System.out.println(email + " 3 " + senha);
                    e.printStackTrace();
                }
                
        System.out.println(email + " 4 " + senha);
        System.out.println(passarPag);
        return new LoginResponse(
            passarPag,
            mensagem
        );
    }

        public String getEmailFormatado() {
            return emailFormatado;
        }

        public String getSenhaFormatada() {
            return senhaFormatada;
        }
        
        public void setEmailLogin(String emailExiste) {
            this.emailExiste = emailExiste;
        }

        public String getEmailLogin() {
            return emailExiste;
        }

        public boolean getSenhasIguais() {
            return senhaIguais;
        }

        public void setCodeHora(LocalDateTime code) {
            this.criado = code;
        }

        public LocalDateTime getCodeHora() {
            return criado;
        }

/*
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
*/
         //return redefinicao;
        }