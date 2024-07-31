const {app, express} = require('./expressApp');
const router = express.Router();
const sha256 = require('js-sha256');
const path = require('path');


//http codes 
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const ACCEPTED_ADM = 209;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

//database, pg pool (located at ./dbConnection.js)
const dbPool = require('./dbConnection');
const { Login, User , UserManager, UserClient , Medicine, DEFAULT_MESSAGE} = require("./myClasses");

router.get('/verMedicamento', async (req, res) => {
    try{
        const medicine_code = req.query.code;
        if(medicine_code) {
            const medicine_data = await dbPool.query('SELECT name, code, category, description, unit_price, needs_recipe, image_path, on_stock FROM medications WHERE code= $1', [medicine_code]);

            if(medicine_data.rows.length > 0) {
                res.status(OK).json({'message': DEFAULT_MESSAGE, 'medicineData': medicine_data .rows[0]});
            }else{
                res.status(NOT_FOUND).send({'message':'Medicamento não encontrado!'});
            }
        }else{
            res.status(BAD_REQUEST).json( { 'message': 'Erro ao processar requisição!'});
        }
        
    }catch(err){
        console.error('Erro na rota /verMedicamento', err);
        res.status(SERVER_ERR).send('Erro ao mostrar produto. Verifique o log.');
    }
})

router.get('/listarMedicamentos', async (req, res) => {
    try{

        const medicamentos = await dbPool.query(`SELECT 
            name,
            code,
            category,
            description,
            unit_price,
            image_path
            FROM medications`);
            
        res.status(OK).json( {'message': DEFAULT_MESSAGE, 'medicineList': medicamentos.rows} );

    }catch(err){

        console.error('Erro na rota /listarMedicamentos', err);
        res.status(SERVER_ERR).send('Erro ao encontrar produtos. Verifique o log.');
        
    }
})

router.post("/cadastrarMedicamento", async (req, res) => {
    try{
            
        const needsRecipe = req.body.needsRecipe? true : false;
        const medicine = new Medicine(
            req.body.medName,
            req.body.medCode,
            req.body.medCategory,
            req.body.medDescription,
            req.body.medUnitPrice,
            req.body.amountOnStock,
            req.body.managerWhoAdded,
            req.body.imagePath,
            needsRecipe
        );
        medicine.validadeData();
    
        if(medicine.status === DEFAULT_MESSAGE){

            await dbPool.query(`INSERT INTO medications (
                name,
                code,
                category,
                description, 
                needs_recipe, 
                unit_price, 
                on_stock, 
                manager,
                image_path,
                created_at,
                last_update)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [medicine.name,
                    medicine.code,
                    medicine.category,
                    medicine.description,
                    medicine.needsRecipe,
                    medicine.unitPrice,
                    medicine.amountOnStock,
                    medicine.managerWhoAdded,
                    medicine.imagePath,
                    new Date(), new Date()
                ]);
                   
            res.status(OK).json( {'message': 'Medicamento adicionado ao estoque!'} );
        }else{
            res.status(BAD_REQUEST).json( {'message': medicine.status} );
        }
    }catch(err){
        if(err.code === '23505'){
            const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            const key = "";
            const value= "";
            if (match) {
                key = match[1];
                value = match[2];
            }
            res.status(UNAUTHORIZED).json( { message: `${key} ${value} já está cadastrado.` } );
        } 
        else{
            console.error('Erro na rota /cadastrarMedicamento', err);
            res.status(SERVER_ERR).send('Erro ao cadastrar medicamento. Veirfique o log.');
        }
    }
})


router.post('/fazerLogin', async (req, res) => {
try{
    const login = new Login( req.body.email, req.body.password );
    login.validateData(); //apenas para validacao de formato, regex etc

    if(login.status === DEFAULT_MESSAGE){ 
        if( (await dbPool.query('SELECT EXISTS (SELECT 1 FROM clients WHERE email = $1)', [login.email])).rows[0].exists ){
            
            const queryResult = await dbPool.query('SELECT name, cpf, rg, phone_number, address, password_hash FROM clients WHERE email = $1', [login.email]);

            if(sha256(`${login.password}`) == queryResult.rows[0].password_hash){//se senha esta correta
                res.status(ACCEPTED).json( 
                    {   message: DEFAULT_MESSAGE, 
                        email: login.email, 
                        name: queryResult.rows[0].name, 
                        cpf: queryResult.rows[0].cpf, 
                        rg: queryResult.rows[0].rg, 
                        address: queryResult.rows[0].address, 
                        phone_number: queryResult.rows[0].phone_number, 
                        is_adm: false}
                );
            }else{ res.status(UNAUTHORIZED).json( {message: "Senha incorreta!" } ); }

        }else if((await dbPool.query('SELECT EXISTS (SELECT 1 FROM managers WHERE email = $1)', [login.email])).rows[0].exists){
            const queryResult = await dbPool.query('SELECT name, password_hash FROM managers WHERE email = $1', [login.email]);

            if(sha256(`${login.password}`) == queryResult.rows[0].password_hash){//se senha esta correta
                res.status(ACCEPTED_ADM).json( 
                    {   message: DEFAULT_MESSAGE, 
                        email: login.email, 
                        name: queryResult.rows[0].name,
                        is_adm: true
                    }
                );
            }else{ res.status(UNAUTHORIZED).json( {message: "Senha incorreta!" } ); }
        }else{
            res.status(NOT_FOUND).json( {message: "Usuário não existe!" } );
        }

    }else{
        res.status(BAD_REQUEST).json( {message: login.status } );
    }

}catch(err){
    console.error('Erro na rota /fazerLogin', err);
    res.status(SERVER_ERR).send('Erro fazer login. Veirfique o log.');
}

})

router.post('/cadastrarAdm', async (req, res) => {
try{
    await dbPool.query( `CREATE TABLE IF NOT EXISTS managers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(64) NOT NULL 
        )`)
    
    const manager = new UserManager(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.passwordRepeat
    );
    manager.validateData();

    if(manager.status != DEFAULT_MESSAGE){
        res.status(BAD_REQUEST).json( { message: manager.status } );
    }else{
        manager.password = sha256(`${manager.password}`);
        await dbPool.query(
            'INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3)', 
            [manager.name, manager.email, manager.password]
        )
        res.status(CREATED).json( { message: DEFAULT_MESSAGE } );
    }

}catch(err){

    if(err.code === '23505'){
        const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        const key = "";
        const value= "";
        if (match) {
            key = match[1];
            value = match[2];
        }
        res.status(UNAUTHORIZED).json( { message: `${key} ${value} já está cadastrado.` } );
    } 
    else{
        console.error('Erro na rota /cadastrarCli', err);
        res.status(SERVER_ERR).send('Erro ao cadastrar cliente. Veirfique o log.');
    }
}
})

router.post("/cadastrarCli", async (req, res) => {
    try{

        await dbPool.query(`CREATE TABLE IF NOT EXISTS client (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            cpf VARCHAR(11) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(64) NOT NULL,
            rg VARCHAR(7),
            phone_number VARCHAR(14),
            address TEXT 
            )`);

        const registration = new UserClient(
            req.body.name,
            req.body.cpf,
            req.body.email,
            req.body.password,
            req.body.passwordRepeat,
            req.body.rg,
            req.body.address,
            req.body.phone
        );
        registration.validateData();

        
        if(registration.status != DEFAULT_MESSAGE){//se deu erro no formato dos dados
            res.status(BAD_REQUEST).json( { message: registration.status } );
        }else{
            registration.password = sha256(`${registration.password}`);

            await dbPool.query(
                `INSERT INTO client (
                name,
                cpf,
                email,
                password_hash,
                rg,
                phone_number,
                address) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [   registration.name,
                    registration.cpf,
                    registration.email,
                    registration.password,
                    registration.rg,
                    registration.phone,
                    registration.address
                ]    
            )
            res.status(CREATED).json( { message: DEFAULT_MESSAGE } );

        }
    }catch(err){

        if(err.code === '23505'){
            const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            const key = "";
            const value= "";
            if (match) {
                key = match[1];
                value = match[2];
            }
            res.status(UNAUTHORIZED).json( { message: `${key} ${value} já está cadastrado.` } );
        } 
        else{
            console.error('Erro na rota /cadastrarCli', err);
            res.status(SERVER_ERR).send('Erro ao cadastrar cliente. Veirfique o log.');
        }
 
    }
    
})


//tests Only
router.get('/', async (req, res) => {
    try {
        await dbPool.query('CREATE TABLE IF NOT EXISTS testes (id SERIAL PRIMARY KEY, nome VARCHAR(100), idade INT)');
        res.sendFile(path.join(__dirname, 'public', 'testes.html'));
    } catch (error) {
        console.error('Erro na rota /:', error.message);
        res.status(SERVER_ERR).send('Erro ao criar tabela. Veirfique o log.');
    }
});

router.post('/sendQuery', async (req, res) => {
    const userQuery = req.body.theQuery;
    try {
        const queryResult = await dbPool.query(userQuery);
        res.send(queryResult);
    } catch (error) {
        console.error('Erro na rota /:', error);
        res.status(SERVER_ERR).send('Erro na query. Veirfique o log.');
    }
});

router.post('/insert', async (req, res) => {
    const { nome, idade } = req.body;
    try {
        await dbPool.query('INSERT INTO testes (nome, idade) VALUES ($1, $2)', [nome, idade]);
        res.send('Usuário criado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /insert:', error.message);
        res.status(SERVER_ERR).send('Erro ao criar usuário. Veirfique o log');
    }
});

router.get('/select', async (req, res) => {
    try {
        const resposta = await dbPool.query('SELECT * FROM testes');
        res.json(resposta.rows);
    } catch (error) {
        console.error('Erro na rota /select:', error.message);
        res.status(SERVER_ERR).send('Erro ao buscar usuários. Veirfique o log');
    }
});

router.post('/update', async (req, res) => {
    const { nome, novoNome, idade } = req.body;
    try {
        await dbPool.query('UPDATE testes SET nome = $1, idade = $2 WHERE nome = $3', [novoNome, idade, nome]);
        res.send('Usuário atualizado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /update:', error.message);
        res.status(SERVER_ERR).send('Erro ao atualizar usuário. Veirfique o log');
    }
});

router.post('/delete', async (req, res) => {
    const { nome } = req.body;
    try {
        await dbPool.query('DELETE FROM testes WHERE nome = $1', [nome]);
        res.send('Usuário deletado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /delete:', error.message);
        res.status(SERVER_ERR).send('Erro ao deletar usuário. Veirfique o log');
    }
});

module.exports = router