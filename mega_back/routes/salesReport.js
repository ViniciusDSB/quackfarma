const {app, express} = require('../expressApp');
const router = express.Router();
const path = require("path");
const cors = require("cors");

const fs = require("fs");
const PDF = require("pdfkit");
const report = new PDF();

const dbPool = require('../dbConnection');
const { DEFAULT_MESSAGE } = require("../myClasses");
const { BADFAMILY } = require('dns');

//http codes 
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;


const getSalesQuery = `SELECT * FROM sales WHERE date_time >= $1 AND date_time <= $2`;
const getShoppingCartQuery = `SELECT * FROM cart_item WHERE sale_id = $1`;
const getAdmQuery = `SELECT name, email FROM managers WHERE id = $1`;
const report_filePath = `../public/tmp/report.pdf`;
//recbe duas datas
//busca todas as veendas desse periodo
//guarda em obj
//guuarda num obj
//escrvee documento
//salva em pdf
//retorna o arqiuvo ao endpoint

function formatDate(dateToFormat){
    const formattedDate = new Date(dateToFormat).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return formattedDate;
}

async function fullRelatoryData(start_date, end_date){

    try{

        let data = [];

        const allSalesData = ( await dbPool.query(getSalesQuery, [start_date, end_date]) ).rows;
        if(allSalesData.rowCount == 0)
                return {error: "Nenhuma venda realizada no período solicitado.", code: 1}

        for(sale of allSalesData){
            let saleData = {};
            let shopping_cart = [];

            shopping_cart = ( await dbPool.query(getShoppingCartQuery, [sale.id]) ).rows;
            saleData = {
                'id': sale.id,
                'date_time': sale.date_time,
                'pay_method': sale.payment_method,
                'total': sale.sale_total,
                'shopping_cart': shopping_cart
            }

            data.push(saleData);
        }

        return data;

    }catch(err){
        return {error: err, code: 2}
    }

}


function generateReportPdf(data, title, start_date, end_date, adminName, adminEmail) {
    const doc = new PDF();
    // Save the PDF to a file
    const filePath = path.join(__dirname, report_filePath);
    doc.pipe(fs.createWriteStream(filePath));
  
    // Title
    doc.fontSize(18).text(title, { align: 'center' });
    doc.moveDown();

    // Dates and Admin Info
    doc.fontSize(12).text(`PERIODO: DE ${formatDate(start_date)} À ${formatDate(end_date)}`); 
    doc.fontSize(12).text(`EMISSOR DO RELATÓRIO: ${adminName}; EMAIL: ${adminEmail}`);
    doc.moveDown();
  
    // Iterate through the data array
    data.forEach((salesData) => {
        const shoppingCart = salesData.shopping_cart;
        doc.fontSize(12).text(`---------------------------------------------------------------------------------------------------`);
        doc.fontSize(12).text(`ID DA VENDA: ${salesData.id}`);
        doc.fontSize(10).text(`DATA: ${formatDate(salesData.date_time)}`);
        doc.fontSize(10).text(`MÉTODO DE PAGAMENTO: ${salesData.pay_method}`);
        doc.fontSize(10).text(`TOTAL: R$ ${salesData.total}`);
        doc.moveDown();

        // Shopping Cart Items
        doc.fontSize(12).text('PRODUTOS DO CARRINHO:');
        shoppingCart.forEach((item) => {
            doc.fontSize(10).text(`ID DO ITEM: ${item.id}`);
            doc.fontSize(10).text(`CÓDIGO DO MEDICAMENTO: ${item.medicine_code}`);
            doc.fontSize(10).text(`QUANTIDADE VENDIDA: ${item.sold_amount}`);
            doc.fontSize(10).text(`TOTAL DO ITEM: R$${item.item_total}`);
            doc.fontSize(10).text(`STATUS DE APROVAÇÃO: ${item.approval_status}`);
            //doc.fontSize(10).text(`Recipe Path: ${item.recipe_path || 'N/A'}`);
            //doc.fontSize(10).text(`Sale ID: ${item.sale_id}`);
            doc.moveDown();
        });
        
        doc.moveDown();
        //doc.addPage(); // New page for the next sale
    });
  
    doc.end();
}

router.post("/gerarRelatorio", async (req, res) => {

    try{
        let { admin_id, start_date, end_date } = req.body;
        //busca o adm e veirfica se existe
        const adminData = await dbPool.query(getAdmQuery, [admin_id]);
        if(adminData.rowCount == 0)
            return res.status(UNAUTHORIZED).json({ message: "Usuáiro não autorizado!" });

        const { name, email } = adminData.rows[0];

        //verifica se recebeu data de inicio
        if(!start_date)
            return res.status(BAD_REQUEST).json({ message: "Perido não informado! Informe no mínimo perido de ínicio." });
        if(!end_date)
                end_date = start_date;

        start_date = new Date(start_date);
        end_date = new Date(end_date);
        end_date.setDate(end_date.getDate() + 1);

        const data = await fullRelatoryData(start_date, end_date);

        if(data.error){
            console.log(data.error);
            res.status(NOT_FOUND).json( 
                {message: `Erro ao gerar relatorio! ${
                    (data.code == 1) ? data.error : ""
                }`}
            );
        }

        generateReportPdf(data, "Relatorio de Vendas", start_date, end_date, name, email);

        res.setHeader('Content-Type', 'application/pdf');
        let reportFile = path.join(__dirname, report_filePath);

        res.status(OK).download(reportFile)


    }catch(err){
        console.error('Erro na rota /gerarRelatorio', err);
        res.status(SERVER_ERR).send('Erro ao tentar gerar relatorio. verifique o log!');
    }

})

/*
salesData = [
  {id, data, total, ...},
  {id, data, total, ...},
  {id, data, total, ...}
]
shopping cart = [
    {id, qtd, item_total ...},
    {id, qtd, item_total ...}},
    {id, qtd, item_total ...}
]
data =[
    {
        salesData[0] ,
        shopping cart[...]
    },
    {
        saleSData[1] ,
        shopping cart[...]
    }
]
*/
module.exports = router;