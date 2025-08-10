document.addEventListener('DOMContentLoaded', function() {
    // Mostrar formulário de inscrição
    document.getElementById('showFormBtn').addEventListener('click', function() {
        document.getElementById('formContainer').classList.add('active');
        window.scrollTo({
            top: document.getElementById('formContainer').offsetTop - 20,
            behavior: 'smooth'
        });
    });
    
    // Envio do formulário
    document.getElementById('inscricaoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação simples
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        
        if(nome && email && telefone) {
            alert('Inscrição enviada com sucesso! Em breve você receberá as instruções por e-mail e WhatsApp.');
            this.reset();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });
    
    // Máscara para telefone
    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = `(${value.substring(0,2)}) ${value.substring(2)}`;
        }
        if (value.length > 10) {
            value = `${value.substring(0,10)}-${value.substring(10)}`;
        }
        e.target.value = value.substring(0, 15);
    });
});