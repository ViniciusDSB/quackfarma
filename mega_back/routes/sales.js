const {app, express} = require('../expressApp');
const router = express.Router();

const dbPool = require('../dbConnection');
const { DEFAULT_MESSAGE} = require("../myClasses");

//http codes 
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const UNPROCESSABLE_CONTENT = 422;
const SERVER_ERR = 500;

//tem que verificar se o client da venda é o mesmo que adiconou ao carrinho, tambem na verCarrinho
//verificar se a quantidade esta disponivel no estoque
//adicionar na tabela o campo reviwed: boolean
//verfiicar se o medicamento precisa de receita, colcoar true em approval se nao precisar

const insertIntoSales = `INSERT INTO sales (
    shopping_cart,
    date_time,
    payment_method,
    sale_total,
    client) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

const appendToSalesCart = `UPDATE sales SET shopping_cart = array_append(shopping_cart, $1) WHERE id = $2`;
const getSaleTotalQuery = `SELECT sale_total FROM sales WHERE id = $1`;
const updateSaleTotalQuery = `UPDATE sales SET sale_total = $1 WHERE id = $2`

const getMedPrice = `SELECT on_stock, unit_price FROM medications WHERE code = $1`;

const insertIntoCart_item = `INSERT INTO cart_item (
    medicine_code,
    sold_amount,
    item_total,
    approval_status
    ) VALUES($1, $2, $3, $4) RETURNING id`;

const deleteItemQuery = 'DELETE FROM cart_item WHERE id = $1';

async function updateSales(cartItem_id, item_total, sale_id){
    
    let currentSaleTotal = ( await dbPool.query( getSaleTotalQuery, [sale_id]) ).rows[0].sale_total;
    const new_sale_total = parseFloat(currentSaleTotal) + parseFloat(item_total)
    
    await dbPool.query( appendToSalesCart, [cartItem_id, sale_id]);
    await dbPool.query(updateSaleTotalQuery, [new_sale_total, sale_id]);
}

//if everything is fine retuns an obj with item total and its id
//else, it return and obj with a message
async function insertNewCart_item(medCode, item_qtd){
    let itemObj = {}

    const approval_status = false;

    let med_data = (await dbPool.query( getMedPrice, [medCode] ));
    if( !(med_data.rowCount > 0) ){
        itemObj = {message: "Medicamento não encontrado" };
        return itemObj;
    }
    if( !( med_data.rows[0].on_stock >= item_qtd ) ){
        itemObj = {message: "Quantidade indisponível no estoque!" };
        return itemObj;
    }

    const med_price = med_data.rows[0].unit_price
    let item_total = med_price * item_qtd;
    let cartItem_id = (await dbPool.query(insertIntoCart_item,[medCode, item_qtd, item_total, approval_status])).rows[0].id;

    itemObj = { id: cartItem_id, total: item_total }
    return itemObj;
}

async function deleteItem(item_id){
    await dbPool.query(deleteItemQuery, [item_id]);
}

//async function deleteSale(sale_id){
//  uma rota que recebe um client id, um sale id
//  e um parametro indiciando se deleta a venda inteira ou só os itens
//}

router.post('/adicionarAoCarrinho', async (req, res) => {
    try{
        res.header('Content-Type', 'application/json');
        const {sale_id, client_id, medCode, item_qtd } = req.body;
        const pay_method = "não_confirmada";

        if(client_id == undefined || client_id == ''){
            return res.status(UNAUTHORIZED).json( {message: "Usuario não logado!"} );
        }
        if(item_qtd == 0){
            return res.status(BAD_REQUEST).json( {message: "Quantidade do medicamento não informada!"} );
        }

    //cria um mnovo item de carrinho 
        const newItem = await insertNewCart_item(medCode, item_qtd);
        if(newItem.message){
            return res.status(BAD_REQUEST).json( {message: newItem.message} );
        }
        const cartItem_id = newItem.id
        const item_total = newItem.total;
        
    //busca a venda no banco pelo id
        let sellExists = {};
        if(sale_id != "" && sale_id != null && sale_id != undefined){
            sellExists = ( await dbPool.query('SELECT client FROM sales WHERE id = $1', [sale_id]) );
        }
        
    //se existir -> adicoina um novo item e retorna o id da venda
        if(sellExists.rowCount > 0 && sellExists.rows[0].client == client_id){
            await updateSales(cartItem_id, item_total, sale_id);
            res.status(CREATED).json( {'sale_id': sale_id} );
    
        }//caso a venda existe mas não pertence a esse client
        else if(sellExists.rowCount > 0 && sellExists.rows[0].client != client_id){
            deleteItem(cartItem_id);
            res.status(UNPROCESSABLE_CONTENT).json( {message: "O carrinho não pertence a este usuário"} );

        }//caso não exista, cria uma e retorna seu id
        else{
            const new_sale_id = (await dbPool.query( insertIntoSales,
                [ [cartItem_id], new Date(), pay_method, item_total, client_id ]
            )).rows[0].id;

            res.status(CREATED).json( {'sale_id': new_sale_id} );
        }
    
    }catch(err){
        console.error('Erro na rota /adicionarAoCarrinho', err);
        res.status(SERVER_ERR).send('Erro ao inserir no carrinho. Verifique o log.');
    }
});

router.post('/verCarrinho', async (req, res) => {
    //verifica client id e essas coisas
    //se tem itens, se tem carrinho, tu sabes
    res.header('Content-Type', 'application/json');
    try{
        const {sale_id, client_id, operation, item_id} = req.body;

        const findSaleQuery = `SELECT * FROM sales WHERE id = $1 AND client = $2`;
        const findItemsQuery = `SELECT * FROM cart_item WHERE id = $1`;
       if(!client_id){
            return res.status(UNAUTHORIZED).json( {message: "Usuairo deve estar logado!"} );
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

        if (operation == true && item_id) {
            const item_total = (await dbPool.query(getSaleTotalQuery, [item_id])).rows[0].item_total;

            await deleteItem(item_id);

            let SaleTotal = parseFloat(sale.rows[0].sale_total);
            const NewTotal = SaleTotal - parseFloat(item_total);

            // Atualiza o array do shopping_cart removendo o item_id deletado
            const updated_cart = sale.rows[0].shopping_cart.filter(id => id !== item_id);
            await dbPool.query(`UPDATE sales SET shopping_cart = $1, sale_total = $2 WHERE id = $3`, [updated_cart, NewTotal, sale_id]);
        }

        let data = {
            'id': sale.rows[0].id,
            'date_time': sale.rows[0].date_time,
            'pay_method': sale.rows[0].payment_method,
            'total': sale.rows[0].sale_total,
            'shopping_cart': shopping_cart
        }

        res.status(OK).json( { data } );

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