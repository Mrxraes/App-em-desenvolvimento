package com.bruno.MyFinances.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.RedefinitionRequest;
import com.bruno.MyFinances.dto.RedefinitionResponse;
import com.bruno.MyFinances.dto.SenhasRequest;
import com.bruno.MyFinances.dto.SenhasResponse;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Token;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.EnviarEmail;
import com.bruno.MyFinances.service.Password;

@RestController
@RequestMapping("/api")
public class RedefinirSenha {

    private final Password redefinirSenha;
    private final Email validarEmail;
    private final EnviarEmail enviarEmail;
    private final UsuarioRepository repositorio;
    private final Token link;

    public RedefinirSenha(Password redefinirSenha, Email validarEmail, EnviarEmail enviarEmail, UsuarioRepository repositorio, Token link) {
        this.redefinirSenha = redefinirSenha;
        this.validarEmail = validarEmail;
        this.enviarEmail = enviarEmail;
        this.repositorio = repositorio;
        this.link = link;

    }
    
    @PostMapping("/redefinirSenha")
    public SenhasResponse redefinirSenha(@RequestBody SenhasRequest request, @RequestParam String token) {
        String mensagem;
        String senha1 = request.getSenha1();
        String senha2 = request.getSenha2();
        boolean sucessoRedefinir = redefinirSenha.redefinirSenha(token, senha1, senha2);
        mensagem = redefinirSenha.getMensagem();
     
        System.out.println("Mensagem: " + mensagem);
        System.out.println("Sucesso: " + sucessoRedefinir);

        // consultar senha atual do banco e dizer -- SENHA NAO PODE SER IGUAL

        return new SenhasResponse(mensagem, sucessoRedefinir);

        // PARA REDEFINIR UMA SENHA
        // 1- SENHAS DEVEM SER IGUAIS
        // 2 - SENHAS DEVEM TER A SINTAXE CORRETA
        // SE TUDO CERTO ALTERA NO BANCO E MANDA PRA LOGIN, SE NÃO RETORNA ERRO E MANTÉM NA PAG
    }

    
    private String mensagem;
    private boolean sucessoEnvio;
    private String emailFormatado;

    @PostMapping("/socilitarRedefinicao")
    public RedefinitionResponse solicitarRedefinicao(@RequestBody RedefinitionRequest request) throws InterruptedException {
        

        String email = request.getEmail();
        emailFormatado = email.trim().toLowerCase();

        validarEmail.validarEmail(emailFormatado);
        boolean condicaoEmail = validarEmail.getValida();

        String emailExiste = repositorio.existeEmail(emailFormatado);
        if (condicaoEmail == false) {
            mensagem = validarEmail.getMensagem();
            sucessoEnvio = false;
            // depois eu so quero mostrar se o e-mail sem a sintaxe certa, depois disso a msg sera "Se existir algum e-mail, vc receberá as instruções"
        } else if (emailExiste.equals("1") && condicaoEmail == true) {

            String primeiro_nome = repositorio.consultarNome(emailFormatado);
            String token = link.criarTokenRedefinirSenha(email);

            sucessoEnvio = enviarEmail.enviarEmailRecuperacaoSenha(emailFormatado, primeiro_nome, token);
            if (sucessoEnvio) {
                mensagem = "Envio de e-mail bem sucedido.";
            } else {
                mensagem = "Algo errado aconteceu no envio.";
            }
        }

        // salvar os dados que vou precisar depois pra fazer a API de redefinição de senha
        // verificar email pelo id
        // token é valido
        // update no 'usado' para tru 

        return new RedefinitionResponse(
            mensagem,
            sucessoEnvio
        );
}
}