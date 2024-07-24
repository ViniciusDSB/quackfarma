class Login{
    constructor(loginEmail, loginPassword){
        this.email = loginEmail;
        this.password = loginPassword;
    }
    validateEmail(){
        if(true){
            this.status = true;
        }else{
            this.status = false;
        }
    }
    validatePassword(){
        if(true){
            this.status =true;
        }else{
            this.status = false;
        }
    }
}

/*
nome varchar(255) [not null]
    cpf varchar(11) [not null]
    email varchar(255) [not null]
    senha varchar(256) [not null] //6 a 10 caracteres, mas aqui no banco fica so a hash
    idade integer //idade maxima/quantidade maxima de caracteres na idade
    telefone integer //11 caracteres, formato (DDD)9-1234-5678
     */

class User{
    constructor(name, cpf, email, password, age, phone){
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.password = password;
        this.age = age;
        this.phone = phone;
    }

    //prototypes only; the validateFunctions() will check the formar, size etc of the received data
    //if they are correct it will set a OK status that allows the rote to proced, 
    //saving data in the database and redirectign the user
    //if data is not correct it sets an error status

    validateData(){
        this.validateName();
        this.validateCpf();
        this.validateEmail();
        this.validatePassword();
        this.validateAge();
        this.validatePhone();

        if(true){
            this.status = true;
        }else{
            this.status = false;
        }
    }
    validateName(){
        if(true){
            return true;
        }else{
            return false;
        }
    }
    validateCpf(){
        if(true){
            return true;
        }else{
            return false;
        }
    }
    validateEmail(){
        if(true){
            return true;
        }else{
            return false;
        }
    }
    validatePassword(){
        if(true){
            return true;
        }else{
            return false;
        }
    }
    validateAge(){
        if(true){
            return true;
        }else{
            return false;
        }
    }
    validatePhone(){
        if(true){
            return true;
        }else{
            return false;
        }
    }
}

module.exports = { Login, User}