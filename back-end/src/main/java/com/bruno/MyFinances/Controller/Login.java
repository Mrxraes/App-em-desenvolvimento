package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Codigo;
import com.bruno.MyFinances.service.Token;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.EnviarEmail;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;
import com.bruno.MyFinances.dto.LoginRequest;
import com.bruno.MyFinances.dto.LoginResponse;
import com.bruno.MyFinances.dto.ValidationRequest;
import com.bruno.MyFinances.dto.ValidationResponse;
import com.bruno.MyFinances.dto.ValidationTokenLoginRequest;
import com.bruno.MyFinances.dto.ValidationTokenLoginResponse;

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
        private final EnviarEmail enviarEmail;
        private final Password validarSenha;
        private final PasswordCripto senhaMatch;
        private final UsuarioRepository repositorio;
        private final Codigo cod;
        private final Token tokenMethods;
        private final TokenLoginRepository tokenLoginRepositorio;
   


        public Login(Email validarEmail,EnviarEmail enviarEmail, Password validarSenha,  PasswordCripto senhaMatch, UsuarioRepository repositorio, Codigo cod, Token criarToken, TokenLoginRepository tokenLoginRepositorio) {
            this.validarEmail = validarEmail;
            this.validarSenha = validarSenha;
            this.senhaMatch = senhaMatch;
            this.repositorio = repositorio;
            this.cod = cod;
            this.enviarEmail = enviarEmail;
            this.tokenMethods = criarToken;
            this.tokenLoginRepositorio = tokenLoginRepositorio;
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
        boolean perfilAtivo = repositorio.perfilAtivo(emailFormatado);

        return new LoginResponse(
            passarPag,
            mensagem,
            perfilAtivo
        );
    }

     String token;
    
    @PostMapping("/validarEmail") // verifica a igualdade do codigo 
    public ValidationResponse validarEmail(@RequestBody ValidationRequest request) throws InterruptedException {
        
        String mensagem;
        boolean loginSucedido;
        boolean perfilAtivo;
        String codigoInput = request.getCodigo();
        LocalDateTime criado = getCodeHora();
        cod.verificarCod(codigoInput, criado);
        loginSucedido = cod.getLoginSucedido();
        mensagem = cod.getMensagem();
        perfilAtivo = cod.getPerfilAtivo();

        if (loginSucedido && perfilAtivo) {
            // criar Token que sera salvo no celular para requisitar e verificar que aquele usuario ja possui login
            tokenMethods.criarTokenLogin(emailFormatado);
            Long id = repositorio.pegarId(emailFormatado);
            token = tokenLoginRepositorio.getToken(id);
            System.out.println(token + "validarEmail");
        }

        return new ValidationResponse(loginSucedido, mensagem, perfilAtivo, token);
    } 

    @PostMapping("/enviarEmailAutenticacao") // envia o codigo de 6 digitos
    public void enviarEmail() {
        repositorio.excluirCod();
        String emailFormatado = getEmailFormatado();
        String emailExiste = getEmailLogin();
        Boolean senhaIguais = getSenhasIguais();
            if (emailExiste.equals("1") && senhaIguais == true) {
                String primeiro_nome = repositorio.consultarNome(emailFormatado);
                String codigo = cod.criarCod();
                LocalDateTime criadoHora = LocalDateTime.now();
                repositorio.inserirCod(codigo, criadoHora.toLocalDate());
                System.out.println(criadoHora);
                setCodeHora(criadoHora); 
                enviarEmail.enviarEmailAutenticacao(codigo, emailFormatado, "login", primeiro_nome);
            } else {
                System.out.println("Algo fora dos padrões aconteceu.");
            }
    }

    @PostMapping("/validarTokenLogin")
    public ValidationTokenLoginResponse validarTokenLogin(@RequestBody ValidationTokenLoginRequest request) {
        String token = request.getToken();
        boolean tokenValido = tokenMethods.validarToken(token);
        System.out.println(token + " validarTokenLogin"); 
        return new ValidationTokenLoginResponse(tokenValido);
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