//recbe duas datas
//busca todas as veendas desse periodo
//guarda em obj
//guuarda num obj
//escrvee documento
//salva em pdf
//retorna o arqiuvo ao endpoint

const fs = require("fs");
const PDF = reqiure("pdfkit");
const report = new PDF();

const getSalesQuery = `SELECT * FROM sales WHERE date_time BETWEEN $1 AND $2`;
const getShoppingCartQuery = `SELECT * FROM cart_item WHERE sale_id = $1`;

router.post("/gerarRelatorio", async(req, res) => {

    const { admin_id, start_date, end_date } = req.body;

    //busca o adm e veirfica se existe

    const salesData = ( await dbPool.query(getSalesQuery, [start_date, end_date]) ).rows;
    let shopping_cart = [];

    for(saleId of salesData.rows){

        shopping_cart.push (
            await dbPool.query(getShoppingCartQuery, [saleId])
        ).rows
    }


})