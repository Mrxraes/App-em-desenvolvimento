package com.bruno.MyFinances.Controller;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.ConfirmarCadastroRequest;
import com.bruno.MyFinances.dto.ConfirmarCadastroResponse;
import com.bruno.MyFinances.dto.RedefinitionRequest;
import com.bruno.MyFinances.dto.RedefinitionResponse;
import com.bruno.MyFinances.models.TokenRedefinirSenha;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.CriarToken;
import com.bruno.MyFinances.service.Email;
import com.bruno.MyFinances.service.EnviarEmail;

@RestController
@RequestMapping("/api")
public class ConfirmacoesTokens {

    private final Email validarEmail;
    private final EnviarEmail enviarEmail;
    private final UsuarioRepository repositorio;
    private final CriarToken link;

    public ConfirmacoesTokens(Email validarEmail,  UsuarioRepository repositorio, EnviarEmail enviarEmail, CriarToken link) {
        this.validarEmail = validarEmail; 
        this.repositorio = repositorio;
        this.enviarEmail = enviarEmail;
        this.link = link;
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

     @PostMapping("/confirmarCadastro")
    public ConfirmarCadastroResponse confirmarCadastro(@RequestBody ConfirmarCadastroRequest request) throws InterruptedException {
        

        String email = request.getEmail();
        String loginSucedido = request.getLoginSucedido();

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
            String token = link.criarTokenConfirmarCadastro(email);

            sucessoEnvio = enviarEmail.enviarEmailConfirmarEmail(emailFormatado, primeiro_nome, token, loginSucedido);
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

        return new ConfirmarCadastroResponse(
            mensagem,
            sucessoEnvio
        );
    }

}
