package com.bruno.MyFinances.service;

import java.util.Scanner;

import org.springframework.stereotype.Service;

@Service
public class Digitacao {
	
	private final Scanner ler = new Scanner(System.in);
	
	
	public void loopDigitarTravessao(String texto, String texto1, int velocidade) throws InterruptedException {
		
		for (int i = 0; i < texto.length(); i++) {
			System.out.print(texto1);
			Thread.sleep(velocidade);
			
		}
		return;
	}
	
	public void loopDigitar(String texto, int velocidade)  throws InterruptedException {
		System.out.println(" ");
		for (int i = 0; i < texto.length(); i++) {
			System.out.print(texto.charAt(i));
			Thread.sleep(velocidade);
		
			
		}
		System.out.println(" ");
		return;
	}
	
	public void digitar(String texto) throws InterruptedException {
		String msg = texto;
		String travessao = "-";
		
		loopDigitarTravessao(msg, travessao, 5);
		loopDigitar(msg, 10);
		loopDigitarTravessao(msg, travessao, 5);
		System.out.println(" "); }

	public String ler() {
		return ler.nextLine();
	}
}
