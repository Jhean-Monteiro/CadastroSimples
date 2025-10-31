// function validarCPF(cpf) {
//   cpf = cpf.replace(/[^\d]+/g, ''); // remove pontos e traços
//   if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

//   let soma = 0, resto;

//   for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
//   resto = (soma * 10) % 11;
//   if (resto === 10 || resto === 11) resto = 0;
//   if (resto !== parseInt(cpf.substring(9, 10))) return false;

//   soma = 0;
//   for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
//   resto = (soma * 10) % 11;
//   if (resto === 10 || resto === 11) resto = 0;
//   if (resto !== parseInt(cpf.substring(10, 11))) return false;

//   return true;
// }




// ====================== ESPERA O HTML CARREGAR ======================

document.addEventListener('DOMContentLoaded', function () { // executa apenas quando todo o DOM estiver carregado
  const campoNome = document.getElementById('nome'); // pega o input do nome
  const toast = document.getElementById('toast');   // pega o toast flutuante

  let timeoutId = null; // armazena o ID do setTimeout para controle


  // ====================== EVENTO DE DIGITAÇÃO ======================
  campoNome.addEventListener('input', function () {
    const valor = campoNome.value; // pega o valor atual do campo

    // se exceder 50 caracteres
    if (valor.length >= 50) {
      // cortar excesso
      campoNome.value = valor.slice(0, 50);

      // adiciona a classe 'show' para exibir o toast
      toast.classList.add('show');


      clearTimeout(timeoutId); // Cancela qualquer timeout anterior (evita múltiplos)

      // Remove o toast após 3 segundos
      timeoutId = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);

    } else {
      // Se o usuário apagar e ficar abaixo de 50, remove imediatamente
      clearTimeout(timeoutId);
      toast.classList.remove('show');
    }
  });



  // ====================== CLIQUE NO TOAST ======================
  // permite fechar o toast clicando nele
  toast.addEventListener('click', () => {
    toast.classList.remove('show');
  });
});