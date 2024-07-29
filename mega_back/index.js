//basic
//require('dotenv').config();
const path = require('path');
const cors = require("cors");

const {app, express} = require('./expressApp');

const basicRoutes = require("./routes");

app.use("/", basicRoutes);

//ouvirodira
const HOST = '0.0.0.0';
const PORT = 3000; //container port
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});