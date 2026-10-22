package com.bruno.MyFinances.service;

import org.springframework.stereotype.Service;

import com.bruno.MyFinances.repository.TokenLoginRepository;
import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class UserService {

    private final TokenLoginRepository tokenLoginRepository;
    private final UsuarioRepository usuarioRepository;

    public UserService( TokenLoginRepository tokenLoginRepository,  UsuarioRepository usuarioRepository) {
       this.tokenLoginRepository = tokenLoginRepository;
       this.usuarioRepository = usuarioRepository;

    }

    public String getNomeUser(String token) {

        Long id = tokenLoginRepository.getId(token);

        String nome = usuarioRepository.getName(id);

        return nome;

    }
}
