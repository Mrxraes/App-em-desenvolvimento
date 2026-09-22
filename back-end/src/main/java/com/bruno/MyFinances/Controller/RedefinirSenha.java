package com.bruno.MyFinances.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.SenhasRequest;
import com.bruno.MyFinances.dto.SenhasResponse;
import com.bruno.MyFinances.service.Password;

@RestController
@RequestMapping("/api")
public class RedefinirSenha {

    private final Password redefinirSenha;

    public RedefinirSenha(Password redefinirSenha) {
        this.redefinirSenha = redefinirSenha;
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
}
