const {app, express} = require('../../expressApp');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const dbPool = require('../../dbConnection');
const { DEFAULT_MESSAGE } = require("../../myClasses");

//http codes 
const SUCCESS = 204;
const UNAUTHORIZED = 401;
const SERVER_ERR = 500;

// id
// date_time
// payment_method
// sale_total
// client
// status

const updateSale = `UPDATE sales SET status = $1, payment_method = $2 WHERE id = $3`;
const getSaleClient = `SELECT client FROM sales WHERE id = $1`;

const getItemsData= `SELECT medicine_code, sold_amount FROM cart_item WHERE sale_id = $1`;
const updateStockQuery = `UPDATE medications SET on_stock = on_stock - $1 WHERE code = $2`;

//validar dados do cartão
//validar pagamento por pix/qr_code

async function updateStock(sale_id){
    try{
        const itemsData = (await dbPool.query(getItemsData, [sale_id]) ).rows;
        for( itemData of itemsData ){
            await dbPool.query(updateStockQuery, [ itemData.sold_amount , itemData.medicine_code]);
        }
        return {}
    }catch(err){
        return {error: err, code: 1}
    }
}

router.post('/finalizarVenda', async (req, res) => {
    try{
        res.header('Content-Type', 'application/json');
        
        let { sale_id, metodo_pagamento, client_id } = req.body;
        sale_id = parseInt(sale_id);
        client_id = parseInt(client_id);

        const saleClient = ( await dbPool.query(getSaleClient, [sale_id]) );
        
        if( !(saleClient.rows[0].client == client_id) ){
            return res.status(UNAUTHORIZED).json( { message: "Venda não pertence a este usuário!" } );
        }

        await dbPool.query(updateSale, [true, metodo_pagamento, sale_id]);
        const updateMedicines = await updateStock(sale_id);
        if( updateMedicines.error ){
            console.log(updateMedicines.error);
            return res.status(SERVER_ERR);
        }

        res.status(SUCCESS).send();

    }catch(err){
        console.error('Erro na rota /finalizarVenda', err);
        res.status(SERVER_ERR).send('Erro ao registrar venda. Verifique o log.');
    }
});


module.exports = router