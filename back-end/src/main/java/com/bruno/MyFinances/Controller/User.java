package com.bruno.MyFinances.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.UserRequest;
import com.bruno.MyFinances.dto.UserResponse;
import com.bruno.MyFinances.service.UserService;

import jakarta.mail.MessagingException;

import com.bruno.MyFinances.dto.AtualizarDadosRequest;
import com.bruno.MyFinances.dto.DadosPessoaisResponse;
import com.bruno.MyFinances.dto.DadosPessoaisResponseStatus;
import com.bruno.MyFinances.dto.EnviarCodigoAlteracaoRequest;
import com.bruno.MyFinances.dto.ValidarCodigoAlteracaoRequest;
import com.bruno.MyFinances.dto.DadosPessoaisRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class User {


    private final UserService userService;
    

    public User(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/getNameUser")
    public UserResponse getName(@RequestBody UserRequest request) {

        String nome = userService.getNomeUser(request.getToken());

        System.out.println(nome);

        return new UserResponse(nome);
    }

       //////////////////////////////
    // CARREGAR DADOS PESSOAIS
    //////////////////////////////
    /// 
    /// 
    @PostMapping("/dadosPessoais")
    public DadosPessoaisResponse carregarDadosPessoais(
            @RequestBody DadosPessoaisRequest request
    ) {

        System.out.println("Cheguei ");

        List<Object[]> dados = userService.carregarDadosPessoais(
                request.getToken()
        );

        if (dados == null || dados.isEmpty()) {
            throw new RuntimeException("Dados do usuário não encontrados.");
        }

        Object[] usuario = dados.get(0);

        return new DadosPessoaisResponse(
                (String) usuario[0],
                (String) usuario[1],
                (String) usuario[2],
                usuario[3] != null ? usuario[3].toString() : null,
                usuario[4] != null ? usuario[4].toString() : "0"
        );
    }

    //////////////////////////////
    // ENVIAR CÓDIGO
    //////////////////////////////

    
    @PostMapping("/enviarCodigoAlteracao")
    public DadosPessoaisResponseStatus enviarCodigoAlteracao(
            @RequestBody EnviarCodigoAlteracaoRequest request
    ) throws MessagingException {

        return userService.enviarCodigoAlteracao(
                request.getToken(),
                request.getCampo()
        );

    }

    //////////////////////////////
    // VALIDAR CÓDIGO
    //////////////////////////////

    @PostMapping("/validarCodigoAlteracao")
    public DadosPessoaisResponseStatus validarCodigoAlteracao(
            @RequestBody ValidarCodigoAlteracaoRequest request
    ) {

        return userService.validarCodigoAlteracao(
                request.getToken(),
                request.getCodigo(),
                request.getCampo()
        );

    }


    //////////////////////////////
    // ATUALIZAR DADOS
    //////////////////////////////

    @PostMapping("/atualizarDados")
    public DadosPessoaisResponseStatus atualizarDados(
            @RequestBody AtualizarDadosRequest request
    ) {

        return userService.atualizarDados(
                request.getToken(),
                request.getCampo(),
                request.getNovoValor(),
                request.getCodigo()
        );

    }
         
        //////////////////////////////
        // SOLICITAR ALTERAÇÃO DE SENHA
        //////////////////////////////

        @PostMapping("/solicitarAlteracaoSenha")
        public DadosPessoaisResponseStatus solicitarAlteracaoSenha(
                @RequestBody Map<String, String> request
        ) throws MessagingException {

                System.out.println("SOLICITAR");

        return userService.solicitarAlteracaoSenha(
                request.get("token"),
                request.get("senhaAtual"),
                request.get("novaSenha"),
                request.get("confirmarSenha")
        );
        }


        //////////////////////////////
        // CONFIRMAR ALTERAÇÃO DE SENHA
        //////////////////////////////

        @PostMapping("/confirmarAlteracaoSenha")
        public DadosPessoaisResponseStatus confirmarAlteracaoSenha(
                @RequestBody Map<String, String> request
        ) {

        System.out.println( request.get("novaSenha") + " NOVA SENHA");
        System.out.println( request.get("confirmarSenha") + " confirmarSenha");

                System.out.println("CONFIRMAR");
        

        return userService.confirmarAlteracaoSenha(
                request.get("token"),
                request.get("codigo"),
                request.get("novaSenha")
        );
        }

}


