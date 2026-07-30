package com.bruno.MyFinances.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bruno.MyFinances.repository.UsuarioRepository;
/**
 * PasswordCripto
 */
@Service
public class PasswordCripto {

    private final UsuarioRepository metodos;

    public PasswordCripto(UsuarioRepository metRecebidos) {
        metodos = metRecebidos;
    }

    public PasswordEncoder criptografiaSenha() {
        return new BCryptPasswordEncoder();
    }


    public boolean macthSenha(String senha, String email) {
        
        boolean senhaMatch = false;
        String senhaHashBanco =  metodos.consultarSenha(email);
        if (BCrypt.checkpw(senha, senhaHashBanco)) {
                senhaMatch = true;
                //System.out.println("Tudo certo!");
        } else {
            System.out.println("Senha incorreta.");
        }
        return senhaMatch;
    }    
}
