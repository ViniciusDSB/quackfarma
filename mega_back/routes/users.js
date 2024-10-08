const {app, express} = require('../expressApp');
const router = express.Router();
const sha256 = require('js-sha256');

const dbPool = require('../dbConnection');
const { Login,  UserManager, UserClient , DEFAULT_MESSAGE} = require("../myClasses");

//http codes 
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const ACCEPTED_ADM = 209;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;


router.post('/fazerLogin', async (req, res) => {
    try{
        res.header('Content-Type', 'application/json');
        
        const login = new Login( req.body.email, req.body.password );
        login.validateData(); //apenas para validacao de formato, regex etc
    
        if(login.status === DEFAULT_MESSAGE){ 
            if( (await dbPool.query('SELECT EXISTS (SELECT 1 FROM client WHERE email = $1)', [login.email])).rows[0].exists ){

                const clientDataQuery = 'SELECT id, name, cpf, rg, phone_number, address, password_hash FROM client WHERE email = $1';
                const getUserSaleId = 'SELECT id FROM sales WHERE client = $1';

                const clientData = await dbPool.query(clientDataQuery, [login.email]);
                
                let sale_id = ( await dbPool.query(getUserSaleId, [clientData.rows[0].id]) );
                if(sale_id.rowCount == 0)
                        sale_id = null;
                else
                    sale_id = sale_id.rows[0].id;
                
                if(sha256(`${login.password}`) == clientData.rows[0].password_hash){//se senha esta correta
                    res.status(ACCEPTED).json( {
                            id: clientData.rows[0].id,
                            email: login.email,
                            name: clientData.rows[0].name,
                            cpf: clientData.rows[0].cpf,
                            rg: clientData.rows[0].rg,
                            address: clientData.rows[0].address,
                            phone_number: clientData.rows[0].phone_number,
                            sale_id:  sale_id,
                            is_adm: false
                        }
                    );
                }else{ res.status(UNAUTHORIZED).json( {message: "Senha incorreta!" } ); }
    
            }else if((await dbPool.query('SELECT EXISTS (SELECT 1 FROM managers WHERE email = $1)', [login.email])).rows[0].exists){
                const clientData = await dbPool.query('SELECT id, name, password_hash FROM managers WHERE email = $1', [login.email]);
    
                if(sha256(`${login.password}`) == clientData.rows[0].password_hash){//se senha esta correta
                    res.status(ACCEPTED_ADM).json( {   
                            id: clientData.rows[0].id,
                            email: login.email, 
                            name: clientData.rows[0].name,
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
    
    });
    
router.post('/cadastrarAdm', async (req, res) => {
try{
    res.header('Content-Type', 'application/json');

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
        res.status(CREATED).send();
    }

}catch(err){

    if(err.code === '23505'){
        const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        let key = "";
        let value= "";
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
        res.header('Content-Type', 'application/json');

        console.log("requested");
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
            res.status(CREATED).send();

        }
    }catch(err){

        if(err.code === '23505'){
            const match = err.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            let key = "";
            let value= "";
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

module.exports = router