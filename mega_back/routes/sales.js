const {app, express} = require('../expressApp');
const router = express.Router();

const dbPool = require('../dbConnection');
const { DEFAULT_MESSAGE} = require("../myClasses");

//http codes 
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const ACCEPTED_ADM = 209;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

/*
addCrrinho:
    ID_de_venda = req.body.ID_de_venda
    item_para_add = req.body.itemPraAdd -> codigo do medicamento
    qtd_do_item = req.body

    if(req.body.sale_id){
        cria um novo item
        pega o id desse item
        adicoina o item na venda, cujo o id é o ID_de_venda
    }else{
        criar o item e pegar o id
        criar a venda e pega ro id e adicionar o item
    }
*/

//tem que verificar se o client da venda é o mesmo que adiconou ao carrinho, tambem na verCarrinho
//verificar se a quantidade esta disponivel no estoque
//adicionar na tabela o campo reviwed: boolean
//verfiicar se o medicamento precisa de receita, colcoar true em approval se nao precisar

async function updateSales(cartItem_id, item_total, sale_id){
    const appendToSalesCart = `UPDATE sales SET shopping_cart = array_append(shopping_cart, $1) WHERE id = $2`;
    const getSaleTotalQuery = `SELECT sale_total FROM sales WHERE id = $1`;
    const updateSaleTotalQuery = `UPDATE sales SET sale_total = $1 WHERE id = $2`

    let currentSaleTotal = ( await dbPool.query( getSaleTotalQuery, [sale_id]) ).rows[0].sale_total;
    const new_sale_total = parseFloat(currentSaleTotal) + parseFloat(item_total)
    
    await dbPool.query( appendToSalesCart, [cartItem_id, sale_id]);
    await dbPool.query(updateSaleTotalQuery, [new_sale_total, sale_id]);
}

async function insertNewCart_item(medCode, item_qtd){
    const insertIntoCart_item = `INSERT INTO cart_item (
        medicine_code,
        sold_amount,
        item_total,
        approval_status
        ) VALUES($1, $2, $3, $4) RETURNING id`;
    const getMedPrice = `SELECT unit_price FROM medications WHERE code = $1`;
    const approval_status = false;

    const med_price = (await dbPool.query( getMedPrice, [medCode] )).rows[0].unit_price;
    let item_total = med_price * item_qtd;

    const cartItem_id = (await dbPool.query(insertIntoCart_item,[medCode, item_qtd, item_total, approval_status])).rows[0].id;
    const itemObj = {id: cartItem_id, total: item_total}

    return itemObj;
}

router.post('/adicionarAoCarrinho', async (req, res) => {
    
    try{
        const {sale_id, client_id, medCode, item_qtd } = req.body;
        const insertIntoSales = `INSERT INTO sales (
            shopping_cart,
            date_time,
            payment_method,
            sale_total,
            client) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const pay_method = "nao_finalizada";

        const newItem = await insertNewCart_item(medCode, item_qtd);
        cartItem_id = newItem.id
        item_total = newItem.total;
        
        let sellExists = false;
        if(sale_id != "" && sale_id != null && sale_id != undefined){
            sellExists = ( await dbPool.query('SELECT EXISTS (SELECT 1 FROM sales WHERE id = $1)', [sale_id]) ).rows[0].exists
        }
        
        if(sellExists){
            await updateSales(cartItem_id, item_total, sale_id);
            res.status(OK).json( {'sale_id': sale_id} );
        }else{
            const new_sale_id = (await dbPool.query( insertIntoSales,
                [ [cartItem_id], new Date(), pay_method, item_total, client_id ]
            )).rows[0].id;

            res.status(OK).json( {'sale_id': new_sale_id} );
        }
    
    }catch(err){
        console.error('Erro na rota /adicionarCarrinho', err);
        res.status(SERVER_ERR).send('Erro ao inserir no carrinho. Verifique o log.');
    }
});

router.post('/verCarrinho', async (req, res) => {
    try{
        const {sale_id, client_id } = req.body;

        const findSaleQuery = `SELECT * FROM sales WHERE id = $1`;
        const findItemsQuery = `SELECT * FROM cart_item WHERE id = $1`

        const sale = await dbPool.query(findSaleQuery, [sale_id]);
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

        res.status(OK).json( { data });

        //const produtos = await dbPool.query('SELECT medicine_code, sold_amount, item_total, approval_status FROM cart_item');
        //res.status(OK).json( {'message': DEFAULT_MESSAGE, 'cart_list': produtos.rows} )
    }catch(err){
        console.error('Erro na rota /listarMedicamentos', err);
        res.status(SERVER_ERR).send('Erro ao encontrar produtos no carrinho. Verifique o log.');
    }
});


router.post('/caixa', async (req, res) => {
    try{
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