const {app, express} = require('./expressApp');
const router = express.Router();
const sha256 = require('js-sha256');
const path = require('path');

//database, pg pool (located at ./dbConnection.js)
const dbPool = require('./dbConnection');
const { Login, User , UserManager, UserClient , DEFAULT_STATUS} = require("./myClasses");

router.get('/vitrine', async (req, res) => {

})

router.post('/fazerLogin', async (req, res) => {
    const login = new Login( req.body.email, req.body.password );
    login.validateData(); //apenas para validacao de formato, regex etc

    let loginRes= { email: login.email, name: "", status: "", exists: false } //o que vai ao front

    if(login.status != DEFAULT_STATUS){ //se tiver prroblma no formato dos dados de login
        loginResponse.status = login.status;
        res.json( loginRes);
    }else{//se o formato esta correto, verifica se existe no banco
        loginResponse.exists = (await dbPool.query('SELECT EXISTS (SELECT 1 FROM clients WHERE email = $1)', [login.email])).rows[0].exists;
        
        if(loginResponse.exists){//se existe

            const queryResult = await dbPool.query('SELECT name, password_hash FROM clients WHERE email = $1', [login.email]);

            if(sha256(`${login.password}`) == queryResult.rows[0].password_hash){//se senha esta correta
                loginResponse.name = queryResult.rows[0].name;
                loginResponse.status = DEFAULT_STATUS;
                res.json( loginRes);
            }else{//se senha esta incorreta
                loginResponse.status = "Senha incorreta!";
                res.json( loginRes);
            }
        }else{//se nao xiste
            loginResponse.status = "Usuário não existe!";
            res.json( loginRes);
        }
    }

})

router.post('/cadastrarAdm', async (req, res) => {
    let newManagerRes = { email: "", name: "", status: "", alredyExists: false }
try{
    await dbPool.query( ' CREATE TABLE IF NOT EXISTS managers ( id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(64) NOT NULL )' )
    
    const manager = new UserManager(
        req.body.name,
        req.body.email,
        req.body.password
    );
    manager.validateData();

    if(manager.status != DEFAULT_STATUS){
        newManagerRes.status = manager.status;
        res.json( newManagerRes );
    }else{
        manager.password = sha256(`${manager.password}`);
        await dbPool.query(
            'INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3)', 
            [manager.name, manager.email, manager.password]
        )

        newManagerRes.email = manager.email;
        newManagerRes.name = manager.name;
        newManagerRes.status = DEFAULT_STATUS;
        res.send( newManagerRes );
    }

}catch(err){

    if(err.code === '23505'){
        const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        if (match) {
            const key = match[1];
            const value = match[2];
            newManagerRes.status = `${key} ${value} já está em uso.`;
        }
        newManagerRes.alredyExists = true;
        res.json( newManagerRes );
    } 
    else{
        console.error('Erro na rota /cadastrarCli', err);
        res.status(500).send('Erro ao cadastrar cliente. Veirfique o log.');
    }
}
})

router.post("/cadastrarCli", async (req, res) => {
    let newClientRes = { email: "", name: "", status: "", alredyExists: false }
    try{

        await dbPool.query('CREATE TABLE IF NOT EXISTS clients ( id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, cpf VARCHAR(11) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(64) NOT NULL, rg VARCHAR(7), phone_number VARCHAR(14), address TEXT )');

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

        
        if(registration.status != DEFAULT_STATUS){//se deu erro no formato dos dados
            newClientRes.status = registration.status
            res.json( newClientRes );

        }else{//se os dados estao corretos, salva-os
            registration.password = sha256(`${registration.password}`)

            await dbPool.query(
                'INSERT INTO clients (name, cpf, email, password_hash, rg, phone_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [registration.name, registration.cpf, registration.email, registration.password, registration.rg, registration.phone, registration.address]    
            )

            newClientRes.email = registration.email;
            newClientRes.name = registration.name;
            newClientRes.status = DEFAULT_STATUS;
            res.json( newClientRes );

        }
    }catch(err){

        if(err.code === '23505'){
            const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            if (match) {
                const key = match[1];
                const value = match[2];
                newClientRes.status = `${key} ${value} já está em uso.`;
            }
            newClientRes.alredyExists = true;
            res.json( newClientRes );
        } 
        else{
            console.error('Erro na rota /cadastrarCli', err);
            res.status(500).send('Erro ao cadastrar cliente. Veirfique o log.');
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
        res.status(500).send('Erro ao criar tabela. Veirfique o log.');
    }
});

router.post('/sendQuery', async (req, res) => {
    const userQuery = req.body.theQuery;
    try {
        const queryResult = await dbPool.query(userQuery);
        res.send(queryResult);
    } catch (error) {
        console.error('Erro na rota /:', error);
        res.status(500).send('Erro na query. Veirfique o log.');
    }
});

router.post('/insert', async (req, res) => {
    const { nome, idade } = req.body;
    try {
        await dbPool.query('INSERT INTO testes (nome, idade) VALUES ($1, $2)', [nome, idade]);
        res.send('Usuário criado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /insert:', error.message);
        res.status(500).send('Erro ao criar usuário. Veirfique o log');
    }
});

router.get('/select', async (req, res) => {
    try {
        const resposta = await dbPool.query('SELECT * FROM testes');
        res.json(resposta.rows);
    } catch (error) {
        console.error('Erro na rota /select:', error.message);
        res.status(500).send('Erro ao buscar usuários. Veirfique o log');
    }
});

router.post('/update', async (req, res) => {
    const { nome, novoNome, idade } = req.body;
    try {
        await dbPool.query('UPDATE testes SET nome = $1, idade = $2 WHERE nome = $3', [novoNome, idade, nome]);
        res.send('Usuário atualizado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /update:', error.message);
        res.status(500).send('Erro ao atualizar usuário. Veirfique o log');
    }
});

router.post('/delete', async (req, res) => {
    const { nome } = req.body;
    try {
        await dbPool.query('DELETE FROM testes WHERE nome = $1', [nome]);
        res.send('Usuário deletado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /delete:', error.message);
        res.status(500).send('Erro ao deletar usuário. Veirfique o log');
    }
});

module.exports = router