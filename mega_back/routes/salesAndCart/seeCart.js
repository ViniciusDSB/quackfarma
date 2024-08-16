const {app, express} = require('../../expressApp');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const dbPool = require('../../dbConnection');
const { DEFAULT_MESSAGE } = require("../../myClasses");
const { BADFAMILY } = require('dns');

//http codes 
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

router.post('/verCarrinho', async (req, res) => {
    //verifica client id e essas coisas
    //se tem itens, se tem carrinho, tu sabes
    res.header('Content-Type', 'application/json');
    
    try{
        let  {sale_id, client_id} = req.body;

        sale_id = parseInt(sale_id);
        client_id = parseInt(client_id);

        if(!client_id){
            return res.status(UNAUTHORIZED).json( {message: "Usuario não logado ou não informado!"} );
        }
        if(!sale_id || sale_id == undefined){
            return res.status(BAD_REQUEST).json( {message: "Id da venda deve ser informado"} );
        }

        const findSaleQuery = `SELECT * FROM sales WHERE id = $1 AND client = $2`;
        const findItemsQuery = `SELECT * FROM cart_item WHERE id = $1`;

        const sale = await dbPool.query(findSaleQuery, [sale_id, client_id]);
        if(sale.rowCount == 0 || !sale_id){
            return res.status(NOT_FOUND).json( {message: "Carrinho não foi encontrado"} );
        }
        const cart_items = await dbPool.query(`SELECT * FROM cart_item WHERE sale_id = $1`, [sale_id]);
        let shopping_cart = cart_items.rows;

        let data = {
            'id': sale.rows[0].id,
            'date_time': sale.rows[0].date_time,
            'pay_method': sale.rows[0].payment_method,
            'total': sale.rows[0].sale_total,
            'shopping_cart': shopping_cart
        }

        res.status(OK).json( data );

    }catch(err){
        console.error('Erro na rota /listarMedicamentos', err);
        res.status(SERVER_ERR).send('Erro ao encontrar produtos no carrinho. Verifique o log.');
    }
});

module.exports = router