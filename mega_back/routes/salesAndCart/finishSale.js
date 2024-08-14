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

router.post('/caixa', async (req, res) => {
    try{
        res.header('Content-Type', 'application/json');
        
        const { sale_id, pagamento, total, cliente } = req.body;

        const carrinho = await dbPool.query('SELECT EXISTS (SELECT 1 FROM sales WHERE id = $1', [sale_id]);

        if (carrinho.rows[0].exist){
            
        }else{
            
        }
        
        await dbPool.query(`INSERT INTO sales(date_time, payment_method, sale_total, client) VALUES($1, $2, $3, $4, $5) RETURNING id`,
            [new Date(), pagamento, total, cliente]
        );
        res.status(OK).json({ 'message': 'Venda registrada com sucesso!' });
    }catch{
        console.error('Erro na rota /finalizarVenda', err);
        res.status(SERVER_ERR).send('Erro ao registrar venda. Verifique o log.');
    }
});


module.exports = router