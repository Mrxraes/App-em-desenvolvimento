package com.bruno.MyFinances.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.bruno.MyFinances.service.EnviarEmail;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class BuscarIP {

    private final EnviarEmail enviar;
    public BuscarIP (EnviarEmail enviar) {
        this.enviar = enviar;
    }
     
    private String dispositivo;
    private String ip;
    private String userAgent;


    @GetMapping("/login")
    public String IpLogin(HttpServletRequest request, String email, String cadasOuLogin, String nome) {
        //ip = request.getRemoteAddr();
        //userAgent = request.getHeader("User-Agent");
        ip = "Ip do usuario";
        userAgent = "dispositivo";
        if (userAgent.contains("Windows")) {
            dispositivo = "Windows";
        } else if (userAgent.contains("Android")) {
            dispositivo = "Android";
        } else if (userAgent.contains("Iphone")) {
            dispositivo = "Iphone";
        } else if (userAgent.contains("Linux")) {
            dispositivo = "Linux";
        } else {
            dispositivo = "Desconhecido";
        }


        enviar.enviarEntradaSucedida(email, cadasOuLogin, nome, dispositivo, ip);       

        return "OK";
    }

}
