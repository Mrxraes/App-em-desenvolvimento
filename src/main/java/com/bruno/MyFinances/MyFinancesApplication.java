package com.bruno.MyFinances;

import com.bruno.MyFinances.Controller.Cadastro;
import com.bruno.MyFinances.Controller.Login;
import com.bruno.MyFinances.service.Digitacao;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication // importa a funcionalidade do spring e declara aqui
public class MyFinancesApplication implements CommandLineRunner {

	private final Cadastro cadastro;
	private final Digitacao digitar;

	private final Login login;
	




	public MyFinancesApplication(Cadastro cadastroRecebido, Digitacao digitacaoRecebida, Login login) {
		this.cadastro = cadastroRecebido; // spring executa o construtor e responde onde fica a classe e atribui a essa constante os metodos que ele carreha
		this.digitar = digitacaoRecebida;
		this.login = login;
	
	}
	public static void main(String[] args) {
		SpringApplication.run(MyFinancesApplication.class, args); // cerebro do spring, ele captaliza todas as marcações
	}

	public boolean autenticacao;
	public boolean cadastroSucedido;
	public boolean loginSucedido;

	@Override 
	public void run(String... args) throws InterruptedException {

			String escolha;
			String decisao = null;
			digitar.digitar("Olá, seja bem vindo ao MyFinances!");
			digitar.digitar("Já possui uma conta conosco? Digite 1 ou 2.");
			digitar.digitar("|1 - Possuo, gostaria de fazer meu login. |");
			digitar.digitar("|2 - Ainda não, gostaria de fazer o cadastro. |");
			escolha = digitar.ler();
			decisao = escolha;
			
			
			while (autenticacao == false) {
				
				String emailExisteLogin;
				String emailExisteCadastro;
				if (decisao.equals("1")) {
				loginSucedido = login.questoesLogin();
				if (login.getIrCadas() == true) {
					decisao = "2";
					continue;
				}
			} 
				else if (decisao.equals("2")) {
				cadastroSucedido = cadastro.questoesCadastro();
				emailExisteCadastro = cadastro.getExisteCadastro();
				//System.out.println(emailExisteCadastro);
				   if (emailExisteCadastro.equals("1") && cadastroSucedido == false) {
			        digitar.digitar("Este email ja existe!");
			        digitar.digitar("Gostaria de fazer login?");
			        digitar.digitar("|1 - Sim, gostaria de fazer meu login. |");
			        digitar.digitar("|2 - Não, quero fazer outro cadastro. |");
			        escolha = digitar.ler();;
						if (escolha.equals("1")) {
							decisao = "1";
							continue;
						} else if (escolha.equals("2")) {
							continue;
					} 
				}
			}
				if (cadastroSucedido == true || loginSucedido == true) {
					autenticacao = true;
				}
		}

		
		
	}
}