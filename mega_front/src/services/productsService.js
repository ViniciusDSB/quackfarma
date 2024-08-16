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

export const addShopping = async (sale, clientId, medCode, qtd) => {
    return http.post('/adicionarAoCarrinho', {
        'sale_id': sale,
        'client_id': clientId,
        'medCode': medCode,
        'item_qtd': qtd
    })
}

export const searchShopping = async (saleId, clientId) => {
    return http.post('/verCarrinho', {
        'sale_id': saleId,
        'client_id': clientId
    })
}

export const cadastrarMedicamento = async (form, user, imagem) => {
    return http.post('/cadastrarMedicamento', {
        medName: form.nome,
        medCode: form.codigo,
        medCategory: form.categoria,
        medDescription: form.descricao,
        medUnitPrice: form.valor,
        amountOnStock: form.qtd,
        managerWhoAdded: user.id,
        imageFile: imagem,
        needRecipe: form.receita,
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