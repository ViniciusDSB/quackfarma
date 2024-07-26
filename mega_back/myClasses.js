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
        this.status = defaultStats;

        this.validadeEmail();
        this.validatePassword();
    }
}

class User{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.pasword = password;
    }
    validateName(){
        if(false){
            this.status = "Nome inválido";
        }
    }
    validateEmail(){
        if(false){
            this.status = "Email inválido";
        }
    }
    validatePassword(){
        if(false){
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
        this.address = address;
        this.phone = phone;
    }

    validateCpf(){
        let stats = true;
        //swtch case is better
        if(this.cpf == ""){
            stats = false;
        }
        if(!stats){
            this.status = "CPF inválido";
        }
    }
    validateRg(){
        if(false){
            this.status = "Rg inválido";
        }
    }
    validatePhone(){
        if(false){
            this.status = "Numero de telefone inválido";
        }
    }
    validateAddress(){
        let validationStatus = true;
        
        if(this.address == ""){
            this.address = null;
        }

        if(!validationStatus){
            this.status = "Endereço inválido";
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


module.exports = { Login, User, UserManager, UserClient, defaultStats};