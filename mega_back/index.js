//basic
//require('dotenv').config();
const path = require('path');
const cors = require("cors");

const {app, express} = require('./expressApp');

const { setupDatabase } = require('./usefulScripts/setDbStuff');
setupDatabase();

const basicRoutes = require("./routes/tests.js");
const userRoutes = require("./routes/users.js");
const medicineRoutes = require("./routes/medicines.js");
const salesReport = require("./routes/salesReport.js");

//sales operations (finish sale, add/remove from cart, see it)
const addToCart = require("./routes/salesAndCart/addToCart.js");
const deleteSale = require("./routes/salesAndCart/delSaleOrItem.js");
const finishSale = require("./routes/salesAndCart/finishSale.js");
const seeCart = require("./routes/salesAndCart/seeCart.js");

app.use("/", basicRoutes);
app.use("/", userRoutes);
app.use("/", medicineRoutes);
app.use("/", salesReport);

app.use("/", addToCart);
app.use("/", deleteSale);
app.use("/", finishSale);
app.use("/", seeCart);

const dbPool = require('./dbConnection');
app.get('/', async (req, res) => {
    try {
        await dbPool.query('CREATE TABLE IF NOT EXISTS testes (id SERIAL PRIMARY KEY, nome VARCHAR(100), idade INT)');
        res.sendFile(path.join(__dirname, 'public', 'testes.html'));
    } catch (error) {
        console.error('Erro na rota /:', error.message);
        res.status(SERVER_ERR).send('Erro ao criar tabela. Veirfique o log.');
    }
});

//ouvirodira
const HOST = '0.0.0.0';
const PORT = 3000; //container port
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});