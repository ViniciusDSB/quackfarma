const { app, express } = require( '../../expressApp' );
const router = express.Router();

const dbPool = require('../../dbConnection');
const { DEFAULT_MESSAGE } = require("../../myClasses");

//http codes 
const OK = 200;
const SUCCESS = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

const deleteItemQuery = `DELETE FROM cart_item WHERE id = $1`;

const getItemTotal = `SELECT item_total FROM cart_item WHERE id = $1`;

const updateSaleTotalQuery = `UPDATE sales SET sale_total = sale_total - $1 WHERE id = $2`;
const removeFromSalesCart = `UPDATE sales SET shopping_cart = array_remove(shopping_cart, $1) WHERE id = $2`;

//deleta itme único, para isso reduz o total do item do total da venda
//deleta o item
//e em fim remove o itme da lista da venda
async function deleteItem(sale_id, item_id, single){
    
    try{
        if(!single){
            await dbPool.query(deleteItemQuery, [item_id]);
            return {}
        }else{
            const itemTotal = ( await dbPool.query(getItemTotal, [item_id]) ).rows[0].item_total;
            await dbPool.query(updateSaleTotalQuery, [itemTotal, sale_id]);
            await dbPool.query(deleteItemQuery, [item_id]);
            await dbPool.query(removeFromSalesCart, [item_id, sale_id]);
            return {}
        }
    }catch(err){
        console.log("Erro em deleteItem(), da rota /apagar");
        return {error: err}
    }
   
}

//itera sobre todos os itens, deletando um por um e então deleta a venda
async function deleteSale(sale_id){
    try{
        const getCartItemsQuery = `SELECT shopping_cart FROM sales WHERE id = $1`;
        const deleteSaleQuery = `DELETE FROM sales WHERE id = $1`;

        let items = ( await dbPool.query(getCartItemsQuery, [sale_id]) );
        if(items.rowCount == 0){
            return { error: "Venda não encontrada!" };
        }

        for(const item_id of items.rows[0].shopping_cart){
            await deleteItem(sale_id, item_id, false);
        }

        await dbPool.query(deleteSaleQuery, [sale_id]);
        return {}
    }catch(err){
        console.log("Erro em deleteSale(), da rota /apagar");
        return {error: err}
    }
}

router.post("/apagar", async (req, res) => {
    res.header('Content-Type', 'application/json');

    try{
        const { sale_id, item_id, client_id } = req.body;

        //se tiver id de um item && id de uma venda então deleta o item especifico
        //se tiver somente id da venda então deleta tudo, venda e seus itens

        const isFromClient = await dbPool.query(`SELECT 1 FROM sales WHERE id = $1 AND client = $2`, [sale_id, client_id])
        if(isFromClient.rowCount == 0){
            return res.status(UNAUTHORIZED).json( { message: "Carrinho não pertence ao cliente" } );
        }

        if( sale_id && item_id ){
            const itemDel = await deleteItem(sale_id, item_id, true);
            if(itemDel.error != undefined){
                console.log(itemDel.error);
                res.status(NOT_FOUND).json( {messae:"Algo deu errado ao deletar item!"} );
            }else
                res.status(SUCCESS).send();
        }//deleta toda avenda e seus items
        else if( sale_id ){
            const saleDel = await deleteSale(sale_id);
            if(saleDel.error){
                console.log(saleDel.error)
                res.status(BAD_REQUEST).json( {message: "Algo deu errado ao tentar deletar tudo!"} );
            }else
                res.status(SUCCESS).send();
        }else{
            res.status(BAD_REQUEST).json( { message: "Nenhum parametro fornecido" } );
        }
    }catch(err){
        console.error('Erro na rota /apagar', err);
        res.status(SERVER_ERR).send('Erro ao inserir remover item/venda. Verifique o log.');
    }
})

module.exports = router