package com.bruno.MyFinances.Controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.ValidationRequest;
import com.bruno.MyFinances.dto.ValidationResponse;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Codigo;
import com.bruno.MyFinances.service.EnviarEmail;

@RestController
@RequestMapping("/api")
public class Autenticacao {
    
    private final Codigo cod;
    private final Login loginDados;
    private final UsuarioRepository repositorio;
    private final EnviarEmail enviarEmail;

    public Autenticacao(Codigo cod, Login loginDados, UsuarioRepository repositorio, EnviarEmail enviarEmail) {
        this.cod = cod;
        this.loginDados = loginDados;
        this.repositorio = repositorio;
        this.enviarEmail = enviarEmail;
    }
    
    private String mensagem;
    private boolean loginSucedido;
    
    @PostMapping("/validarEmail")
    public ValidationResponse validarEmail(@RequestBody ValidationRequest request) throws InterruptedException {
        String codigoInput = request.getCodigo();
        LocalDateTime criado = loginDados.getCodeHora();
        cod.verificarCod(codigoInput, criado);
        loginSucedido = cod.getLoginSucedido();
        mensagem = cod.getMensagem();
        return new ValidationResponse(loginSucedido, mensagem);
    } 

    @PostMapping("/enviarEmailAutenticacao")
    public void enviarEmail() {
        repositorio.excluirCod();
        String emailFormatado = loginDados.getEmailFormatado();
        String emailExiste = loginDados.getEmailLogin();
        Boolean senhaIguais = loginDados.getSenhasIguais();
        if (emailExiste.equals("1") && senhaIguais == true) {
            String primeiro_nome = repositorio.consultarNome(emailFormatado);
            String codigo = cod.criarCod();
            LocalDateTime criadoHora = LocalDateTime.now();
            repositorio.inserirCod(codigo, criadoHora.toLocalDate());
            System.out.println(criadoHora);
            loginDados.setCodeHora(criadoHora); 
            enviarEmail.enviarEmailAutenticacao(codigo, emailFormatado, "login", primeiro_nome);
        } else {
            System.out.println("Algo fora dos padrões aconteceu.");
        }
    }
}
