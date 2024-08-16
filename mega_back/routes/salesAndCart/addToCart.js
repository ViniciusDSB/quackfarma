// @ts-check
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

//localizada aqui temproariamente
const fs = require('fs');

function deleteFile(filePath){
    fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        } else {
          console.log('File deleted successfully!');
        }
      });
}

//const appendToSalesCart = ``;
//const getSaleTotalQuery = `SELECT sale_total FROM sales WHERE id = $1`;
const updateSaleTotalQuery = `UPDATE sales SET sale_total = sale_total + $1 WHERE id = $2`

const getMedData = `SELECT needs_recipe, on_stock, unit_price FROM medications WHERE code = $1`;

async function updateSales(item_total, sale_id){
    item_total = parseFloat(item_total);
    await dbPool.query(updateSaleTotalQuery, [item_total, sale_id]);
}

//if everything is fine retuns an obj with item total and its id
//else, it return and obj with a message
function validateUpload(recipe_file, needs_recipe){
    let recipeUrl = ``;
    //se precisa de receita  e não recebeu uma
    if(recipe_file == undefined && needs_recipe){
        return {'message': "Este edicamente precisa de receita"};
    }//se a receita tem arquivo inválido
    else if(
        recipe_file 
        && needs_recipe 
        && !/^image/.test(recipe_file.mimetype) 
        && recipe_file.mimetype !== 'application/pdf'
    ){
        deleteFile(`./public/uploads/recipes/${recipe_file.filename}`);    //ele sobe o qruqivo de qualquer jeito, isso aqui deleta o que veio
        return {'message': "O arquivo precisa ser uma imagem ou pdf"};
    }else{
        recipeUrl = `http://localhost:3001/uploads/recipes/${recipe_file.filename}`;
        return {'url': recipeUrl}
    } 
}

const insertIntoCart_item = `INSERT INTO cart_item (
    medicine_code,
    sold_amount,
    item_total,
    recipe_path,
    approval_status,
    sale_id
    ) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;

async function insertNewCart_item(sale_id, medCode, item_qtd, recipe_file){
    let itemObj = {}
    let approval_status = 'reprovada'; //can be: aprovada, revisando or reprovada

    let med_data = (await dbPool.query( getMedData, [medCode] ));
    //se o medicamento não existe
    if( med_data.rowCount == 0 ){
        itemObj = { message: "Medicamento não encontrado" };
        return itemObj;
    }//se não tem o suficient eno estoque
    if( !( med_data.rows[0].on_stock >= item_qtd ) ){
        itemObj = { message: "Quantidade indisponível no estoque!" };
        return itemObj;
    }

    //se precisa de receita verifica o upload de uma
    let recipeUrl = '';
    if(med_data.rows[0].needs_recipe){
        const recipeValidation = validateUpload(recipe_file, med_data.rows[0].needs_recipe);

        if(recipeValidation.message == undefined){
            approval_status = 'revisando';
            recipeUrl = recipeValidation.url;
        }else{
            itemObj = { message: recipeValidation.message };
            return itemObj;
        }
    }else{
        approval_status = 'aprovada';
    }
    
//calcula o preço do item e insere item no banco
    const med_price = med_data.rows[0].unit_price
    let item_total = med_price * item_qtd;

//insere no banco com todos os dados
    let cartItem_id = (await dbPool.query(insertIntoCart_item,
        [
            medCode, 
            item_qtd, 
            item_total, 
            recipeUrl, 
            approval_status, 
            sale_id
        ])).rows[0].id;

    itemObj = { id: cartItem_id, total: item_total }
    return itemObj;
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads/recipes/'); // Specify the directory where you want to save the files
    },
    filename: async (req, file, cb) => {
      const originalName = file.originalname;
      const extension = path.extname(originalName) || ''; // Get the original extension if it exists
  
      let finalExtension;
      finalExtension = extension || '.bin'; // Default to .bin if no extension found
  
      // Create the file name with the determined extension
      cb(null, path.basename(originalName, extension) + finalExtension);
    }
  });

const uploadRecipe = multer({ storage: storage });
router.post('/adicionarAoCarrinho', uploadRecipe.single('recipeFile'), async (req, res) => {
    try{
        res.header('Content-Type', 'application/json');
        
        const {sale_id, client_id, medCode, item_qtd } = req.body;
        const pay_method = "não_confirmada";
        const recipe_file = req.file; //guarda os dados do upload

        if(client_id == undefined || client_id == ''){
            return res.status(UNAUTHORIZED).json( {message: "Usuario não logado!"} );
        }
        if(medCode == undefined || medCode == ''){
            return res.status(UNAUTHORIZED).json( {message: "Código do medicamento deve ser informado!!"} );
        }
        if(item_qtd == 0 || item_qtd == undefined || item_qtd == ''){
            return res.status(BAD_REQUEST).json( {message: "Quantidade do medicamento não informada!"} );
        }
        
    //busca a venda no banco pelo id
        let sellExists = {}; 
        if(sale_id != "" && sale_id != null && sale_id != undefined){
            sellExists = ( await dbPool.query('SELECT client FROM sales WHERE id = $1', [sale_id]) );
        }
        
    //se a venda existir -> adicoina um novo item e retorna o id da venda
        if(sellExists.rowCount > 0 && sellExists.rows[0].client == client_id){
            const newItem = await insertNewCart_item(sale_id, medCode, item_qtd, recipe_file);

            if(newItem.message){
                return res.status(BAD_REQUEST).json( {message: newItem.message} );
            }else{
                await updateSales(newItem.total, sale_id);
                return res.status(CREATED).json( {'sale_id': sale_id} );
            }
    
        }//caso a venda exista mas não pertence a esse client
        else if(sellExists.rowCount > 0 && sellExists.rows[0].client != client_id){
            res.status(UNPROCESSABLE_CONTENT).json( {message: "O carrinho não pertence a este usuário"} );

        }//caso não exista, cria uma e retorna seu id
        else{
            const insertIntoSales = `INSERT INTO sales (
                date_time,
                payment_method,
                sale_total,
                client,
                status
                )VALUES ($1, $2, $3, $4, $5) RETURNING id`;

            const new_sale_id = (await dbPool.query( insertIntoSales,
                [ new Date(), pay_method, 0, client_id, false]
            )).rows[0].id;

            const newItem = await insertNewCart_item(new_sale_id, medCode, item_qtd, recipe_file);
            await updateSales(newItem.total, new_sale_id);
            res.status(CREATED).json( {'sale_id': new_sale_id} );
        }
    
    }catch(err){
        console.error('Erro na rota /adicionarAoCarrinho', err);
        res.status(SERVER_ERR).send('Erro ao inserir no carrinho. Verifique o log.');
    }
});

module.exports = router