// ====================== VALIDAÇÃO DE CPF ======================
// Remove tudo que não é número e verifica se tem 11 dígitos.
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); // remove pontos e traços
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // se não tiver exatamente 11 números OU for algo tipo 11111111111,já rejeita na hora.

  // Primeiro dígito verificador do CPF (algoritmo oficial).
  let soma = 0, resto;   // soma = acumulador, resto = resto da divisão
  // pega os 9 primeiros números e multiplica por 10, 9, 8, 7... (regra oficial da Receita)
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  // calcula o 1º dígito verificador. Se não bater com o 10º número do CPF → CPF FALSO
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Segundo dígito verificador. Se passar nos dois, retorna true.
  // agora faz a mesma conta pros 10 primeiros números (pra achar o 2º dígito)
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  // verifica o 2º dígito. Se bater nos dois → CPF VERDADEIRO
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

// ====================== MÁSCARAS ======================
// função que transforma 12345678901 em 123.456.789-01 automaticamente.
function mascarar(input, formato) {
  let valor = input.value.replace(/\D/g, ''); // remove tudo deixa só números
  let resultado = '';
  let j = 0;          //contador dos números que o usuário digitou
  //Percorre o formato ("000.000.000-00")
  for (let i = 0; i < formato.length && j < valor.length; i++) { 
    if (/\d/.test(formato[i])) {
      resultado += valor[j++]; // coloca o número do usuário
    } else {
      resultado += formato[i];  // coloca ponto, traço e parêntese
    }
  }
  input.value = resultado; // texto formatado de volta no campo
}

// ====================== ESPERA O HTML CARREGAR ======================
// só roda o código depois que a página carregou 100%.
// pega todos os elementos do HTML pra gente usar.
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formCadastro');
  const nome = document.getElementById('nome');
  const rg = document.getElementById('rg');
  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const toast = document.getElementById('toast');
  const feedback = document.getElementById('feedback');

  // === PULAR COM ENTER (NOVO!!!) ===
  const campos = [nome, rg, cpf, telefone, email, senha]; // lista com todos os campos na ordem certa
  campos.forEach((campo, index) => {                      // para cada campo na lista
    campo.addEventListener('keydown', function(e) {       // quando aperta uma tecla DENTRO desse campo
      if (e.key === 'Enter') {                            // se for enter não envia o formulário ainda
        e.preventDefault();
        if (index < campos.length - 1) {                  // se não for o último campo pula pro próximo
          campos[index + 1].focus();
        } else {
          document.querySelector('button[type="submit"]').click();  // se for o último (senha)clica automaticamente no botão CADASTRAR
        }
      }
    });
  });

  let timeoutId = null; // Variável pra controlar o tempo do toast.

  // === TOAST: Limite de 50 caracteres ===
  // quando digitar exatamente 50 letras, aparece o toast por 3 segundos.
  nome.addEventListener('input', function () {
    if (this.value.length > 50) {                     // se passar de 50,corta o excesso
      this.value = this.value.slice(0, 50);
    }

    if (this.value.length === 50) {                   // chegou em 50, mostra o toast por 3 segundos
      toast.classList.add('show');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
      clearTimeout(timeoutId);                        // se apagar esconde o toast
      toast.classList.remove('show');
    }
  });

  // === MÁSCARAS EM TEMPO REAL ===
  //toda vez que digita, aplica a máscara automaticamente.
  rg.addEventListener('input', () => mascarar(rg, '00.000.000-0'));
  cpf.addEventListener('input', () => mascarar(cpf, '000.000.000-00'));
  telefone.addEventListener('input', () => mascarar(telefone, '(00) 00000-0000'));

  // === CLIQUE NO TOAST ===
  // clicar no toast faz ele sumir.
  toast.addEventListener('click', () => toast.classList.remove('show'));

  // === VALIDAÇÃO DO FORMULÁRIO ===
  //Começa a validação quando clica no botão cadastrar, impede de recarregar a página e limpa erros antigos.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    limparErros();

    let valido = true;

    // Validações uma por uma...
    // Nome
    if (nome.value.trim().length < 10) {
      erro(nome, 'Nome deve ter pelo menos 10 caracteres.');
      valido = false;
    }

    // RG
    if (!/^\d{2}\.\d{3}\.\d{3}-\d$/.test(rg.value)) {
      erro(rg, 'RG inválido (ex: 12.345.678-9)');
      valido = false;
    }

    // CPF Usa a função validar CPF
    if (!validarCPF(cpf.value)) {
      erro(cpf, 'CPF inválido.');
      valido = false;
    }

    // Telefone
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(telefone.value)) {
      erro(telefone, 'Telefone inválido.');
      valido = false;
    }

    // Email
    if (!email.checkValidity()) {
      erro(email, 'E-mail inválido.');
      valido = false;
    }

    // Senha
    if (senha.value.length < 6) {
      erro(senha, 'Senha deve ter 6 ou mais caracteres.');
      valido = false;
    }

    // Feedback final
    // Se tudo OK → verde + limpa
    // Se tem erro → vermelho
    if (valido) {
      feedback.textContent = 'CADASTRO REALIZADO COM SUCESSO!';
      feedback.className = 'success';
      feedback.style.display = 'block';
      form.reset(); // limpa todos os campos
    } else {
      feedback.textContent = 'CORRIJA OS ERROS ACIMA!';
      feedback.className = 'error';
      feedback.style.display = 'block';
    }
  });

  // === FUNÇÕES AUXILIARES ===
  // Cria mensagem de erro vermelha.
  function erro(input, msg) {
    const span = document.createElement('span');
    span.style.color = 'red';
    span.style.fontSize = '14px';
    span.style.display = 'block';
    span.textContent = msg;
    input.parentNode.appendChild(span);  // coloca a mensagem abaixo do campo
    input.style.borderColor = 'red';
  }
  // Remove todas as mensagens de erro antigas.
  function limparErros() {
    document.querySelectorAll('input').forEach(i => i.style.borderColor = 'red');
    document.querySelectorAll('span').forEach(s => s.remove()); // remove as mensagens de erro da tela
    feedback.style.display = 'none';
  }
});