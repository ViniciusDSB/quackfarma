const {app, express} = require('../expressApp');
const router = express.Router();
const multer = require('multer');

const dbPool = require('../dbConnection');
const {Medicine, DEFAULT_MESSAGE} = require("../myClasses");
const { search } = require('./users');

//http codes 
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const ACCEPTED_ADM = 209;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const SERVER_ERR = 500;



const uploadMedImages = multer( {dest: './public/uploads/medicines_images/'} );
router.post("/cadastrarMedicamento", uploadMedImages.single('imageFile'), async (req, res) => {
    try{

    const medImage = req.file;
    if(!medImage)
        return res.status(BAD_REQUEST).json( {'message': 'Campo de imagem não fora preenchido!'});
    
    if(!/^image/.test(medImage.mimetype))
        return res.status(BAD_REQUEST).json( {'message': 'O arquivo não é uma imagem!'});
    
    const imageUrl = `http://localhost:3001/uploads/medicines_images/${medImage.filename}`;
    
    const needsRecipe = req.body.needsRecipe? true : false;
    const medicine = new Medicine(
        req.body.medName,
        req.body.medCode,
        req.body.medCategory,
        req.body.medDescription,
        req.body.medUnitPrice,
        req.body.amountOnStock,
        req.body.managerWhoAdded,
        imageUrl,
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
               
        res.status(CREATED).json( {'message': 'Medicamento adicionado ao estoque!'} );
    }else{
        res.status(BAD_REQUEST).json( {'message': medicine.status} );
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
        console.error('Erro na rota /cadastrarMedicamento', err);
        res.status(SERVER_ERR).send('Erro ao cadastrar medicamento. Veirfique o log.');
    }
}
});

class MedicineFinder{

    static async getMedicines(req, res){
        try{
            const { 
                medName, 
                medCode, 
                medCategory, 
                medDescription, 
                medUnitPrice, 
                amountOnStock, 
                managerWhoAdded, 
                imagePath, 
                created_at, 
                last_update 
            } = req.query;
            const needsRecipe = (req.query.needsRecipe == 'on' || req.query.needsRecipe == true ) ? true : 
            ( req.query.needsRecipe == undefined) ? undefined : false;
            
            let searchQuery = ``;
            if(req.query.fields){
                const fields = req.query.fields;

                searchQuery= `SELECT ${fields} FROM medications WHERE 1=1`;
            }else{
                searchQuery = `SELECT * FROM medications WHERE 1=1`;
            }
            
            const medData = new Medicine( medName, medCode, medCategory, medDescription, medUnitPrice, amountOnStock, managerWhoAdded, imagePath, needsRecipe, created_at, last_update );
            
            let  queryValues = [];

            let paramCount = 0;
            Object.keys(medData).forEach(key => {
                if(medData[key] != null){
                    paramCount+=1;
                    searchQuery += ` AND ${key} = $${paramCount}`;
                    queryValues.push(medData[key]);
                }
            })

            const data = await dbPool.query(searchQuery, queryValues);
            if(data.rowCount > 0){
                res.setHeader('Content-Type', 'application/json');
                res.status(OK).json(data.rows);
            }else{
                res.setHeader('Content-Type', 'application/json');
                res.status(NOT_FOUND).json({message: "Nenhum medicamento encontrado :("});
            }
    
        }catch(err){
            console.error('Erro na rota /medicamento', err);
            res.setHeader('Content-Type', 'application/json');
            res.status(SERVER_ERR).send('Erro ao mostrar produto. Verifique o log.');
        }
    }
    
}

router.get('/medicamento', MedicineFinder.getMedicines);

module.exports = router