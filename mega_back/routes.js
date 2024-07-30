const {app, express} = require('./expressApp');
const router = express.Router();
const sha256 = require('js-sha256');
const path = require('path');


//http codes 
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const SERVER_ERR = 500;

//database, pg pool (located at ./dbConnection.js)
const dbPool = require('./dbConnection');
const { Login, User , UserManager, UserClient , Medicine, DEFAULT_MESSAGE} = require("./myClasses");


router.post("/adicionarProduto", async (req, res) => {
    try{
        await dbPool.query(`CREATE TABLE IF NOT EXISTS medicines(
            id SERIAL PRIMARY KEY,
            cod INTEGER NOT NULL UNIQUE,
            category VARCHAR(32) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            needs_recipe BOOLEAN NOT NULL,
            unit_price NUMERIC(10, 2) NOT NULL,
            on_stock INTEGER NOT NULL,
            manager INTEGER REFERENCES managers(id),
            created_at TIMESTAMP,
            last_update TIMESTAMP)`);
            
        const needsRecipe = req.body.needsRecipe? true : false;
        const medicine = new Medicine(
            req.body.medName,
            req.body.medDescription,
            req.body.medUnitPrice,
            req.body.amountOnStock,
            req.body.managerWhoAdded,
            needsRecipe
        );
        medicine.validadeData();
    
        if(medicine.status === DEFAULT_MESSAGE){

            await dbPool.query(`INSERT INTO medicines (
                name, 
                description, 
                needs_recipe, 
                unit_price, 
                on_stock, 
                manager, 
                created_at,
                last_update)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [medicine.name,
                    medicine.description,
                    medicine.needsRecipe,
                    medicine.unitPrice,
                    medicine.stockAmount,
                    medicine.whoAdded, 
                    new Date(), new Date()
                ]);
                   
            res.status(OK).json( {'message': 'Medicamento adicionado ao estoque!'} );
        }else{
            res.status(BAD_REQUEST).json( {'message': medicine.status} );
        }

    }catch(err){
        console.error('Erro na rota /adicionarProduto', err);
        res.status(SERVER_ERR).send('Erro ao adicionar produto. Verifique o log.');
    }
})

router.get('/listarMedicamentos', async (req, res) => {
    try{

        const medicamentos = await dbPool.query(`SELECT 
            name, 
            description, 
            unit_price, 
            needs_recipe 
            FROM medicines`);
            
        res.status(OK).json( {'message': "OK", 'medicineList': medicamentos.rows} );

    }catch(err){
        console.error('Erro na rota /listarMedicamentos', err);
        res.status(SERVER_ERR).send('Erro ao encontrar produtos. Verifique o log.');
    }
})

router.get('/verMedicamento', async (req, res) => {
    try{
        const medicine = req.query.name;
        if(!medicine) {
            return res.status(400).send('Nome do medicamento é obrigatório.');
        }
        const busca = await dbPool.query('SELECT * FROM medicines WHERE name = $1', [medicine]);

        if(busca.rows.length > 0) {
            const remedio = busca.rows[0];
            res.json(remedio);
        }else{
            res.status(404).send('Medicamento não encontrado.');
        }
    }catch(err){
        console.error('Erro na rota /verMedicamento', err);
        res.status(SERVER_ERR).send('Erro ao listar produto. Verifique o log.');
    }
})

router.post('/fazerLogin', async (req, res) => {
    let loginRes= { message: "", email: "", name: "" };
try{
    const login = new Login( req.body.email, req.body.password );
    login.validateData(); //apenas para validacao de formato, regex etc

    if(login.status != DEFAULT_MESSAGE){ //se tiver prroblma no formato dos dados de login
        loginRes.message = login.status;
        res.status(BAD_REQUEST).json( loginRes );
    }else{

        //se existe
        if( (await dbPool.query('SELECT EXISTS (SELECT 1 FROM clients WHERE email = $1)', [login.email])).rows[0].exists ){
            loginRes.email = login.email;
            const queryResult = await dbPool.query('SELECT name, password_hash FROM clients WHERE email = $1', [login.email]);

            if(sha256(`${login.password}`) == queryResult.rows[0].password_hash){//se senha esta correta
                loginRes.name = queryResult.rows[0].name;
                loginRes.message = DEFAULT_MESSAGE;
                res.status(ACCEPTED).json( loginRes );
            }else{
                loginRes.message = "Senha incorreta!";
                res.status(UNAUTHORIZED).json( loginRes );
            }

        }else{
            loginRes.message = "Usuário não existe!";
            res.status(UNAUTHORIZED).json( loginRes);
        }
    }
}catch(err){
    console.error('Erro na rota /fazerLogin', err);
    res.status(SERVER_ERR).send('Erro fazer login. Veirfique o log.');
}

})

router.post('/cadastrarAdm', async (req, res) => {
    let newManagerRes = { message: "", email: "", name: "" }
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
        newManagerRes.message = manager.status;
        res.status(BAD_REQUEST).json( newManagerRes );
    }else{
        manager.password = sha256(`${manager.password}`);
        await dbPool.query(
            'INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3)', 
            [manager.name, manager.email, manager.password]
        )

        newManagerRes.email = manager.email;
        newManagerRes.name = manager.name;
        newManagerRes.message = DEFAULT_MESSAGE;
        res.status(CREATED).json( newManagerRes );
    }

}catch(err){

    if(err.code === '23505'){
        const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        if (match) {
            const key = match[1];
            const value = match[2];
            newManagerRes.message = `${key} ${value} já está cadastrado.`;
        }
        res.status(UNAUTHORIZED).json( newManagerRes );
    } 
    else{
        console.error('Erro na rota /cadastrarCli', err);
        res.status(SERVER_ERR).send('Erro ao cadastrar administrador. Veirfique o log.');
    }
}
})

router.post("/cadastrarCli", async (req, res) => {
    let newClientRes = { message: "", email: "", name: "" };
    try{

        await dbPool.query(`CREATE TABLE IF NOT EXISTS clients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            cpf VARCHAR(11) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(64) NOT NULL,
            rg VARCHAR(7), phone_number VARCHAR(14),
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
            newClientRes.message = registration.status
            res.status(BAD_REQUEST).json( newClientRes );
        }else{
            registration.password = sha256(`${registration.password}`)

            await dbPool.query(
                `INSERT INTO clients (
                name,
                cpf,
                email,
                password_hash,
                rg, phone_number,
                address) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [registration.name,
                    registration.cpf,
                    registration.email,
                    registration.password,
                    registration.rg,
                    registration.phone,
                    registration.address
                ]    
            )

            newClientRes.email = registration.email;
            newClientRes.name = registration.name;
            newClientRes.message = DEFAULT_MESSAGE;
            res.status(CREATED).json( newClientRes );

        }
    }catch(err){

        if(err.code === '23505'){
            const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            if (match) {
                const key = match[1];
                const value = match[2];
                newClientRes.message = `${key} ${value} já está cadastrado.`;
            }
            res.status(UNAUTHORIZED).json( newClientRes );
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