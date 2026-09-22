package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.dto.CadastroResponse;
import com.bruno.MyFinances.dto.CadastroResquest;
import com.bruno.MyFinances.service.CriarUsuario;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;

import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api") //spring cria essa classe
public class Cadastro {

    private final CriarUsuario criarUser;
    private final Digitacao digitar;
    private final Email validarEmail;
    private final Password validarSenha;
    private final PasswordCripto criptografarSenha;
    private final BuscarIP http;
    private final HttpServletRequest requestIp;

    public Cadastro(CriarUsuario criador, Digitacao digitarRecebido, Email validarEmail, Password validarSenha, PasswordCripto criptografarSenha, BuscarIP http,  
        HttpServletRequest request) {
        this.criarUser = criador;
        this.digitar = digitarRecebido;
        this.validarEmail = validarEmail;
        this.validarSenha = validarSenha;
        this.criptografarSenha = criptografarSenha;
        this.http = http;
        this.requestIp = request;
    }

    private String nome_primeiro;
    private String sobrenome;
    private String email;
    private String senha;
    private String senhaConfirm;
    private String salario;
    private String dataNascimento;
    private BigDecimal salarioBig; 
    private LocalDate dataNas; 
    
    private String espacoRemove;
    private String espacoRemove1; 
    private String existeEmail;
    private boolean sair;

    @PostMapping("/cadastro")
    public CadastroResponse Cadastro(@RequestBody CadastroResquest request) throws InterruptedException{
    sair = false;
    String nome_primeiro = null;
    String sobrenome = null;
    String email = null;
    String emailFormatado;
    String senha;
    String senhaFormatada;
    String senhaConfirm;
    String senhaConfirmFormatada;
    
    String salario;
    String dataNascimento;
    BigDecimal salarioBig = null; 
    LocalDate dataNas = null; 
    boolean perguntarSenha = true;
    boolean cadastroSucedido = false;
    boolean condicaoSenha = false;
    boolean condicaoEmail = false;
    boolean donoEmail = false;
    String emailExiste = "";

    String mensagemNome = "";
    String mensagemSobrenome = "";
    String mensagemEmail = "";
    String mensagemSalario = "";
    String mensagemData = "";
    String mensagemSenha = "";

    boolean validoNome = false;
    boolean validoSobrenome = false;
    boolean validoEmail = false;
    boolean validoSalario = false;
    boolean validaData = false;
    boolean validoSenha = false;


        try {
           
       

            nome_primeiro = request.getNome();
                if (!nome_primeiro.isEmpty()) {
                    validoNome = true;
                } else {
                    mensagemNome = "Nome não pode ser vazio";
                }
           
            sobrenome = request.getSobrenome(); 
                if (!sobrenome.isEmpty()) {
                        validoSobrenome = true;
                } else {
                    mensagemSobrenome = "Sobrenome não pode ser vazio";
                }
            
            email = request.getEmail();
            emailFormatado = email.trim().toLowerCase();
            validarEmail.validarEmail(emailFormatado);
            condicaoEmail = validarEmail.getValida();
            emailExiste = validarEmail.getEmailExiste();
                if (emailExiste.equals("1") && condicaoEmail == true) {
                    mensagemEmail = "Este e-mail já está cadastrado.";
                } else if (emailExiste.equals("0") && condicaoEmail == true) {
                    validoEmail = true;
                } else if (condicaoEmail == false) {
                    mensagemEmail = validarEmail.getMensagem();
                } else {
                    mensagemEmail = "Algo inesperado aconteceu...";
                }
            validarEmail.setEmail(email);
                 
            senha = request.getSenha();
            senhaConfirm = request.getSenhaConfirm();
            senhaFormatada = senha.trim();
            senhaConfirmFormatada = senhaConfirm.trim();
            condicaoSenha = validarSenha.validaSenha(senhaFormatada, senhaConfirmFormatada);
                if (condicaoSenha == true) {
                    validoSenha = true;
                } else if (condicaoSenha == false) {
                    mensagemSenha = validarSenha.getMensagem();
                }
            
                salario = request.getSalario();
                    if (salario.matches("\\d+")) {
                        salarioBig = new BigDecimal(salario); 
                        validoSalario = true;
                    } else {
                        mensagemSalario =  "Somente é permitido números";
                    }
            
                     
                dataNascimento = request.getDataNascimento();
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                        dataNas = LocalDate.parse(dataNascimento, formatter);
                        validaData = true;
                    } catch (DateTimeParseException e) {
                        mensagemData = "A data digitada não é válida.";
                    }
                    
                    System.out.println(validoNome);
                    System.out.println(validoSobrenome);
                    System.out.println(validoEmail);
                    System.out.println(validoSenha);
                    System.out.println(validoSalario);


                    if (validoNome && validoSobrenome && validoEmail &&  validoSenha && validoSalario) {
                        String senhaHash = criptografarSenha.criptografiaSenha().encode(senha);
                        criarUser.criarUser(nome_primeiro, emailFormatado, senhaHash, salarioBig, dataNas, sobrenome, LocalDateTime.now(), false);
                        System.out.println("Cria cadastro, envia pra pag de espera e começa a etapa de validar email"); // USUARIO clica no link, valida token, se tudo certo da update e manda pro login mostrando sucesso ou falha
                        // agr so fazer a pag, redirecionamento, as mensagend so front

                    } else {
                        System.out.println("Não foi possível concluir o cadastro porque algo deu errado");
                    }

                    //Booelan donoEmail = validarEmail.emailAutenticacao(email.trim().toLowerCase(), "cadastro", nome_primeiro);
                        

         
                
            

        } catch (InterruptedException e) {
                e.printStackTrace();
        }

        if (criarUser.getUserSalvo()) {
            cadastroSucedido = true;
            http.IpLogin(requestIp, email.trim().toLowerCase(), "login", nome_primeiro);
        } 
        
        System.out.println(mensagemNome);
        System.out.println(mensagemSobrenome);
        System.out.println(mensagemEmail);
        System.out.println(mensagemSenha);
        System.out.println(mensagemSalario);
        System.out.println(mensagemData);

           return new CadastroResponse(validoNome, validoSobrenome, validoEmail, validoSalario, validaData, validoSenha, mensagemNome, mensagemSobrenome, mensagemEmail, mensagemSalario ,mensagemData, mensagemSenha);

    }
}