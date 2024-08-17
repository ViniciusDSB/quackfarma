import {http} from "@/services/apiResource";


export const searchProducts = async (query) => {
    if (query) {
        return http.get('/medicamento', {
            params: query
        })
    }
    return http.get('/medicamento')
}

export const seachUnit = async (codigo) => {
    return http.get('/medicamento?medCode=' + codigo)
}

export const addShopping = async (formData) => {
    return http.post('/adicionarAoCarrinho', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const searchShopping = async (saleId, clientId) => {
    return http.post('/verCarrinho', {
        'sale_id': saleId,
        'client_id': clientId
    })
}

export const cadastrarMedicamento = async (form) => {
    return http.post('/cadastrarMedicamento',form,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteItemCarrinho = async (clienteId, saleId, itemId) => {
    return http.post('/apagar', {
        client_id: clienteId,
        sale_id: saleId,
        item_id: itemId
    })
}

export const finalizarCompra = async (clientId, saleId, metodoPagemnto) => {
return http.post('/finalizarVenda',{
    client_id : clientId,
    sale_id : saleId,
    metodo_pagamento: metodoPagemnto
})
}