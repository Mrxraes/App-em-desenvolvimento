package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.security.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.support.ManagedArray;
import org.springframework.stereotype.Service;

import com.bruno.MyFinances.dto.MovimentacaoRequest;
import com.bruno.MyFinances.dto.MovimentacaoResponse;
import com.bruno.MyFinances.dto.TodasMovimentacoesResponse;
import com.bruno.MyFinances.repository.MovimentacoesRepository;
import com.bruno.MyFinances.repository.TokenLoginRepository;

@Service
public class MovimentacoesService {
     
    private final MovimentacoesRepository repositorioMove;
    private final TokenLoginRepository tokenLoginRepositorio;

    public MovimentacoesService(MovimentacoesRepository repositorioMove, TokenLoginRepository tokenLoginRepositorio) {
        this.repositorioMove = repositorioMove;
        this.tokenLoginRepositorio = tokenLoginRepositorio;
    }

    public  List<MovimentacaoResponse> quatroMove(String token, LocalDateTime date) {


            Long id = tokenLoginRepositorio.getId(token);
    
            List<Object[]> movimentacoes  = repositorioMove.buscarUltimasMovimentacoes(id, date);

            List<MovimentacaoResponse> movimentacao = new ArrayList();
            
            for (Object[] dados : movimentacoes) {
                String data = String.valueOf(dados[0]);
                String valor = String.valueOf(dados[1]);
                String tipo = String.valueOf(dados[2]);
                String tabela = String.valueOf(dados[3]);

                System.out.println(data + " data");
                System.out.println(valor + " valor");
                System.out.println(tipo + " tipo");
                System.out.println(tabela + " tabela");

                movimentacao.add(new MovimentacaoResponse(
                    data, 
                    valor, 
                    tipo,
                    tabela
                )); 
            }
            return movimentacao;
        }

           
      
        public List<TodasMovimentacoesResponse> buscarTodasMovimentacoes(String token, LocalDateTime data) {

                    System.out.println("Começando o service.");


            Long idUsuario = tokenLoginRepositorio.getId(token);

            List<Object[]> resultado =
                    repositorioMove.buscarTodasMovimentacoes(idUsuario, data);

            List<TodasMovimentacoesResponse> movimentacoes = new ArrayList<>();

            for (Object[] movimento : resultado) {

                String nome = String.valueOf(movimento[0]);
                String dataRegistro = String.valueOf(movimento[1]);
                String valor = String.valueOf(movimento[2]);
                String tipo = String.valueOf(movimento[3]);
                String tabela = String.valueOf(movimento[4]);


                System.out.println(nome + " nome");
                System.out.println(dataRegistro + " dataRegistro");
                System.out.println(valor + " valor");
                System.out.println(tabela + " tabela");
                
                TodasMovimentacoesResponse objeto =
                        new TodasMovimentacoesResponse(
                                nome,
                                dataRegistro,
                                valor,
                                tipo,
                                tabela
                        );

                movimentacoes.add(objeto);
            }
            System.out.println("Terminando o service.");
            return movimentacoes;
        }


}
