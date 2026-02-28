/**
 * Обработка на формата за контакт - изпращане към backend API
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Събиране на данните
        const formData = {
            name: form.querySelector('#name')?.value?.trim() || '',
            email: form.querySelector('#email')?.value?.trim() || '',
            phone: form.querySelector('#phone')?.value?.trim() || '',
            question: form.querySelector('#question')?.value || '',
            format: form.querySelector('input[name="format"]:checked')?.value || '',
            date: form.querySelector('#date')?.value || '',
            message: form.querySelector('#message')?.value?.trim() || ''
        };

        // Валидация
        if (!formData.name || !formData.email) {
            showMessage('Моля, попълнете всички задължителни полета.', 'error');
            return;
        }

        if (!form.querySelector('input[type="checkbox"][required]')?.checked) {
            showMessage('Моля, съгласете се с обработката на личните данни.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Изпращане...';

        try {
            const apiUrl = window.API_URL || '/api/contact';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            let result;
            try {
                result = await response.json();
            } catch (_) {
                showMessage('Сървърът върна неочакван отговор. Уверете се, че сте отворили сайта на http://127.0.0.1:5000/', 'error');
                return;
            }

            if (response.ok && result.success) {
                showMessage(result.message || 'Съобщението беше изпратено успешно! Ще се свържем с вас скоро.', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'Възникна грешка. Моля, опитайте отново.', 'error');
            }
        } catch (err) {
            const msg = window.location.protocol === 'file:' 
                ? 'Отворете сайта на http://127.0.0.1:5000/ вместо директно от HTML файла.' 
                : 'Неуспешно свързване. Уверете се, че сървърът работи (python app.py от папка backend).';
            showMessage(msg, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

function showMessage(text, type) {
    let msgEl = document.getElementById('form-message');
    if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.id = 'form-message';
        msgEl.style.cssText = 'margin-top: 15px; padding: 12px 20px; border-radius: 8px; font-size: 16px;';
        const form = document.querySelector('.contact-form');
        if (form) form.appendChild(msgEl);
    }

    msgEl.textContent = text;
    msgEl.style.display = 'block';
    msgEl.style.backgroundColor = type === 'success' ? 'rgba(212, 223, 205, 0.9)' : 'rgba(236, 208, 196, 0.9)';
    msgEl.style.color = '#2e6073';
    msgEl.style.border = '1px solid #2e6073';

    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
        msgEl.textContent = '';
        msgEl.style.display = 'none';
    }, 5000);
}
