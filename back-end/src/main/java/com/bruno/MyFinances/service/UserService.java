package com.bruno.MyFinances.service;

// Imports Java
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

// Imports Spring
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Imports do projeto
import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

import jakarta.mail.MessagingException;

import com.bruno.MyFinances.dto.DadosPessoaisResponse;
import com.bruno.MyFinances.dto.DadosPessoaisResponseStatus;

// Criptografia
import org.springframework.security.crypto.bcrypt.BCrypt;


@Service
public class UserService {

    // =====================================================
    // DEPENDÊNCIAS
    // =====================================================

    private final TokenLoginRepository tokenLoginRepository;
    private final UsuarioRepository usuarioRepository;
    private final Codigo cod;
    private final EnviarEmail enviarEmail;
    private final Password password;


    // =====================================================
    // CONSTRUTOR
    // =====================================================

    public UserService(
            TokenLoginRepository tokenLoginRepository,
            UsuarioRepository usuarioRepository,
            Codigo cod,
            EnviarEmail enviarEmail,
            Password password
    ) {

        this.tokenLoginRepository = tokenLoginRepository;
        this.usuarioRepository = usuarioRepository;
        this.cod = cod;
        this.enviarEmail = enviarEmail;
        this.password = password;
    }


    // =====================================================
    // BUSCAR NOME DO USUÁRIO
    // =====================================================

    public String getNomeUser(String token) {

        Long idUser = tokenLoginRepository.getId(token);

        if (idUser == null) {
            return null;
        }

        return usuarioRepository.getName(idUser);
    }


    // =====================================================
    // CARREGAR DADOS PESSOAIS
    // =====================================================

    public List<Object[]> carregarDadosPessoais(String token) {

        Long idUser = tokenLoginRepository.getId(token);

        if (idUser == null) {
            return null;
        }

        return usuarioRepository.carregarDadosPessoais(idUser);
    }


    // =====================================================
    // ENVIAR CÓDIGO PARA ALTERAÇÃO DE DADOS PESSOAIS
    // =====================================================

    @Transactional
    public DadosPessoaisResponseStatus enviarCodigoAlteracao(
            String token,
            String campo
    ) throws MessagingException {

        Long idUser = tokenLoginRepository.getId(token);

        if (idUser == null) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Usuário não encontrado."
            );
        }

        // Verifica quais campos podem utilizar essa finalidade
        if (
            !campo.equals("nome") &&
            !campo.equals("sobrenome") &&
            !campo.equals("email") &&
            !campo.equals("data_nascimento")
        ) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Campo inválido para confirmação por código."
            );
        }

        // Gera o código de verificação
        String codigo = cod.criarCod();

        // Busca os dados necessários para enviar o e-mail
        String email = usuarioRepository.getEmail(idUser);
        String nome = usuarioRepository.getName(idUser);

        if (email == null || nome == null) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Não foi possível localizar os dados do usuário."
            );
        }

        // Converte o ID para BigInteger
        BigInteger idBigInteger = BigInteger.valueOf(idUser);

        // Define a finalidade do código
        String finalidade = "ALTERACAO_DADOS";

        // Registra o código no banco
        usuarioRepository.inserirCod(
                codigo,
                LocalDateTime.now(),
                idBigInteger,
                finalidade
        );

        // Envia o código por e-mail
        enviarEmail.enviarEmailAlteracao(
                codigo,
                email,
                campo,
                nome
        );

        return new DadosPessoaisResponseStatus(
                true,
                "Código enviado para seu e-mail."
        );
    }


    // =====================================================
    // VALIDAR CÓDIGO DE ALTERAÇÃO DE DADOS PESSOAIS
    // =====================================================

    @Transactional
    public DadosPessoaisResponseStatus validarCodigoAlteracao(
            String token,
            String codigo,
            String campo
    ) {

        Long idUser = tokenLoginRepository.getId(token);

        if (idUser == null) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Usuário não encontrado."
            );
        }

        String finalidade = "ALTERACAO_DADOS";

        // Verifica se o código pertence ao usuário e à finalidade
        int codigoValido = usuarioRepository.contarCodigoValido(
                idUser,
                codigo,
                finalidade
        );

        if (codigoValido == 0) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Código inválido ou expirado."
            );
        }

        // Marca o código como utilizado
        usuarioRepository.marcarCodigoComoUsado(
                idUser,
                codigo,
                finalidade
        );

        return new DadosPessoaisResponseStatus(
                true,
                "Código validado com sucesso."
        );
    }


    // =====================================================
    // ATUALIZAR DADOS PESSOAIS
    // =====================================================

    @Transactional
    public DadosPessoaisResponseStatus atualizarDados(
            String token,
            String campo,
            String novoValor,
            String codigo
    ) {

        Long idUser = tokenLoginRepository.getId(token);

        if (idUser == null) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Usuário não encontrado."
            );
        }

        if (novoValor == null || novoValor.trim().isEmpty()) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "O novo valor não pode estar vazio."
            );
        }

        int alteracao;

        // Cada campo utiliza seu próprio método SQL
        switch (campo) {

            case "nome":
                alteracao = usuarioRepository.atualizarNome(
                        idUser,
                        novoValor
                );
                break;

            case "sobrenome":
                alteracao = usuarioRepository.atualizarSobrenome(
                        idUser,
                        novoValor
                );
                break;

            case "email":
                alteracao = usuarioRepository.atualizarEmail(
                        idUser,
                        novoValor
                );
                break;

            case "data_nascimento":
                alteracao = usuarioRepository.atualizarDataNascimento(
                        idUser,
                        novoValor
                );
                break;

            case "salario":
                alteracao = usuarioRepository.atualizarSalario(
                        idUser,
                        novoValor
                );
                break;

            default:
                return new DadosPessoaisResponseStatus(
                        false,
                        "Campo inválido."
                );
        }

        if (alteracao != 1) {
            return new DadosPessoaisResponseStatus(
                    false,
                    "Não foi possível atualizar os dados."
            );
        }

        return new DadosPessoaisResponseStatus(
                true,
                "Dados atualizados com sucesso."
        );
    }


    // =====================================================
    // SOLICITAR ALTERAÇÃO DE SENHA
    // =====================================================

    @Transactional
public DadosPessoaisResponseStatus solicitarAlteracaoSenha(
        String token,
        String senhaAtual,
        String novaSenha,
        String confirmarSenha
) throws MessagingException {

    // 1. Recupera o ID do usuário pelo token
    Long idUser = tokenLoginRepository.getId(token);

    if (idUser == null) {
        return new DadosPessoaisResponseStatus(
                false,
                "Usuário não encontrado."
        );
    }

    // 2. Busca a senha atual no banco
    String senhaBanco = usuarioRepository.consultarSenhaPorId(idUser);

    if (senhaBanco == null) {
        return new DadosPessoaisResponseStatus(
                false,
                "Não foi possível consultar a senha atual."
        );
    }

    // 3. Valida a senha atual
    if (!BCrypt.checkpw(senhaAtual, senhaBanco)) {
        return new DadosPessoaisResponseStatus(
                false,
                "A senha atual está incorreta."
        );
    }

    // 4. Valida a nova senha e a confirmação
    boolean senhaValida;

    try {

        senhaValida = password.validaSenha(
                novaSenha,
                confirmarSenha
        );

    } catch (InterruptedException erro) {

        Thread.currentThread().interrupt();

        return new DadosPessoaisResponseStatus(
                false,
                "Erro ao validar a nova senha."
        );
    }

    if (!senhaValida) {
        return new DadosPessoaisResponseStatus(
                false,
                password.getMensagem()
        );
    }

    // 5. Verifica se a nova senha é diferente da atual
    if (BCrypt.checkpw(novaSenha, senhaBanco)) {
        return new DadosPessoaisResponseStatus(
                false,
                "A nova senha deve ser diferente da antiga."
        );
    }

    // 6. Busca o e-mail e o nome do usuário
    String email = usuarioRepository.getEmail(idUser);
    String nome = usuarioRepository.getName(idUser);

    // 7. Gera o código de confirmação
    String codigo = cod.criarCod();

    String finalidade = "ALTERACAO_SENHA";

    BigInteger idBigInteger = BigInteger.valueOf(idUser);

    // 8. Salva o código temporário
    usuarioRepository.inserirCod(
            codigo,
            LocalDateTime.now(),
            idBigInteger,
            finalidade
    );

    // 9. Envia o código por e-mail
    enviarEmail.enviarEmailAlteracao(
            codigo,
            email,
            finalidade,
            nome
    );

    return new DadosPessoaisResponseStatus(
            true,
            "Código de confirmação enviado para seu e-mail."
    );
}

@Transactional
public DadosPessoaisResponseStatus confirmarAlteracaoSenha(
        String token,
        String codigo,
        String novaSenha
) {

    // 1. Recupera o ID do usuário pelo token
    Long idUser = tokenLoginRepository.getId(token);

    if (idUser == null) {
        return new DadosPessoaisResponseStatus(
                false,
                "Usuário não encontrado."
        );
    }

    // 2. Define a finalidade do código
    String finalidade = "ALTERACAO_SENHA";

    // 3. Verifica se o código pertence ao usuário e é válido
    int codigoValido = usuarioRepository.contarCodigoValido(
            idUser,
            codigo,
            finalidade
    );

    if (codigoValido == 0) {
        return new DadosPessoaisResponseStatus(
                false,
                "Código inválido ou expirado."
        );
    }

    // 4. Criptografa a nova senha
    String senhaHash = BCrypt.hashpw(
            novaSenha,
            BCrypt.gensalt()
    );

    // 5. Atualiza a senha no banco
    int alteracao = usuarioRepository.atualizarSenha(
            idUser,
            senhaHash
    );

    if (alteracao != 1) {
        return new DadosPessoaisResponseStatus(
                false,
                "Não foi possível alterar a senha."
        );
    }

    // 6. Marca o código como utilizado
    usuarioRepository.marcarCodigoComoUsado(
            idUser,
            codigo,
            finalidade
    );

    return new DadosPessoaisResponseStatus(
            true,
            "Senha alterada com sucesso."
    );
}

}