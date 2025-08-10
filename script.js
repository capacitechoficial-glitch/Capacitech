document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showFormBtn').addEventListener('click', function() {
        document.getElementById('formContainer').classList.add('active');
        window.scrollTo({
            top: document.getElementById('formContainer').offsetTop - 20,
            behavior: 'smooth'
        });
    });

    const form = document.getElementById('inscricaoForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);

        fetch('/', {
            method: 'POST',
            body: formData
        }).then(() => {
            alert('✅ Inscrição enviada com sucesso! Em breve você receberá as instruções.');
            form.reset();
        }).catch(() => {
            alert('❌ Ocorreu um erro. Tente novamente.');
        });
    });

    // Máscara telefone
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

    // Máscara CPF
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
        }
        if (value.length > 6) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
        }
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        e.target.value = value;
    });

    // Máscara Data de Nascimento
    document.getElementById('nascimento').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
        }
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
        }
        e.target.value = value.substring(0, 10);
    });
});
