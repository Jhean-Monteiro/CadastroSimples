// Funções de validação em tempo real e envio

document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os grupos dos campos
  const grupos = [
    document.getElementById('grupo-nome'),
    document.getElementById('grupo-email'),
    document.getElementById('grupo-senha'),
    document.getElementById('grupo-confirmar'),
    document.getElementById('grupo-estado'),
    document.getElementById('grupo-termos'),
    document.getElementById('btn-cadastrar')
  ];

  // Inicializa apenas o campo de nome visível
  grupos.forEach((grupo, idx) => {
    if (idx === 0) {
      grupo.classList.remove('oculto');
      grupo.classList.add('visivel');
    } else {
      grupo.classList.add('oculto');
    }
  });

  // Sequência de campo para campo
  for (let i = 0; i < grupos.length - 1; i++) {
    const input = grupos[i].querySelector('input, select');
    if (input) {
      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          // Só mostra o próximo grupo se o campo não estiver vazio
          if (input.value.trim() !== '' && 
              (input.type !== 'checkbox' ? true : input.checked)) {
            const proxGrupo = grupos[i + 1];
            proxGrupo.classList.add('visivel');
            proxGrupo.classList.remove('oculto');
            input.blur();
          }
        }
      });
    }
  }

  // Resto da sua validação (igual seu modelo)

  const form = document.getElementById('cadastroForm');
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const confirmar = document.getElementById('confirmar');
  const estado = document.getElementById('estado');
  const termos = document.getElementById('termos');
  const sucesso = document.getElementById('sucesso');

  function showError(input, msg) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    const feedback = input.parentElement.querySelector('.feedback');
    feedback.style.display = 'block';
    feedback.textContent = msg;
  }
  function showValid(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    const feedback = input.parentElement.querySelector('.feedback');
    feedback.style.display = 'none';
  }
  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  function checkSenha() {
    if (senha.value.length < 6) {
      showError(senha, 'Senha mínima de 6 caracteres.');
      return false;
    } else {
      showValid(senha);
      return true;
    }
  }
  function checkConfirmar() {
    if (confirmar.value !== senha.value || confirmar.value.length === 0) {
      showError(confirmar, 'As senhas não coincidem.');
      return false;
    } else {
      showValid(confirmar);
      return true;
    }
  }
  nome.addEventListener('input', function() {
    if (nome.value.trim().length < 2) {
      showError(nome, 'Digite pelo menos 2 caracteres.');
    } else {
      showValid(nome);
    }
  });
  email.addEventListener('input', function() {
    if (!validateEmail(email.value)) {
      showError(email, 'Email inválido.');
    } else {
      showValid(email);
    }
  });
  senha.addEventListener('input', checkSenha);
  confirmar.addEventListener('input', checkConfirmar);
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (
      nome.value.trim().length < 2 ||
      !validateEmail(email.value) ||
      senha.value.length < 6 ||
      confirmar.value !== senha.value ||
      !estado.value ||
      !termos.checked
    ) {
      if (nome.value.trim().length < 2) showError(nome, 'Nome obrigatório.');
      if (!validateEmail(email.value)) showError(email, 'Email inválido.');
      if (senha.value.length < 6) showError(senha, 'Senha curta.');
      if (confirmar.value !== senha.value) showError(confirmar, 'Senhas não coincidem.');
      if (!estado.value) showError(estado, 'Selecione uma opção.');
      if (!termos.checked) termos.parentElement.style.color = '#d43f3a';
      sucesso.style.display = 'none';
      return;
    } else {
      sucesso.style.display = 'block';
      sucesso.textContent = 'Cadastro realizado com sucesso!';
      form.reset();
      setTimeout(() => { sucesso.style.display = 'none'; }, 2800);
      document.querySelectorAll('.feedback').forEach(fb => fb.style.display = 'none');
      document.querySelectorAll('input, select, textarea').forEach(inp => inp.classList.remove('valid', 'invalid'));
      termos.parentElement.style.color = '';
    }
  });
  termos.addEventListener('change', function() {
    if (termos.checked) termos.parentElement.style.color = '';
  });
});
