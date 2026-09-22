package com.bruno.MyFinances.Controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bruno.MyFinances.dto.ConfirmarCadastroRequest;
import com.bruno.MyFinances.repository.TokenConfirmarEmailRepository;
import com.bruno.MyFinances.repository.TokenRedefinirSenhaRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.CriarToken;
import com.bruno.MyFinances.service.Email;

/**
 * RedirecionamentoRedefinicao
 */
@Controller
@RequestMapping("/api")
public class RedirecionamentoRedefinicao {

    private final TokenRedefinirSenhaRepository TokenRepositorio;
    private final Email getEmail;
    private final UsuarioRepository UsuarioRepositorio;
    private final TokenConfirmarEmailRepository tokenCE;

    public RedirecionamentoRedefinicao(TokenRedefinirSenhaRepository Token, Email getEmail,  UsuarioRepository UsuarioRepositorio , TokenConfirmarEmailRepository tokenCE) {
        this.TokenRepositorio = Token;
        this.getEmail = getEmail;
        this.UsuarioRepositorio = UsuarioRepositorio;
        this.tokenCE = tokenCE;
    }

    @GetMapping("/redirecionamentoRedefinition")
    public String redirecionamentoRedefinition(@RequestParam String token) {
        System.out.println("Agora é so criar validação e redirecionamento correto");
        LocalDateTime agora = LocalDateTime.now();

        // link = "myfinances://redefinir-senha?token=" + token;
        Long idEmail = UsuarioRepositorio.pegarId(getEmail.getEmailExiste());

        String tokenBd = TokenRepositorio.getToken(token);
        boolean tokenUsado = TokenRepositorio.getUsado(token);
        Long id = TokenRepositorio.getId(idEmail);
        LocalDateTime dateTimeBd = TokenRepositorio.getDate(token);

        if (!token.equals(tokenBd)) {   
            return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Token%20nao%20corresponde";
        } else if (!agora.isBefore(dateTimeBd) || tokenUsado == true) {
            return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Token%20expirado";
        } else if (token.equals(tokenBd) && agora.isBefore(dateTimeBd) && idEmail == id && tokenUsado == false) {
            return "redirect:exp://192.168.15.6:8081/--/redefinir-senha?token=" + token;
        }
        else {
            return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Algo%20inesperado%20aconteceu";
        }
    }

    
    @GetMapping("/redirecionamentoConfirmMail")
    public String redirecionamentoConfirmMail(@RequestParam String token, @RequestParam String loginSucedido) {
        System.out.println("Agora é so criar validação e redirecionamento correto");
        LocalDateTime agora = LocalDateTime.now();

        Long idEmail = UsuarioRepositorio.pegarId(getEmail.getEmail());
        

        String tokenBdCe = tokenCE.getToken(token);
        boolean tokenUsadoCE = tokenCE.getUsado(token);
        Long idCE = tokenCE.getId(idEmail);
        LocalDateTime dateTimeCE = tokenCE.getDate(token);

        if (!token.equals(tokenBdCe)) {   
            return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Token%20nao%20corresponde";
        } else if (!agora.isBefore(dateTimeCE) || tokenUsadoCE == true) {
            return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Token%20expirado";
        } else if (token.equals(tokenBdCe) && agora.isBefore(dateTimeCE) && idEmail == idCE && tokenUsadoCE == false) {
            if (loginSucedido.equals("true")) {
                try {
                    tokenCE.usadoTrue(token);
                    UsuarioRepositorio.usuarioAtivo(idEmail);
                    return "redirect:exp://192.168.15.6:8081/--/(tabs)";
                } catch (Exception e) {
                    e.printStackTrace(); 
                    System.out.println("Não foi possível tornar" + getEmail.getEmail() + "ativo");
                    return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Algo%20inesperado%20aconteceu";
                } 
            } else {
                try {
                tokenCE.usadoTrue(token);
                UsuarioRepositorio.usuarioAtivo(idEmail);
                return "redirect:exp://192.168.15.6:8081/--/login?sucessoCadastro=true";
                } catch (Exception e) {
                    e.printStackTrace(); 
                    System.out.println("Não foi possível tornar" + getEmail.getEmail() + "ativo");
                    return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Algo%20inesperado%20aconteceu";
                }
            }
          
        } 
        else {
            return "redirect:exp://192.168.15.6:8081/--/login?mensagemErro=Algo%20inesperado%20aconteceu";
        }
    }
}