package com.bruno.MyFinances;

import com.bruno.MyFinances.Controller.Cadastro;
import com.bruno.MyFinances.Controller.EntradaControl;
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
	private final EntradaControl entrada;
	private final UsuarioRepository repositorio;
	private final Email email;

	
	public MyFinancesApplication(Cadastro cadastroRecebido, Digitacao digitacaoRecebida, Login login, SaidaControl saida, UsuarioRepository repositorio, Email email, EntradaControl entrada) {
		this.cadastro = cadastroRecebido; // spring executa o construtor e responde onde fica a classe e atribui a essa constante os metodos que ele carreha
		this.digitar = digitacaoRecebida;
		this.login = login;
		this.saida = saida;
		this.repositorio = repositorio;
		this.email = email;
		this.entrada = entrada;
	
	}
	public static void main(String[] args) {
		SpringApplication.run(MyFinancesApplication.class, args); // cerebro do spring, ele captaliza todas as marcações
	}

	public boolean cadastroSucedido;
	public boolean loginSucedido;
	public boolean autenticacao = true;
	public String id;
	public boolean menuInicio = false;
	public boolean sair = false;


	@Override 
	public void run(String... args) throws InterruptedException {
			while (true) {
				String escolha;
				String decisao = null;
					while (menuInicio == true) {
						digitar.digitar("Olá, seja bem vindo ao MyFinances!");
						digitar.digitar("Já possui uma conta conosco? Digite 1 ou 2.");
						digitar.digitar("| 1 - Possuo, gostaria de fazer meu login. |");
						digitar.digitar("| 2 - Ainda não, gostaria de fazer o cadastro. |");
						escolha = digitar.ler().trim();
						decisao = escolha;
							if (decisao.equals("1")) {
								menuInicio = false;
								login.setIrCadas(false);
								break;
							} else if (decisao.equals("2")) {
								menuInicio = false;
								break;
							} else {
								digitar.digitar("| OPÇÃO INVÁLIDA |");
							}					
					}

					while (autenticacao == false && menuInicio == false) {
						String emailExisteCadastro;
							if (decisao.equals("1")) {
								loginSucedido = login.questoesLogin();
								boolean irCadastro = login.getIrCadas();
									if (irCadastro) {
										decisao = "2";
										continue;
									}
							} 
							else if (decisao.equals("2")) {
								cadastroSucedido = cadastro.questoesCadastro();
								emailExisteCadastro = cadastro.getExisteCadastro();
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
									} else if (emailExisteCadastro.equalsIgnoreCase("voltar")) {
										menuInicio = true;
										System.out.println(menuInicio);
										continue;
									} else {
										continue;
										
									}
							}
							if (loginSucedido == true) {
								autenticacao = true;
								break;
							}
							
					}

					if (menuInicio == true) {
							continue;
						}
				
					while (sair == false) {
						if (autenticacao == true) {
							digitar.digitar("| INTERFACE |");
							digitar.digitar("| 1 - Saidas |");
							digitar.digitar("| 2 - Entradas |");
							digitar.digitar("| 3 - Sair |");

							String opcao = digitar.ler().toLowerCase().trim();
							switch (opcao) {
								case "1":
									saida.saidas();
									break;
								case "saida":
									saida.saidas();
									break;
								case "saída":
									saida.saidas();
									break;
								case "2":
									entrada.entradas();
									break;
								case "entrada":
									entrada.entradas();
									break;
								case "3":
									sair = true;
									digitar.digitar("| Encerrando o programa. |");
									break;
								case "sair":
									sair = true;
									digitar.digitar("| Encerrando o programa. |");
									break;
							}
						} else {

						}

			}
		}
	}
}