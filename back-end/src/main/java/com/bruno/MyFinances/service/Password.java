    package com.bruno.MyFinances.service;
    import java.util.Scanner;

    import org.springframework.stereotype.Service;
    
    import com.bruno.MyFinances.repository.UsuarioRepository;

    @Service
    public class Password {
        public Scanner ler = new Scanner(System.in);

        private final Digitacao digitar;
        private final Email email;
        private final UsuarioRepository repositorio;
        private final PasswordCripto criptografarSenha;

        public Password(Digitacao digitacaoRecebida, Email email, UsuarioRepository repositorio, PasswordCripto criptografarSenha) {
            this.digitar = digitacaoRecebida;
            this.email = email;
            this.repositorio = repositorio;
            this.criptografarSenha = criptografarSenha;
        }

        /*public static void confirmarSenha(String senha, String senhaConfirm) throws InterruptedException {
            
            }

        public static void validarTam(String senha, String senhaConfirm) throws InterruptedException {
        
        } */

        public boolean validaSenha(String senha, String senhaConfirm) throws InterruptedException {
            boolean maiuscula = false;
            boolean minuscula = false;
            boolean especial = false;
            boolean algarismo = false;
            boolean espaco = false;
            boolean valida = true;

            if (!senha.equals(senhaConfirm)) {
                digitar.digitar("As senhas não coincidem.");
                valida = false;
            }
            if (senha.length() < 8 || senha.length() > 64) {
                digitar.digitar("A senha deve ter no minímo 8 caracteres e no máximo 64.");
                valida = false;
            }

            for (char c : senha.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    maiuscula = true;
                } else if (Character.isLowerCase(c)) {
                    minuscula = true;
                } else if (Character.isDigit(c)) {
                    algarismo = true;
                } else if (Character.isWhitespace(c)) {
                    espaco = true;   
                } else {
                    especial = true;
                }
            }

            if (maiuscula == false || minuscula == false || algarismo == false || especial == false || espaco == true) {
                digitar.digitar("A senha deve conter ao menos 1 caractere maiúsculo, 1 caractere minúsuculo, 1 número e 1 especial. Não pode haver espaços.");
                valida = false;
            }
            return valida;
        }

        public boolean validaSenha(String senha) throws InterruptedException {
            boolean maiuscula = false;
            boolean minuscula = false;
            boolean especial = false;
            boolean algarismo = false;
            boolean espaco = false;
            boolean valida = true;

            if (senha.length() < 8 || senha.length() > 64) {
                digitar.digitar("A senha deve ter no minímo 8 caracteres e no máximo 64.");
                valida = false;
            }

            for (char c : senha.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    maiuscula = true;
                } else if (Character.isLowerCase(c)) {
                    minuscula = true;
                } else if (Character.isDigit(c)) {
                    algarismo = true;
                } else if (Character.isWhitespace(c)) {
                    espaco = true;   
                } else {
                    especial = true;
                }
            }

            if (maiuscula == false || minuscula == false || algarismo == false || especial == false || espaco == true) {
                digitar.digitar("A senha deve conter ao menos 1 caractere maiúsculo, 1 caractere minúsuculo, 1 número e 1 especial. Não pode haver espaços.");
                valida = false;
            }
            return valida;
        }

        private String senha1;
        private String senha2;

        public boolean redefinirSenha(String email, String nome) throws InterruptedException {
            boolean redefinicaoSucedida = false;
            boolean valido = this.email.emailAutenticacao(email, "restabelecimento", nome);  
            digitar.digitar("Se existir uma conta associada a este e-mail, enviaremos as instruções de recuperação."); 
            if (valido == true) {
                digitar.digitar("| Altere a sua senha: |");
                boolean senhaCorreta = false;
                
                    while (senhaCorreta == false) {
                    digiteSenha();
                    senhaCorreta = validaSenha(senha1, senha2);   
                    }
                if (senhaCorreta = true) {
                    String senhaHash = criptografarSenha.criptografiaSenha().encode(senha1);
                    int mudou = repositorio.mudarSenha(email, senhaHash);
                    if (mudou == 1) {
                        redefinicaoSucedida = true;
                    }
                }
            }

        return redefinicaoSucedida;
    }

    public void digiteSenha() throws InterruptedException 
    {
        digitar.digitar("Digite a sua senha: "); 
        senha1 = digitar.ler().trim();
        digitar.digitar("Confirme a sua senha: "); 
        senha2 = digitar.ler().trim();
    }
}