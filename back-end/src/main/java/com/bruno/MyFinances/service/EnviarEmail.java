package com.bruno.MyFinances.service;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender; // conversa com o serviço SMTP --> Protocolo que transmita emails pela internet 
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;


@Service
public class EnviarEmail {

    private final JavaMailSender emailSender;

    public EnviarEmail(JavaMailSender estrutura) {
        this.emailSender = estrutura;
    }

    private SimpleMailMessage mensagem = new SimpleMailMessage();

    //
    //

    public void enviarEmailAutenticacao(String codigo, String email, String cadasOuLogin, String nome) {
        
        mensagem.setTo(email);
        mensagem.setSubject("Seu código de verificação");
        mensagem.setText("Olá, " + nome + ", aqui segue seu código de verificação do seu email para a conclusão do seu " + cadasOuLogin + ": " + codigo);
        mensagem.setFrom("My Finances <myfinancesdoisfatores@gmail.com>"); /*O spring ja preenche automaticamente entao o set from, ah nao ser que eu faça a autenticação no servidor de protocolo e use outro email para enviar email ou queria deixar o nome mais bonito*/
        this.emailSender.send(mensagem);
    }

    //
    //

    public void enviarEntradaSucedida(String email, String cadasOuLogin, String nome, String dispositivo, String ip) {
        
        // INFORMAÇÕES PARA EMAIL - DATA
        LocalDateTime agora = LocalDateTime.now();
        DateTimeFormatter formatarDate = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String dataFormatada = agora.format(formatarDate);
        //
        mensagem.setTo(email);
        mensagem.setSubject("Login realizado com sucesso no My Finances");
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
        this.emailSender.send(mensagem);
    }

    //
    //

    public boolean enviarEmailRecuperacaoSenha(String email, String nome, String link) {
        boolean envio;

        //            link = "myfinances://redefinir-senha?token=" + token;

        String linkHTML = "<a href=\"" + "http://192.168.15.6:8080/api/redirecionamentoRedefinition?token="+ link + "\">Redefinir Senha</a>" ;
        try {

            MimeMessage mensagem = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Redefinição de senha | MyFinances");
            helper.setText(
            "Olá, " + nome + "!<br><br>" +
            "Recebemos uma solicitação para redefinir a senha da sua conta no MyFinances.<br><br>" +
                "Para criar uma nova senha, clique no botão abaixo: <br><br>" +
                linkHTML + "<br><br>" +
                "Por motivos de segurança, este link é temporário e poderá ser utilizado apenas uma vez.<br><br>" +
                "Se você não solicitou a redefinição de senha, pode ignorar este email. Sua senha atual permanecerá inalterada.<br><br>" +
            "Atenciosamente, <br>" +
            "Equipe My Finances 💰",
            true
            );
            helper.setFrom("My Finances <myfinancesdoisfatores@gmail.com>"); /*O spring ja preenche automaticamente entao o set from, ah nao ser que eu faça a autenticação no servidor de protocolo e use outro email para enviar email ou queria deixar o nome mais bonito*/
            envio = true;
        this.emailSender.send(mensagem);
        } catch (Exception e) {
            envio = false;
            e.printStackTrace();
        }
       return envio;
    }

    //
    //

    public boolean enviarEmailConfirmarEmail(String email, String nome, String token, String loginSucedido) {
        boolean envio;

        //            link = "myfinances://redefinir-senha?token=" + token;

        String linkHTML = "<a href=\"" + "http://192.168.15.6:8080/api/redirecionamentoConfirmMail?token="+ token + "&loginSucedido=" + loginSucedido + "\">Confirmar E-mail</a>" ;
        try {

            MimeMessage mensagem = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Confirmar E-mail | MyFinances");
            helper.setText(
            "Olá " + nome + "!<br><br>" +
            "Recebemos uma solicitação para confirmar a sua conta no MyFinances.<br><br>" +
                "Para criar se tornar um usuário dos nossos serviços, clique no link abaixo: <br><br>" +
                linkHTML + "<br><br>" +
                "Por motivos de segurança, este link é temporário e poderá ser utilizado apenas uma vez.<br><br>" +
                "Se você não está tentando criar uma conta no MyFinances, pode ignorar este email. Nenhuma informação corre risco.<br><br>" +
            "Atenciosamente, <br>" +
            "Equipe My Finances 💰",
            true
            );
            helper.setFrom("My Finances <myfinancesdoisfatores@gmail.com>"); /*O spring ja preenche automaticamente entao o set from, ah nao ser que eu faça a autenticação no servidor de protocolo e use outro email para enviar email ou queria deixar o nome mais bonito*/
            envio = true;
        this.emailSender.send(mensagem);
        } catch (Exception e) {
            envio = false;
            e.printStackTrace();
        }
       return envio;
    }

}


