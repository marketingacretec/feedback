document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trainingEvaluationForm');
    const submitBtn = form.querySelector('.submit-btn');
    const spinner = submitBtn.querySelector('.fa-spinner');
    const thankYouMessage = document.getElementById('thankYouMessage');

    // Validate required fields
    function validateForm() {
        const requiredInputs = form.querySelectorAll('input[required], select[required]');
        for (const input of requiredInputs) {
            if (input.type === 'radio') {
                const radioGroup = form.querySelector(`input[name="${input.name}"]:checked`);
                if (!radioGroup) {
                    console.log(`Validation failed: No selection for radio group ${input.name}`);
                    return false;
                }
            } else if (!input.value.trim()) {
                console.log(`Validation failed: Empty value for ${input.name}`);
                return false;
            }
        }
        return true;
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
            return;
        }

        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';

        const formData = new FormData(form);
        // Log form data for debugging
        for (const [key, value] of formData.entries()) {
            console.log(`FormData: ${key} = ${value}`);
        }

        try {
            const response = await fetch('https://api.sheetmonkey.io/form/idKcZD9u6rigDPsrkTjrjF', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Form submitted successfully');
                form.style.display = 'none';
                thankYouMessage.style.display = 'block';
            } else {
                const errorText = await response.text();
                console.error(`Submission failed: ${response.status} - ${errorText}`);
                alert(`Erro ao enviar a avaliação (Código: ${response.status}). Por favor, tente novamente.`);
            }
        } catch (error) {
            console.error('Submission error:', error.message);
            alert('Erro ao enviar a avaliação. Verifique sua conexão e tente novamente. Detalhes no console.');
        } finally {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        }
    });
});