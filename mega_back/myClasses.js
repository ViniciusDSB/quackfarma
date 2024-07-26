const defaultStatus = "OK";

class Login{
    constructor(loginEmail, loginPassword){
        this.email = loginEmail;
        this.password = loginPassword;
    }

    validateEmail(){
        if(false){
            this.status = "Email inválido";
        }
    }
    validatePassword(){
        if(false){
            this.status = "Senha inválida";
        }
    }

    //The validateFunctions() will check the format, size etc of the received data
    //if everything is fine the status remains OK, else, if anyhing ir wrong an error status is set
    validateData(){
        this.status = defaultStatus;

        this.validateEmail();
        this.validatePassword();
    }
}

class User{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
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
                break;
        }
    }
    validateEmail(){
        const TestEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!TestEmail.test(this.email)){
            this.status = "Email inválido";
        }
    }
    validatePassword(){
        const TestPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,10}$/;
        if(!TestPassword.test(this.password)){
            this.status = "Senha inválido";
        }
    }

    validateData(){
        this.status = defaultStatus;

        this.validateName();
        this.validateEmail();
        this.validatePassword();
    }
}


class UserManager extends User{
    constructor(name, email, password){
        super(name, email, password);
    }
}
class UserClient extends User{
    constructor(name, cpf, email, password, rg, address, phone){
        super(name, email, password);
        this.cpf = cpf;
        this.rg = rg;
        this.phone = phone;
        this.address = address;
    }

    validateCpf(){
        switch(true){
            case this.cpf == "":
                this.status = "CPF vazio!";
                break;
            case !/^\d{11}$/.test(this.cpf): //Verifica se há 11 dígitos
                this.status = "CPF inválido!";
                break;
            case VerificadorCpf(this.cpf) == false:
                this.status = "CPF inválido!";
                break;
            case /^(\d)\1{10}$/.test(this.cpf): //Verifica se os digitos não são todos iguais
                this.status = "CPF inválido!";
                break;
            default:
                break;
        }
    }

    validateRg(){
        switch(true){
            case this.cpf == "":
                this.address = null;
                break;
            case !/^[A-Z]{0,2}[0-9]{7,9}$/.test(this.rg):
                this.status = "RG possui 7 à 9 caracteres!";
                break;
            default:
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

    validateData(){
        this.status = defaultStatus;

        this.validateName();
        this.validateEmail();
        this.validatePassword();
        this.validateCpf();
        this.validateRg();
        this.validateAddress();
        this.validatePhone();
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

module.exports = { Login, User, UserManager, UserClient, defaultStatus};