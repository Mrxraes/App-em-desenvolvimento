package com.bruno.MyFinances.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

@Service
public class CriarCodigo {
    public String criarCod() {
    String[] alfabeto = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
    String[] algarismo = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"};

    String codigo = "";

    ArrayList<String> letras = new ArrayList<>();

    for (int i = 0; i <= 5; i++) {
        double alfOrAlg = Math.random() * 2;
        int numberAleatorioInt = (int)alfOrAlg;
        if (numberAleatorioInt == 0) {
            String letraAleatoria = alfabeto[(int) (Math.random() * 25)];
            letras.add(letraAleatoria);
        } else if (numberAleatorioInt == 1) {
              String numeroAleatorio = algarismo[(int) (Math.random() * 9)];
            letras.add(numeroAleatorio);
        }
        codigo += letras.get(i);
    }

    System.out.println(codigo);
    return codigo;
    }
}
