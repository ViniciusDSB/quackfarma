const { app, express } = require( '../../expressApp' );
const router = express.Router();

const dbPool = require('../../dbConnection');
const { DEFAULT_MESSAGE } = require("../../myClasses");

//http codes
const SUCCESS = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

const deleteItemQuery = `DELETE FROM cart_item WHERE id = $1`;

const getItemTotal = `SELECT item_total FROM cart_item WHERE id = $1`;

const updateSaleTotalQuery = `UPDATE sales SET sale_total = sale_total - $1 WHERE id = $2`;

//deleta itme único, para isso reduz o total do item do total da venda
//deleta o item
//e em fim remove o itme da lista da venda

//: ${item_id}, da venda; ${sale_id},  
async function deleteItem(sale_id, item_id){
    
    try{
        const itemTotal = ( await dbPool.query(getItemTotal, [item_id]) );
        if(itemTotal.rowCount == 0)
            return {error: `item não encontrado`, code: 1};

        await dbPool.query(updateSaleTotalQuery, [itemTotal.rows[0].item_total, sale_id]);
        await dbPool.query(deleteItemQuery, [item_id]);
        return {}

    }catch(err){
        console.log("Erro em deleteItem(), da rota /apagar");
        return {error: err, code: 2}
    }
   
}

//itera sobre todos os itens, deletando um por um e então deleta a venda
//: ${sale_id} 
async function deleteSale(sale_id){
    try{
        const deleteSaleQuery = `DELETE FROM sales WHERE id = $1`;
        const deletion = await dbPool.query(deleteSaleQuery, [sale_id]);
        if(deletion.rowCount == 0)
            return {error: `Venda não encontrada`, code: 1};
        
        return {}
    }catch(err){
        console.log("Erro em deleteSale(), da rota /apagar");
        return {error: err, code: 2}
    }
}

router.post("/apagar", async (req, res) => {
    res.header('Content-Type', 'application/json');

    try{
        let { sale_id, item_id, client_id } = req.body;
        sale_id = parseInt(sale_id);
        item_id = parseInt(item_id);
        client_id = parseInt(client_id);

        //se tiver id de um item && id de uma venda então deleta o item especifico
        //se tiver somente id da venda então deleta tudo, venda e seus itens
        if(client_id == undefined || client_id == ''){
            return res.status(UNAUTHORIZED).json( {message: "Usuario não logado ou não informado!"} );
        }
        const isFromClient = await dbPool.query(`SELECT 1 FROM sales WHERE id = $1 AND client = $2`, [sale_id, client_id])
        if(isFromClient.rowCount == 0){
            return res.status(UNAUTHORIZED).json( { message: `Cliente não possui o carrinho` } );
        }

        if( sale_id != undefined && 
            sale_id != false && 
            item_id != undefined &&
            item_id != false){
                
            const itemDel = await deleteItem(sale_id, item_id);

            if(itemDel.error != undefined){
                console.log(itemDel.error);
                res.status(NOT_FOUND).json( 
                    {messae: `Erro ao remover item! ${
                        (itemDel.code == 1) ? itemDel.error :""
                    }` } 
                );
            }else
                res.status(SUCCESS).send();
        }//deleta toda avenda e seus items
        else if( sale_id ){
            const saleDel = await deleteSale(sale_id);
            
            if(saleDel.error){
                console.log(saleDel.error);
                res.status(NOT_FOUND).json( 
                    {messae: `Erro ao remover venda! ${
                        (saleDel.code == 1) ? saleDel.error :""
                    }` } 
                );
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