const dbPool = require('../dbConnection');
async function setMedicines(){

/*  await dbPool.query(`CREATE TABLE IF NOT EXISTS medicines(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        needs_recipe BOOLEAN NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        on_stock INTEGER NOT NULL,
        manager INTEGER REFERENCES managers(id),
        created_at TIMESTAMP,
        last_update TIMESTAMP)`); 
    */

    const isDataSaved = (await dbPool.query('SELECT EXISTS (SELECT 1 FROM medicines WHERE name = $1)', ['Amoxicilina'])).rows[0].exists ;
    if(!isDataSaved){
        await dbPool.query(
            'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            ['Ibuprofeno', 'Usado para reduzir febre e aliviar dores.', false, 8.49, 150, 1, new Date(), new Date()]
        );
        await dbPool.query(
            'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            ['Amoxicilina', 'Antibiótico usado para tratar infecções bacterianas.', true, 25.75, 75, 1, new Date(), new Date()]
        );
        await dbPool.query(
            'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            ['Loratadina', 'Antialérgico utilizado para tratar sintomas de alergia.', false, 15.00, 200, 1, new Date(), new Date()]
        );
        await dbPool.query(
            'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            ['Dipirona', 'Usado para aliviar dor e reduzir febre.', false, 10.50, 120, 1, new Date(), new Date()]
        );
        await dbPool.query(
            'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            ['Metformina', 'Utilizado no tratamento de diabetes tipo 2.', true, 30.00, 90, 1, new Date(), new Date()]
        );
    }else{
        console.log('Alredy saved');
    }
    
}

module.exports = { setMedicines };