package com.bruno.MyFinances.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class Codigo {


    private final UsuarioRepository repositorio;
    private final Email emailService;

    public Codigo(UsuarioRepository repositorio, Email emailService) {
        this.repositorio = repositorio;
        this.emailService = emailService;
    }

    private  String codigo;

    public String criarCod() {

    String[] algarismo = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"};

    codigo = "";

    ArrayList<String> letras = new ArrayList<>();

    for (int i = 0; i <= 5; i++) {
        double alfOrAlg = Math.random() * 2;

    String numeroAleatorio = algarismo[(int) (Math.random() * 9)];
    letras.add(numeroAleatorio);
        
        codigo += letras.get(i);
    }
    //System.out.println(codigo);
    return codigo;
    }

    private boolean loginSucedido;
    private String mensagem;
    private boolean perfilAtivo;
    
        public void verificarCod(String code, LocalDateTime criado) {
            String codigoTable;
            String digitarCod = code;
            perfilAtivo = emailService.getAtivo();
            codigoTable =  repositorio.pegarCod(codigo, criado.toLocalDate());
            System.out.println("Codigo da tabela " + codigoTable);
            System.out.println("Codigo do request " + digitarCod);
            System.out.println("Tempo que foi criado " + criado);

                LocalDateTime agora = LocalDateTime.now();
                Duration tempo = Duration.between(criado, agora);

                if (digitarCod.equalsIgnoreCase(codigoTable)) {
                    if (tempo.toSeconds() <= 600) {
                        loginSucedido = true;
                        mensagem = "Login bem sucedido!";
                    }
                } else if (!digitarCod.equalsIgnoreCase(codigoTable)) {
                    loginSucedido = false;
                    mensagem = "Código inválido. Tente novamente! ";
                } else if (tempo.toSeconds() > 600) {
                    mensagem = "Código expirado!";
                }
                
                /*
                } else if (digitarCod.equals("ENVIAR") || codigoExpirado == true) {
                    //digitar.digitar("Um novo email com seu código foi enviado.");
                    codigo = criarCod.criarCod();
                    existe.inserirCod(codigo);
                    codigoTable =  existe.pegarCod(codigo);
                    enviarEmail.enviarEmailAutenticacao(codigoTable, email, cadsLogin, nome);
                    codigoExpirado = false;
                 */
            
                
                System.out.println(loginSucedido);
                System.out.println(mensagem);
                System.out.println(perfilAtivo);
            
            if (loginSucedido == true) {
                repositorio.excluirCod();
            }
            
    }

    public boolean getLoginSucedido() {
        return loginSucedido;
    }

    public String getMensagem() {
        return mensagem;
    }

    
    public boolean getPerfilAtivo() {
        return perfilAtivo;
    }
}
