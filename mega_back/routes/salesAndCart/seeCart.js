const {app, express} = require('../../expressApp');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const dbPool = require('../../dbConnection');
const { DEFAULT_MESSAGE } = require("../../myClasses");

//http codes 
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const UNPROCESSABLE_CONTENT = 422;
const SERVER_ERR = 500;

router.post('/verCarrinho', async (req, res) => {
    //verifica client id e essas coisas
    //se tem itens, se tem carrinho, tu sabes
    res.header('Content-Type', 'application/json');
    
    try{
        const {sale_id, client_id } = req.body;

        const findSaleQuery = `SELECT * FROM sales WHERE id = $1 AND client = $2`;
        const findItemsQuery = `SELECT * FROM cart_item WHERE id = $1`;
        if(!client_id){
            return res.status(UNAUTHORIZED).json( {message: "Usuairo deve estar logado!"} );
        }
        if(!sale_id){
            return res.status(UNAUTHORIZED).json( {message: "Id da venda deve ser informado"} );
        }

        const sale = await dbPool.query(findSaleQuery, [sale_id, client_id]);
        if(sale.rowCount == 0 || !sale_id){
            return res.status(NOT_FOUND).json( {message: "Carrinho não foi encontrado"} );
        }
        const cart_items = sale.rows[0].shopping_cart;
        let shopping_cart = [];

        for(item_id of cart_items){
            const itemData = await dbPool.query(findItemsQuery, [item_id]);
            shopping_cart.push( itemData.rows[0] );
        }

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