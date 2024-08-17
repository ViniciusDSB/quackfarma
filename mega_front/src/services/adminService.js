import {http} from "@/services/apiResource";

export const createAdmin = async (data) => {
    return await http.post('/cadastrarAdm', {
        "name": data.name,
        "email": data.email,
        "password":data.password,
        "passwordRepeat": data.passwordRepeat,
    })
}
export const relatorio = async (inicio,fim,userId) => {
    return await http.post('/gerarRelatorio', {
        "start_date": inicio,
        "end_date": fim,
        "client_id":userId,
    })
}
