package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.service.CriarUsuario;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.EnviarEmail;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;

import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Controller;


@Controller //spring cria essa classe
public class Cadastro {

    private final CriarUsuario criarUser;
    private final Digitacao digitar;
    private final Email validarEmail;
    private final Password validarSenha;
    private final PasswordCripto criptografarSenha;
    private final BuscarIP http;
    private final HttpServletRequest request;

    public Cadastro(CriarUsuario criador, Digitacao digitarRecebido, Email validarEmail, Password validarSenha, PasswordCripto criptografarSenha, BuscarIP http,  
        HttpServletRequest request) {
        this.criarUser = criador;
        this.digitar = digitarRecebido;
        this.validarEmail = validarEmail;
        this.validarSenha = validarSenha;
        this.criptografarSenha = criptografarSenha;
        this.http = http;
        this.request = request;
    }

    public String nome_primeiro;
    public String sobrenome;
    public String email;
    public String senha;
    public String senhaConfirm;
    public String salario;
    public String dataNascimento;
    
    private String espacoRemove;
    private String espacoRemove1;
    private String emailExiste;
    private String existeEmail;

    public boolean questoesCadastro() throws InterruptedException {
        boolean perguntarSenha = true;
        boolean cadastroSucedido = false;
        boolean condicaoSenha = false;
        boolean condicaoEmail = false;
        boolean donoEmail = false;
    try {

        

        digitar.digitar("| CADASTRO |");
        digitar.digitar("Me informe o seu primeiro nome:"); 
        nome_primeiro = digitar.ler();

        digitar.digitar("Me informe o seu sobrenome:"); 
        sobrenome = digitar.ler();;

        boolean condicao = false;
        while (condicao == false) {
            digiteEmail();
            validarEmail.validarEmail(espacoRemove);
            condicaoEmail = validarEmail.getValida();
            emailExiste = validarEmail.getEmailExiste();
            if (emailExiste.equals("1") && condicaoEmail == true) {
               // System.out.println("perguntaSenha é false");
                condicao = condicaoEmail;
                perguntarSenha = false;
            } else if (emailExiste.equals("0") && condicaoEmail == true) {
                condicao = condicaoEmail;
            }
           
        }

        while (condicaoSenha == false && perguntarSenha == true) {
            digiteSenha(); 
            condicaoSenha = validarSenha.validaSenha(espacoRemove, espacoRemove1);
            if (condicaoSenha == true) {
                perguntarSenha = false;
            }
        }

        if (emailExiste.equals("0")) {
            digitar.digitar("Qual a sua renda atual?"); 
            salario = digitar.ler();;
            BigDecimal salarioBig = new BigDecimal(salario); 
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            digitar.digitar("Qual a sua data de nascimento?"); 
            dataNascimento = digitar.ler();;
            LocalDate dataNas = LocalDate.parse(dataNascimento, formatter);
            String senhaHash = criptografarSenha.criptografiaSenha().encode(senha);
            donoEmail = validarEmail.emailAutenticacao(email.trim().toLowerCase(), "cadastro", nome_primeiro);
                if (donoEmail == false) {
                    perguntarSenha = false;
                } else if (donoEmail == true) {
                    criarUser.criarUser(nome_primeiro, email.trim().toLowerCase(), senhaHash, salarioBig, dataNas, sobrenome);
                }
            
        }
       
        

    } 
    catch (InterruptedException e) {
            e.printStackTrace();
    }

                //System.out.println("Antes return" + emailExiste + email + condicaoEmail);
        setExisteCadastro(emailExiste);
        if (criarUser.getUserSalvo() == true) {
            cadastroSucedido = true;
            digitar.digitar("Cadastro bem sucedido!");
            http.IpLogin(request, email.trim().toLowerCase(), "login", nome_primeiro);
        }
        return cadastroSucedido;
    }
    public void digiteEmail() throws InterruptedException 
    {
        digitar.digitar("Qual o seu endereço de email? "); 
        email = digitar.ler();;
        espacoRemove = email.trim().toLowerCase();
    }

    public void digiteSenha() throws InterruptedException 
    {
        digitar.digitar("Digite a sua senha: "); 
        senha = digitar.ler();;
        espacoRemove = senha.trim();
        digitar.digitar("Confirme a sua senha: "); 
        senhaConfirm = digitar.ler();;
        espacoRemove1 = senhaConfirm.trim();
    }

    public void setExisteCadastro(String existe) {
        this.existeEmail = existe;
    }

    public String getExisteCadastro() {
        return existeEmail;
    }

}