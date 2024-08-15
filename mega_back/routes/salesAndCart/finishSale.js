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

//validar dados do cartão
//validar pagamento por pix/qr_code

router.post('/finalizarVenda', async (req, res) => {
    try{
        res.header('Content-Type', 'application/json');
        
        const { sale_id, metodo_pagamento, client_id } = req.body;

        const saleClient = ( await dbPool.query(getSaleClient, [sale_id]) );
        
        if(saleClient.rows[0].client == client_id){
            await dbPool.query(updateSale, [true, metodo_pagamento, sale_id]);
            return res.status(SUCCESS).send();
        }else{
            return res.status(UNAUTHORIZED).json( { message: "Venda não pertence a este usuário!" } );
        }

    }catch{
        console.error('Erro na rota /finalizarVenda', err);
        res.status(SERVER_ERR).send('Erro ao registrar venda. Verifique o log.');
    }
});


module.exports = router