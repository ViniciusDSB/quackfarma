function validateEmailInput(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const emailRules = [
    v => !!v || 'E-mail é obrigatório',
    v => validateEmailInput(v) || 'Digite um email válido'
];
