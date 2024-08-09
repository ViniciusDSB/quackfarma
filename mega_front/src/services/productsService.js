import {http} from "@/services/apiResource";



export const searchProducts = async() =>  {
    return  http.get('/medicamento')
}

export const seachUnit = async (codigo) => {
    return http.get('/medicamento?medCode=' + codigo)
}