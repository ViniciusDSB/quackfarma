import {http} from "@/services/apiResource";

export const createAdmin = async (data) => {
    return await http.post('/cadastrarAdm', {
        "name": data.name,
        "email": data.email,
        "password":data.password,
        "passwordRepeat": data.passwordRepeat,
    })
}
