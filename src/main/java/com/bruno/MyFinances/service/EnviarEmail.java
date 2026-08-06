package com.bruno.MyFinances.service;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender; // conversa com o serviço SMTP --> Protocolo que transmita emails pela internet 
import org.springframework.stereotype.Service;


@Service
public class EnviarEmail {

    private final JavaMailSender email;

    public EnviarEmail(JavaMailSender estrutura) {
        this.email = estrutura;
    }

    private SimpleMailMessage mensagem = new SimpleMailMessage();


    public void enviarEmailAutenticacao(String codigo, String email, String cadasOuLogin, String nome) {
        
        mensagem.setTo(email);
        mensagem.setSubject("Seu código de verificação");
        mensagem.setText("Olá " + nome + ", aqui segue seu código de verificação do seu email para a conclusão do seu " + cadasOuLogin + ": " + codigo);
        mensagem.setFrom("My Finances <myfinancesdoisfatores@gmail.com2>"); /*O spring ja preenche automaticamente entao o set from, ah nao ser que eu faça a autenticação no servidor de protocolo e use outro email para enviar email ou queria deixar o nome mais bonito*/
        this.email.send(mensagem);
    }

     public void enviarEntradaSucedida(String email, String cadasOuLogin, String nome, String dispositivo, String ip) {
        
        // INFORMAÇÕES PARA EMAIL - DATA
        LocalDateTime agora = LocalDateTime.now();
        DateTimeFormatter formatarDate = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String dataFormatada = agora.format(formatarDate);
        //
        mensagem.setTo(email);
        mensagem.setSubject(cadasOuLogin + "realizado com sucesso no My Finances");
        mensagem.setText(
        "Olá, " + nome + "! Informamos que o acesso à sua conta no My Finances foi realizado com sucesso.\n\n" +
        "Caso tenha sido você, nenhuma ação adicional é necessária. Agora você pode acessar sua plataforma e gerenciar suas finanças com segurança.\n\n" +
        "Data e horário: " + dataFormatada + "\n" +
        "Dispositivo: " + dispositivo + "\n" +
        "Endereço IP: " + ip + "\n\n" +
        "Se você não reconhece esse acesso, recomendamos que altere sua senha imediatamente e entre em contato com nossa equipe de suporte.\n\n" +
        "Agradecemos por utilizar o My Finances.\n\n" +
        "Atenciosamente,\n" +
        "Equipe My Finances 💰"
        );
        mensagem.setFrom("My Finances <myfinancesdoisfatores@gmail.com2>"); /*O spring ja preenche automaticamente entao o set from, ah nao ser que eu faça a autenticação no servidor de protocolo e use outro email para enviar email ou queria deixar o nome mais bonito*/
        this.email.send(mensagem);
    }
}
