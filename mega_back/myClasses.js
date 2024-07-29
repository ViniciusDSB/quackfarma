const DEFAULT_MESSAGE = "OK";

class Login{
    constructor(loginEmail, loginPassword){
        this.email = loginEmail;
        this.password = loginPassword;
    }

    validateEmail(){
        const TestEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!TestEmail.test(this.email)){
            this.status = "Formato de email inválido";
        }
    }
    validatePassword(){
        const TestPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,10}$/;
        switch(true){
            case this.password == "":
                this.status = "O campo de senha não foi preenchido";
                break;
            case !TestPassword.test(this.password):
                this.status = "Formato de senha inválido";
                break;
            default:
                break;
        }
    }

    //The validateFunctions() will check the format, size etc of the received data
    //if everything is fine the status remains OK, else, if anyhing ir wrong an error status is set
    validateData(){
        this.status = DEFAULT_MESSAGE;

        this.validateEmail();
        this.validatePassword();
    }
}

class User{
    constructor(name, email, password, passwordRepeat){
        this.name = name;
        this.email = email;
        this.password = password;
        this.passwordRepeat = passwordRepeat
    }

    validateData(){
        this.status = DEFAULT_MESSAGE;
        this.validateName();
    }

    validateName(){
        const TestName = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        switch(true){
            case !this.name:
                this.status = "O nome não pode ser vazio!";
                break;
            case !TestName.test(this.name):
                this.status = "O nome deve conter apenas letras e espaços!";
                break;
            default:
                this.validateEmail();
                break;
        }
    }
    validateEmail(){
        const TestEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!TestEmail.test(this.email)){
            this.status = "Formato de email inválido";
        }else{

            this.validatePassword();
        }    
    }
    validatePassword(){
        const TestPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,10}$/;
        switch(true){
            case this.password == "":
                this.status = "O campo de senha não foi preenchido";
                break;
            case !TestPassword.test(this.password):
                this.status = "Formato de senha inválido";
                break;
            case this.password != this.passwordRepeat:
                this.status = "As senhas não são iguais!";
                break;
            default:
                break;
        }
    }
}


class UserManager extends User{
    constructor(name, email, password, passwordRepeat){
        super(name, email, password, passwordRepeat);
    }
}
class UserClient extends User{
    constructor(name, cpf, email, password, passwordRepeat, rg, address, phone){
        super(name, email, password, passwordRepeat);
        this.cpf = cpf;
        this.rg = rg;
        this.phone = phone;
        this.address = address;
    }

    validateData(){
        this.status = DEFAULT_MESSAGE;

        this.validateName(); //from standard class
        this.validateCpf(); //for this extended class
    }

    validateCpf(){
        switch(true){
            case this.cpf == "":
                this.status = "CPF não pode ser vazio!";
                break;
            case !/^\d{11}$/.test(this.cpf): //Verifica se há 11 dígitos
                this.status = "CPF inválido; Deve conter 11 digitos!";
                break;
            case VerificadorCpf(this.cpf) == false:
                this.status = "O CPF fotnecido é inválido!";
                break;
            case /^(\d)\1{10}$/.test(this.cpf): //Verifica se os digitos não são todos iguais
                this.status = "CPF inválido!";
                break;
            default:
                this.validateRg();
                break;
        }
    }

    validateRg(){
        switch(true){
            case this.rg == "":
                this.rg = null;
                break;
            case !/^[A-Z]{0,2}[0-9]{7,9}$/.test(this.rg):
                this.status = "RG deve possuir de 7 à 9 caracteres!";
                break;
            default:
                this.validatePhone();
                break;
        }
    }
    validatePhone(){       
        switch(true){ 
            case this.phone == "":
                this.phone = null;
                break;
            case !/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(this.phone):
                this.status = "Número de telefone inválido!";
                break;
            default:
                this.validateAddress();
                break;
        }
    }
    validateAddress(){     
        switch(true){
            case this.address == "":
                this.address = null;
                break;
            case this.address.length < 5:
                this.status = "O endereço deve ter pelo menos 5 caracteres!"
                break;
            case !/^(?=.*[A-Za-z])[A-Za-z0-9\s-]*$/.test(this.address):
                this.status = "Endereço inválido!";
                break;
            default:
                break;
        }   
    }
}

function VerificadorCpf(cpf) {
    const Digitos = (cpf, fator) => {
        let total = 0;
        for (let i = 0; i < fator - 1; i++) {
            total += parseInt(cpf[i]) * (fator - i);
        }
        const resto = (total * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const PrimeiroDigito = Digitos(cpf, 10);
    if (PrimeiroDigito !== parseInt(cpf[9])) {
        return false;
    }

    const SegundoDigito = Digitos(cpf, 11);
    if (SegundoDigito !== parseInt(cpf[10])) {
        return false;
    }

    return true;
}

module.exports = { Login, User, UserManager, UserClient, DEFAULT_MESSAGE};