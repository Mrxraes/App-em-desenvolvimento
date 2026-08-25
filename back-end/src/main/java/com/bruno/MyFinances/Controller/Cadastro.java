package com.bruno.MyFinances.Controller;
import com.bruno.MyFinances.service.CriarUsuario;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.Password;
import com.bruno.MyFinances.service.PasswordCripto;

import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

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


    public boolean questoesCadastro() throws InterruptedException {
    sair = false;
    String nome_primeiro = null;
    String sobrenome = null;
    String email = null;
    String senha = null;
    String senhaConfirm;
    String salario;
    String dataNascimento;
    BigDecimal salarioBig = null; 
    LocalDate dataNas = null; 
    boolean perguntarSenha = true;
    boolean cadastroSucedido = false;
    boolean condicaoSenha = false;
    boolean condicaoEmail = false;
    boolean donoEmail = false;
    String emailExiste = null;
        try {
            boolean nomeCerto = false;
            boolean sobrenomeCerto = false;
            boolean salarioCerto = false;
            boolean dataCerta = false;

            while (sair == false) {
                if (sair == false) {
                    digitar.digitar("| CADASTRO |");
                    digitar.digitar("| DIGITE 'VOLTAR' PARA RETORNAR |");
                        while (nomeCerto == false) {
                            digitar.digitar("Me informe o seu primeiro nome:"); 
                            nome_primeiro = digitar.ler();
                                if (nome_primeiro.equalsIgnoreCase("voltar")) {
                                    sair = true;
                                    break; 
                                } else if (!nome_primeiro.isEmpty()) {
                                    nomeCerto = true;
                                } else {
                                    digitar.digitar("| NOME NÃO PODE SER VAZIO |");
                                }
                        }   
                }

                if (sair == false) {
                    while (sobrenomeCerto == false) {
                        digitar.digitar("Me informe o seu sobrenome:"); 
                            sobrenome = digitar.ler(); 
                                if (sobrenome.equalsIgnoreCase("voltar")) {
                                    sair = true;
                                    break; 
                                } else if (!sobrenome.isEmpty()) {
                                    sobrenomeCerto = true;
                                } else {
                                    digitar.digitar("| NOME NÃO PODE SER VAZIO |");
                                }
                    }
                }

                boolean condicao = false;
                if (sair == false) {
                    while (condicao == false) {
                        digiteEmail();
                        if (espacoRemove.equalsIgnoreCase("voltar")) {
                                    sair = true;
                                    break; 
                        } else { 
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
                            validarEmail.setEmail(email);
                        }
                    }
                }

                if (sair == false) {
                    while (condicaoSenha == false && perguntarSenha == true) {
                        digiteSenha(); 
                        condicaoSenha = validarSenha.validaSenha(espacoRemove, espacoRemove1);
                            if (espacoRemove.equalsIgnoreCase("voltar")) {
                                    sair = true;
                                    break; 
                            }
                            else if (condicaoSenha == true) {
                                perguntarSenha = false;
                            }
                    }
                }

                if (sair == false) { 
                    if (emailExiste.equals("0")) {
                        while (salarioCerto == false) {
                            digitar.digitar("Qual a sua renda atual?"); 
                            salario = digitar.ler();
                                if (salario.equalsIgnoreCase("voltar")) {
                                    sair = true;
                                    break; 
                                }
                                else if (salario.matches("\\d+")) {
                                    salarioBig = new BigDecimal(salario); 
                                } else {
                                    digitar.digitar("| SÓ É PERMITIDO NÚMEROS |");
                                }
                        }
                    }

                    if (sair == false) {
                            while (dataCerta == false) {
                                digitar.digitar("Qual a sua data de nascimento?"); 
                                dataNascimento = digitar.ler();

                                if (dataNascimento.equalsIgnoreCase("voltar")) {
                                    sair = true;
                                    break; 
                                }

                                    try {
                                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                                        dataNas = LocalDate.parse(dataNascimento, formatter);
                                        dataCerta = true;
                                    } catch (DateTimeParseException e) {
                                        digitar.digitar("| DATA INVÁLIDA |");
                                    }
                            }
                        }
                }

                if (sair == false) {
                    String senhaHash = criptografarSenha.criptografiaSenha().encode(senha);
                    donoEmail = validarEmail.emailAutenticacao(email.trim().toLowerCase(), "cadastro", nome_primeiro);
                        if (donoEmail == false) {
                            perguntarSenha = false;
                        } else if (donoEmail == true) {
                            criarUser.criarUser(nome_primeiro, email.trim().toLowerCase(), senhaHash, salarioBig, dataNas, sobrenome);
                        }
                }
            }

        } catch (InterruptedException e) {
                e.printStackTrace();
        }

        if (sair == false) {
            setExisteCadastro(emailExiste);
        } else if (sair == true) {
            emailExiste = "voltar";
            setExisteCadastro(emailExiste);
        }

        if (criarUser.getUserSalvo()) {
            cadastroSucedido = true;
            digitar.digitar("Cadastro bem sucedido!");
            //http.IpLogin(request, email.trim().toLowerCase(), "login", nome_primeiro);
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