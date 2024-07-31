function generateCpf(){
    let cpf = "";
    for(let i=0; i<9; i++){
        cpf = cpf+ Math.floor(Math.random() * 10);
    }
    console.log(cpf);
    // Remove todos os caracteres que não sejam números
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 9) {
        throw new Error('CPF deve ter 9 dígitos');
    }

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += cpf[i] * (10 - i);
    }

    let resto = soma % 11;
    let primeiroDigito = resto < 2 ? 0 : 11 - resto;

    // Cálculo do segundo dígito verificador
    soma = 0;
        for (let i = 0; i < 9; i++) {
        soma += cpf[i] * (11 - i);
    }
    soma += primeiroDigito * 2;

    resto = soma % 11;
    let segundoDigito = resto < 2 ? 0 : 11 - resto;

    return cpf + primeiroDigito.toString() + segundoDigito.toString();
}

let cpfCompleto = generateCpf();
console.log("CPF completo:", cpfCompleto);
