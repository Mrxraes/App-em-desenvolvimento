package com.bruno.MyFinances;

import com.bruno.MyFinances.Controller.Cadastro;
import com.bruno.MyFinances.Controller.Login;
import com.bruno.MyFinances.Controller.SaidaControl;
import com.bruno.MyFinances.repository.UsuarioRepository;
import com.bruno.MyFinances.service.Digitacao;
import com.bruno.MyFinances.service.Email;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication // importa a funcionalidade do spring e declara aqui
public class MyFinancesApplication implements CommandLineRunner {

	private final Cadastro cadastro;
	private final Digitacao digitar;
	private final Login login;
	private final SaidaControl saida;
	private final UsuarioRepository repositorio;
	private final Email email;

	
	public MyFinancesApplication(Cadastro cadastroRecebido, Digitacao digitacaoRecebida, Login login, SaidaControl saida, UsuarioRepository repositorio, Email email) {
		this.cadastro = cadastroRecebido; // spring executa o construtor e responde onde fica a classe e atribui a essa constante os metodos que ele carreha
		this.digitar = digitacaoRecebida;
		this.login = login;
		this.saida = saida;
		this.repositorio = repositorio;
		this.email = email;
	
	}
	public static void main(String[] args) {
		SpringApplication.run(MyFinancesApplication.class, args); // cerebro do spring, ele captaliza todas as marcações
	}

	public boolean cadastroSucedido;
	public boolean loginSucedido;
	public boolean autenticacao;
	public String id;


	@Override 
	public void run(String... args) throws InterruptedException {

	boolean sair = false;

		while (sair == false) {
			if (autenticacao == true) {
				digitar.digitar("| INTERFACE |");
				digitar.digitar("| 1 - Registrar uma saída |");
				digitar.digitar("| 2 - Registrar uma entrada |");
				digitar.digitar("| 3 - Sair |");

				String opcao = digitar.ler().toLowerCase().trim();
				switch (opcao) {
					case "1":
						saida.saidas();;
						break;
					case "2":
						break;
					case "3":
						sair = true;
						digitar.digitar("| Encerrando o programa |");
						break;
				}
			} else {

			String escolha;
			String decisao = null;
			digitar.digitar("Olá, seja bem vindo ao MyFinances!");
			digitar.digitar("Já possui uma conta conosco? Digite 1 ou 2.");
			digitar.digitar("| 1 - Possuo, gostaria de fazer meu login. |");
			digitar.digitar("| 2 - Ainda não, gostaria de fazer o cadastro. |");
			escolha = digitar.ler().trim();
			decisao = escolha;
			
						System.out.println("voltei");

			while (true) {
				
				String emailExisteLogin;
				String emailExisteCadastro;
			if (decisao.equals("1")) 
			{
			loginSucedido = login.questoesLogin();
				if (login.getIrCadas() == true) {
					decisao = "2";
					continue;
				}
			} 
			else if (decisao.equals("2")) 
			{
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
				} else if (cadastroSucedido == true) {
					decisao = "1";
					continue;
				}
			}
					if (loginSucedido == true) {
					autenticacao = true;
					break;
					}
				}
			}
		}
	}
}