import {http} from "@/services/apiResource";


export const createUser = async (data) => {
    return await http.post('/cadastrarCli', {
        "name": data.name,
        "cpf": data.cpf,
        "email": data.email,
        "password":data.password,
        "passwordRepeat": data.passwordRepeat,
        "rg": data.rg,
        "address": data.address,
        "phone": data.phone
    })
}

export const login = async (email,password) => {
    return await http.post('/fazerLogin', {email: email, password: password})
}
