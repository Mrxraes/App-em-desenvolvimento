package com.bruno.MyFinances.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.bruno.MyFinances.models.Usuario;
import com.bruno.MyFinances.repository.UsuarioRepository;

import org.springframework.stereotype.Service;



@Service
public class CriarUsuario {

    public boolean salvo;

    private final UsuarioRepository repositorio;

    public CriarUsuario(UsuarioRepository repositorioRecebido) {
        this.repositorio = repositorioRecebido;
    }

    public void criarUser(String nomeComp, String email, String senha, BigDecimal salario, LocalDate dataNascimento) {
        Usuario criarUser = new Usuario(nomeComp, email, senha, salario, dataNascimento);
        try 
        {
            repositorio.save(criarUser);
            setUserSalvo(true);
        } 
        catch (Exception e) 
        {
            e.printStackTrace();
            setUserSalvo(false);
        }
    }

    public void setUserSalvo(boolean valor) {
        this.salvo = valor;
    }

    public boolean getUserSalvo() {
        return salvo;
    }

}