package com.bruno.MyFinances.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender; // conversa com o serviço SMTP --> Protocolo que transmita emails pela internet 
import org.springframework.stereotype.Service;

import com.bruno.MyFinances.repository.UsuarioRepository;

@Service
public class EmailAutenticacao {

    private final JavaMailSender email;
   

    public EmailAutenticacao(JavaMailSender estrutura) {
        this.email = estrutura;
    }

    public void enviarEmailAutenticacao(String codigo, String email, String cadasOuLogin, String nome) {
        
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(email);
        mensagem.setSubject("Seu código de verificação");
        mensagem.setText("Olá " + nome + ", aqui segue seu código para a verificação do seu email para a conclusão do seu " + cadasOuLogin + ": " + codigo);
        mensagem.setFrom("My Finances <myfinancesdoisfatores@gmail.com2>"); /*O spring ja preenche automaticamente entao o set from, ah nao ser que eu faça a autenticação no servidor de protocolo e use outro email para enviar email ou queria deixar o nome mais bonito*/
        this.email.send(mensagem);
    }
}
