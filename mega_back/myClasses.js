const DEFAULT_MESSAGE = "OK";

class Medicine{
    constructor(medName, medCode, medCategory, medDescription, medUnitPrice, amountOnStock, managerWhoAdded, imagePath, needsRecipe){

        if(medName == '' || medName == undefined){ this.medName = null }
        else{this.medName = medName}

        if(medCode == '' || medCode == undefined){ this.medCode = null }
        else{this.medCode = medCode}

        if(medCategory == '' || medCategory == undefined){ this.medCategory = null  }
        else{this.medCategory = medCategory}

        if(medDescription == '' || medDescription == undefined){ this.medDescription = null  }
        else{this.medDescription = medDescription}

        if(medUnitPrice == '' || medUnitPrice == undefined){ this.medUnitPrice = null }
        else{this.medUnitPrice = medUnitPrice}

        if(amountOnStock == '' || amountOnStock == undefined){ this.amountOnStock = null }
        else{this.amountOnStock = amountOnStock}

        if(managerWhoAdded == '' || managerWhoAdded == undefined){ this.managerWhoAdded = null }
        else{this.managerWhoAdded = managerWhoAdded}

        if(imagePath == '' || imagePath == undefined){ this.imagePath = null }
        else{this.imagePath = imagePath}

        if(needsRecipe === '' || needsRecipe == undefined){ this.needsRecipe = null}
        else{this.needsRecipe = needsRecipe}

    }

    validadeData(){ 
        this.status = DEFAULT_MESSAGE;
    }
}
class MedicineSearch extends Medicine{

    constructor(medName, medCode, medCategory, medDescription, medUnitPrice, amountOnStock, managerWhoAdded, imagePath, needsRecipe, created_at, last_update){
        super(medName, medCode, medCategory, medDescription, medUnitPrice, amountOnStock, managerWhoAdded, imagePath, needsRecipe);

        if(created_at == null || created_at == '' || created_at == undefined){this.created_at = null}
        else{this.created_at = created_at}
        
        if(last_update == '' || last_update == undefined){this.last_update = null}
        else{this.last_update = last_update}

    }

    searchQuery = `SELECT * FROM medications WHERE 1=1`;
    queryValues = [];
    buildQuery(){
        
        let paramCount = 0;

        if(this.medName != null){
            paramCount+=1;
            this.searchQuery += ` AND name = $${paramCount}`;
            this.queryValues.push(this.medName);
        }

        if(this.medCode != null){
            paramCount+=1;
            this.searchQuery += ` AND code = $${paramCount}`;
            this.queryValues.push(this.medCode);
        }

        if(this.medCategory != null){
            paramCount+=1;
            this.searchQuery += ` AND category = $${paramCount}`;
            this.queryValues.push(this.medCategory);
        }

        if(this.medDescription != null){
            paramCount+=1;
            this.searchQuery += ` AND description = $${paramCount}`;
            this.queryValues.push(this.medDescription);
        }
  
            
        if(this.medUnitPrice != null){
            paramCount+=1;
            this.searchQuery += ` AND unit_price = $${paramCount}`;
            this.queryValues.push(this.medUnitPrice);
        }

        if(this.amountOnStock != null){
            paramCount+=1;
            this.searchQuery += ` AND on_stock = $${paramCount}`;
            this.queryValues.push(this.amountOnStock);
        }

        if(this.managerWhoAdded != null){
            paramCount+=1;
            this.searchQuery += ` AND manager = $${paramCount}`;
            this.queryValues.push(this.managerWhoAdded);
        }

        if(this.imagePath != null){
            paramCount+=1;
            this.searchQuery += ` AND image_path = $${paramCount}`;
            this.queryValues.push(this.imagePath);
        }
    
        if(this.needsRecipe != null){
            paramCount+=1;
            this.searchQuery += ` AND needs_recipe = $${paramCount}`;
            this.queryValues.push(this.needsRecipe);
        }

        if(this.created_at != null){
            paramCount+=1;
            this.searchQuery += ` AND created_at = $${paramCount}`;
            this.queryValues.push(this.created_at);
        }
        
        if(this.last_update != null){
            paramCount+=1;
            this.searchQuery += ` AND last_update = $${paramCount}`;
            this.queryValues.push(this.last_update);
        }

        return {query: this.searchQuery, values: this.queryValues}

    }
    
}

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
            case this.rg == "" || this.rg == undefined:
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
            case this.phone == "" || this.phone == undefined:
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
            case this.address == "" || this.address == undefined:
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

module.exports = { Login, User, UserManager, UserClient, Medicine, MedicineSearch, DEFAULT_MESSAGE};