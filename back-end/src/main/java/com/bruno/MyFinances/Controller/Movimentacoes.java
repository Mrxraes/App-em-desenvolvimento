package com.bruno.MyFinances.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.MovimentacaoRequest;
import com.bruno.MyFinances.dto.MovimentacaoResponse;
import com.bruno.MyFinances.dto.TodasMovimentacoesResponse;
import com.bruno.MyFinances.service.MovimentacoesService;

@RestController
@RequestMapping("/api")
public class Movimentacoes {

    private final MovimentacoesService moveService;

    public Movimentacoes(MovimentacoesService moveService) {
        this.moveService = moveService;
    }

    @PostMapping("/quatroMovimentacoes")
    public List<MovimentacaoResponse> fourMove(@RequestBody MovimentacaoRequest request) {


        String token = request.getToken();
        LocalDateTime data = request.getData();
        return moveService.quatroMove(token, data);
    }

    @PostMapping("/allMovimentacoes")
    public List<TodasMovimentacoesResponse> allMove(@RequestBody MovimentacaoRequest request) {

        String token = request.getToken();
        LocalDateTime data = request.getData();
        return moveService.buscarTodasMovimentacoes(token, data);
    }
}
