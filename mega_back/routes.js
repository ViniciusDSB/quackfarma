const {app, express} = require('./expressApp');
const router = express.Router();

const path = require('path');

//database, pg pool (located at ./dbConnection.js)
const dbPool = require('./dbConnection');

const{ Login, User , UserManager, UserClient , defaultStatus} = require("./myClasses");

/*
rotas existentes e seus campos{
    /fazerLogin: email, password
    /cadastrarAdm: name, email, senha
    /cadastrarCli: name, cpf, email, password, rg, address, phone
}
*/

const sha256 = require('js-sha256');
router.post('/fazerLogin', async (req, res) => {
    const login = new Login(
        req.body.email,
        req.body.password
    );
    login.validateData();

    if(login.status != defaultStatus){
        //melhora pra buscar nos dois bancos, clientes e adm
        //talvez tenha que mudar de query para client
    }else{
        const queryResult = await dbPool.query('SELECT EXISTS (SELECT 1 FROM managers WHERE email = $1)', [login.email]);
        if(queryResult.rows[0].exists){
            const queryResult = await dbPool.query('SELECT password_hash FROM managers WHERE email = $1', [login.email]);
            passHash = sha256(`${login.password}`);
            if(passHash == queryResult.rows[0].password_hash){
                res.send("Login perfeito!")
            }else{
                res.send("Deu merda!");
            }
        }else{
            res.send("Usuario não existe!")
        }
    }
    

    //prototype of validation
    if(login.status){
        res.send("Teste funcionou " + login.email);
    }else{
        res.send("Teste falhou, veja o log");
    }

})

router.post('/cadastrarAdm', async (req, res) => {
try{
    const manager = new UserManager(
        req.body.name,
        req.body.email,
        req.body.password
    );
    manager.validateData();

    if(manager.status != defaultStatus){
        res.send("Erro ao cadastrar admnistrador: " + manager.status);
    }else{
        manager_password = sha256(`${manager.password}`);
        await dbPool.query(
            'INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3)', 
            [manager.name, manager.email, manager_password]
        )
        res.send("Teste funcionou " + manager.name + "! <br>" + manager_password);
    }

}catch(err){
    console.error('Erro na rota /cadastrarAdm', err);
    res.status(500).send('Erro ao cadastrar administrador. Veirfique o log.');
}
})

router.post("/cadastrarCli", async (req, res) => {
    try{
        const user = new UserClient(
            req.body.name,
            req.body.cpf,
            req.body.email,
            req.body.password,
            req.body.rg,
            req.body.address,
            req.body.phone
        );
        user.validateData();
    
        if(user.status != defaultStatus){
            res.send("Teste falhou, veja o log");
        }else{
            res.send("Teste funcionou " + user.address + "!");
        }
    }catch(err){
        console.error('Erro na rota /cadastrarCli', err.message);
        res.status(500).send('Erro ao cadastrar cliente. Veirfique o log.');
    }
    
})

router.post('/sendQuery', async (req, res) => {
    const userQuery = req.body.theQuery;
    try {
        const queryResult = await dbPool.query(userQuery);
        res.send(queryResult);
    } catch (error) {
        console.error('Erro na rota /:', error.message);
        res.status(500).send('Erro ao criar tabela. Veirfique o log.');
    }
});

router.get('/', async (req, res) => {
    try {
        await dbPool.query('CREATE TABLE IF NOT EXISTS testes (id SERIAL PRIMARY KEY, nome VARCHAR(100), idade INT)');
        res.sendFile(path.join(__dirname, 'public', 'testes.html'));
    } catch (error) {
        console.error('Erro na rota /:', error.message);
        res.status(500).send('Erro ao criar tabela. Veirfique o log.');
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