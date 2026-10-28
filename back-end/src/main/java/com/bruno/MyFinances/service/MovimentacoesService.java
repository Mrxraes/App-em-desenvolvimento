package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bruno.MyFinances.dto.AlterarMovimentacaoRequest;
import com.bruno.MyFinances.dto.MovimentacaoResponse;
import com.bruno.MyFinances.dto.OperacaoMovimentacaoResponse;
import com.bruno.MyFinances.dto.RemoverMovimentacaoRequest;
import com.bruno.MyFinances.dto.TodasMovimentacoesResponse;
import com.bruno.MyFinances.repository.MovimentacoesRepository;
import com.bruno.MyFinances.repository.TokenLoginRepository;

@Service
public class MovimentacoesService {

    private final MovimentacoesRepository repositorioMove;
    private final TokenLoginRepository tokenLoginRepositorio;

    private static final Set<String> TIPOS_ENTRADA =
            Set.of("SALARIO", "EXTRA", "RENDIMENTO", "RENDIMENTOS");

    private static final Set<String> TIPOS_SAIDA =
            Set.of(
                    "FIXO", "FIXA",
                    "VARIAVEL",
                    "INVESTIMENTO", "INVESTIMENTOS"
            );

    public MovimentacoesService(
            MovimentacoesRepository repositorioMove,
            TokenLoginRepository tokenLoginRepositorio
    ) {
        this.repositorioMove = repositorioMove;
        this.tokenLoginRepositorio = tokenLoginRepositorio;
    }

    public List<MovimentacaoResponse> quatroMove(
            String token,
            LocalDateTime data
    ) {
        Long id = tokenLoginRepositorio.getId(token);

        List<Object[]> resultado =
                repositorioMove.buscarUltimasMovimentacoes(id, data);

        List<MovimentacaoResponse> movimentacoes = new ArrayList<>();

        for (Object[] dados : resultado) {
            movimentacoes.add(
                    new MovimentacaoResponse(
                            String.valueOf(dados[0]),
                            String.valueOf(dados[1]),
                            String.valueOf(dados[2]),
                            String.valueOf(dados[3])
                    )
            );
        }

        return movimentacoes;
    }

    public List<TodasMovimentacoesResponse> buscarTodasMovimentacoes(
            String token,
            LocalDateTime data
    ) {
        Long idUsuario = tokenLoginRepositorio.getId(token);

        List<Object[]> resultado =
                repositorioMove.buscarTodasMovimentacoes(idUsuario, data);

        List<TodasMovimentacoesResponse> movimentacoes =
                new ArrayList<>();

        for (Object[] movimento : resultado) {
            Long id = ((Number) movimento[0]).longValue();

            String nome = String.valueOf(movimento[1]);
            String dataRegistro = String.valueOf(movimento[2]);
            String valor = String.valueOf(movimento[3]);
            String tipo = String.valueOf(movimento[4]);
            String tabela = String.valueOf(movimento[5]);

            String obs = movimento[6] == null
                    ? null
                    : String.valueOf(movimento[6]);

            movimentacoes.add(
                    new TodasMovimentacoesResponse(
                            id,
                            nome,
                            dataRegistro,
                            valor,
                            tipo,
                            tabela,
                            obs
                    )
            );
        }

        return movimentacoes;
    }

    @Transactional
    public OperacaoMovimentacaoResponse removerMovimentacao(
            RemoverMovimentacaoRequest request
    ) {
        try {
            if (!dadosOriginaisValidos(request)) {
                return falha("Os dados da movimentação são inválidos.");
            }

            Long idUsuario =
                    tokenLoginRepositorio.getId(request.getToken());

            String tabela = normalizarTabela(request.getTabela());

            int linhasAfetadas;

            if ("entrada".equals(tabela)) {
                linhasAfetadas = repositorioMove.removerEntrada(
                        request.getId(),
                        idUsuario,
                        request.getNomeOriginal(),
                        request.getTipoOriginal(),
                        request.getValorOriginal(),
                        request.getDataRegistroOriginal(),
                        request.getObsOriginal()
                );
            } else if ("saida".equals(tabela)) {
                linhasAfetadas = repositorioMove.removerSaida(
                        request.getId(),
                        idUsuario,
                        request.getNomeOriginal(),
                        request.getTipoOriginal(),
                        request.getValorOriginal(),
                        request.getDataRegistroOriginal(),
                        request.getObsOriginal()
                );
            } else {
                return falha("Tipo de movimentação inválido.");
            }

            if (linhasAfetadas != 1) {
                return falha(
                        "A movimentação não foi encontrada ou seus dados foram alterados. Atualize a lista e tente novamente."
                );
            }

            return new OperacaoMovimentacaoResponse(
                    true,
                    "Movimentação excluída com sucesso."
            );

        } catch (RuntimeException e) {
            return falha(
                    "Não foi possível excluir a movimentação. Verifique sua sessão e tente novamente."
            );
        }
    }

    @Transactional
    public OperacaoMovimentacaoResponse alterarMovimentacao(
            AlterarMovimentacaoRequest request
    ) {
        try {

        System.out.println(request.getNomeOriginal());
        System.out.println(request.getValorOriginal());
        System.out.println(request.getDataRegistroOriginal());
        System.out.println(request.getObsOriginal());
        System.out.println(request.getTabela());
        System.out.println(request.getTipoOriginal());
        System.out.println(request.getId());
        System.out.println(request.getNovoTipo());

            if (!dadosOriginaisValidos(request)) {
                return falha("Os dados originais são inválidos.");
            }

            if (!novosDadosValidos(request)) {
                return falha(
                        "Confira o nome, o valor, o tipo e a data informados."
                );
            }

            Long idUsuario =
                    tokenLoginRepositorio.getId(request.getToken());

            String tabela = normalizarTabela(request.getTabela());
            String novoTipo = normalizarTipo(request.getNovoTipo());

            int linhasAfetadas;

            if ("entrada".equals(tabela)) {
                if (!TIPOS_ENTRADA.contains(novoTipo)) {
                    return falha("Tipo de entrada inválido.");
                }

                linhasAfetadas = repositorioMove.alterarEntrada(
                        request.getId(),
                        idUsuario,
                        request.getNomeOriginal(),
                        request.getTipoOriginal(),
                        request.getValorOriginal(),
                        request.getDataRegistroOriginal(),
                        request.getObsOriginal(),
                        request.getNovoNome().trim(),
                        request.getNovoValor(),
                        novoTipo,
                        request.getNovaDataRegistro(),
                        request.getNovaObs()
                );

            } else if ("saida".equals(tabela)) {
                if (!TIPOS_SAIDA.contains(novoTipo)) {
                    return falha("Tipo de saída inválido.");
                }

                linhasAfetadas = repositorioMove.alterarSaida(
                        request.getId(),
                        idUsuario,
                        request.getNomeOriginal(),
                        request.getTipoOriginal(),
                        request.getValorOriginal(),
                        request.getDataRegistroOriginal(),
                        request.getObsOriginal(),
                        request.getNovoNome().trim(),
                        request.getNovoValor(),
                        novoTipo,
                        request.getNovaDataRegistro(),
                        request.getNovaObs()
                );

            } else {
                return falha("Tipo de movimentação inválido.");
            }

            if (linhasAfetadas != 1) {
                return falha(
                        "A movimentação não foi encontrada ou seus dados foram alterados. Atualize a lista e tente novamente."
                );
            }

            return new OperacaoMovimentacaoResponse(
                    true,
                    "Movimentação alterada com sucesso."
            );

        } catch (RuntimeException e) {
            return falha(
                    "Não foi possível alterar a movimentação. Verifique os dados e sua sessão."
            );
        }
    }

    private boolean dadosOriginaisValidos(
            RemoverMovimentacaoRequest request
    ) {
        return request != null
                && request.getToken() != null
                && !request.getToken().isBlank()
                && request.getTabela() != null
                && request.getId() != null
                && request.getId() > 0
                && request.getNomeOriginal() != null
                && !request.getNomeOriginal().isBlank()
                && request.getTipoOriginal() != null
                && request.getValorOriginal() != null
                && request.getValorOriginal().compareTo(BigDecimal.ZERO) > 0
                && request.getDataRegistroOriginal() != null;
    }

    private boolean dadosOriginaisValidos(
            AlterarMovimentacaoRequest request
    ) {
        return request != null
                && request.getToken() != null
                && !request.getToken().isBlank()
                && request.getTabela() != null
                && request.getId() != null
                && request.getId() > 0
                && request.getNomeOriginal() != null
                && !request.getNomeOriginal().isBlank()
                && request.getTipoOriginal() != null
                && request.getValorOriginal() != null
                && request.getValorOriginal().compareTo(BigDecimal.ZERO) > 0
                && request.getDataRegistroOriginal() != null;
    }

    private boolean novosDadosValidos(
            AlterarMovimentacaoRequest request
    ) {
        return request.getNovoNome() != null
                && !request.getNovoNome().isBlank()
                && request.getNovoNome().trim().length() <= 150
                && request.getNovoValor() != null
                && request.getNovoValor().compareTo(BigDecimal.ZERO) > 0
                && request.getNovoTipo() != null
                && !request.getNovoTipo().isBlank()
                && request.getNovaDataRegistro() != null;
    }

    private String normalizarTabela(String tabela) {
        return tabela == null
                ? ""
                : tabela.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizarTipo(String tipo) {
        return tipo == null
                ? ""
                : tipo.trim().toUpperCase(Locale.ROOT);
    }

    private OperacaoMovimentacaoResponse falha(String mensagem) {
        return new OperacaoMovimentacaoResponse(false, mensagem);
    }
}