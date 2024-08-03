const {app, express} = require('../expressApp');
const router = express.Router();

const dbPool = require('../dbConnection');

//http codes 
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const ACCEPTED_ADM = 209;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;

router.post('/sendQuery', async (req, res) => {
    const userQuery = req.body.theQuery;
    try {
        const queryResult = await dbPool.query(userQuery);
        res.status(OK).json(queryResult);
    } catch (error) {
        console.error('Erro na rota /:', error);
        res.status(SERVER_ERR).send('Erro na query. Veirfique o log.');
    }
});

router.post('/insert', async (req, res) => {
    const { nome, idade } = req.body;
    try {
        await dbPool.query('INSERT INTO testes (nome, idade) VALUES ($1, $2)', [nome, idade]);
        res.status(OK).send('Usuário criado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /insert:', error.message);
        res.status(SERVER_ERR).send('Erro ao criar usuário. Veirfique o log');
    }
});

router.get('/select', async (req, res) => {
    try {
        const resposta = await dbPool.query('SELECT * FROM testes');
        res.status(OK).json(resposta.rows);
    } catch (error) {
        console.error('Erro na rota /select:', error.message);
        res.status(SERVER_ERR).send('Erro ao buscar usuários. Veirfique o log');
    }
});

router.post('/update', async (req, res) => {
    const { nome, novoNome, idade } = req.body;
    try {
        await dbPool.query('UPDATE testes SET nome = $1, idade = $2 WHERE nome = $3', [novoNome, idade, nome]);
        res.status(OK).send('Usuário atualizado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /update:', error.message);
        res.status(SERVER_ERR).send('Erro ao atualizar usuário. Veirfique o log');
    }
});

router.post('/delete', async (req, res) => {
    const { nome } = req.body;
    try {
        await dbPool.query('DELETE FROM testes WHERE nome = $1', [nome]);
        res.status(OK).send('Usuário deletado com sucesso!');
    } catch (error) {
        console.error('Erro na rota /delete:', error.message);
        res.status(SERVER_ERR).send('Erro ao deletar usuário. Veirfique o log');
    }
});

module.exports = router