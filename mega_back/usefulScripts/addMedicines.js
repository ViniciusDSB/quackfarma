const dbPool = require('./dbConnection');
async function setMedicines(){

    
    
    console.log("Starting");
    await dbPool.query(
        'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        ['Ibuprofeno', 'Usado para reduzir febre e aliviar dores.', false, 8.49, 150, 1, new Date(), new Date()]
    );console.log("added");
    await dbPool.query(
        'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        ['Amoxicilina', 'Antibiótico usado para tratar infecções bacterianas.', true, 25.75, 75, 1, new Date(), new Date()]
    );console.log("added");
    await dbPool.query(
        'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        ['Loratadina', 'Antialérgico utilizado para tratar sintomas de alergia.', false, 15.00, 200, 1, new Date(), new Date()]
    );console.log("added");
    await dbPool.query(
        'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        ['Dipirona', 'Usado para aliviar dor e reduzir febre.', false, 10.50, 120, 1, new Date(), new Date()]
    );
    await dbPool.query(
        'INSERT INTO medicines (name, description, needs_recipe, unit_price, on_stock, manager, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        ['Metformina', 'Utilizado no tratamento de diabetes tipo 2.', true, 30.00, 90, 1, new Date(), new Date()]
    );console.log("done");
}