const dbPool = require('../dbConnection');
const sha256 = require('js-sha256');

async function setGodUser(){
  await dbPool.query( `CREATE TABLE IF NOT EXISTS managers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(64) NOT NULL 
    )`)
    
  const isDataSaved = (await dbPool.query('SELECT EXISTS (SELECT 1 FROM managers WHERE email = $1)', ['goduser@gmail.com'])).rows[0].exists
  if(!isDataSaved){
    await dbPool.query(`INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3)`,
      ['goduser', 'goduser@gmail.com', sha256(`A.b1234`)]
    )
    console.log("God-user set as email: goduser@gamil.com; password: A.b1234");
  }else{
    console.log("God-user ok: email= goduser@gamil.com; password= A.b1234");
  }
  
}

async function setClientTable(){
  await dbPool.query('DROP TABLE IF EXISTS clients');
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
    console.log("Client table ok");
}

async function setMedications(){
    
    await dbPool.query('DROP TABLE IF EXISTS medicines');
    await dbPool.query(`CREATE TABLE IF NOT EXISTS medications(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code INTEGER NOT NULL UNIQUE,
        category VARCHAR(32) NOT NULL,
        description TEXT NOT NULL,
        needs_recipe BOOLEAN NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        on_stock INTEGER NOT NULL,
        manager INTEGER REFERENCES managers(id),
        image_path TEXT NOT NULL,
        created_at TIMESTAMP,
        last_update TIMESTAMP)`);

    const isDataSaved = (await dbPool.query('SELECT EXISTS (SELECT 1 FROM medications WHERE name = $1)', ['Paracetamol'])).rows[0].exists ;
    if(!isDataSaved){
        const imagePath = 'https://images-americanas.b2w.io/produtos/7469283329/imagens/losartana-hidroclorotiazida-50-12-5mg-30cp/7469283329_1_large.jpg';
        const managerId = 1
        const medications = [
            {
              name: 'Amoxicilina',
              code: 1001,
              category: 'Antibiótico',
              description: 'Antibiótico usado para tratar infecções bacterianas.',
              needs_recipe: true,
              unit_price: 25.75,
              on_stock: 75,
              image_path: imagePath,
              created_at: new Date(),
              last_update: new Date(),
            },
            {
              name: 'Paracetamol',
              code: 1002,
              category: 'Analgésico',
              description: 'Usado para aliviar dores e reduzir febres.',
              needs_recipe: false,
              unit_price: 15.50,
              on_stock: 150,
              image_path: imagePath,
              created_at: new Date(),
              last_update: new Date(),
            },
            {
              name: 'Ibuprofeno',
              code: 1003,
              category: 'Anti-inflamatório',
              description: 'Usado para reduzir inflamações e aliviar a dor.',
              needs_recipe: true,
              unit_price: 18.00,
              on_stock: 120,
              image_path: imagePath,
              created_at: new Date(),
              last_update: new Date(),
            },
            {
              name: 'Omeprazol',
              code: 1004,
              category: 'Antiácido',
              description: 'Usado para tratar refluxo ácido e úlceras estomacais.',
              needs_recipe: true,
              unit_price: 22.30,
              on_stock: 95,
              image_path: imagePath,
              created_at: new Date(),
              last_update: new Date(),
            },
            {
              name: 'Loratadina',
              code: 1005,
              category: 'Antialérgico',
              description: 'Usado para aliviar sintomas de alergias.',
              needs_recipe: false,
              unit_price: 10.25,
              on_stock: 180,
              image_path: imagePath,
              created_at: new Date(),
              last_update: new Date(),
            },
            {
              name: 'Captopril',
              code: 1006,
              category: 'Anti-hipertensivo',
              description: 'Usado para tratar pressão alta.',
              needs_recipe: true,
              unit_price: 30.00,
              on_stock: 60,
              image_path: imagePath,
              created_at: new Date(),
              last_update: new Date(),
            },
        ];
      
        for (const med of medications) {
            await dbPool.query(
              'INSERT INTO medications (name, code, category, description, needs_recipe, unit_price, on_stock, manager, image_path, created_at, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
              [med.name, med.code, med.category, med.description, med.needs_recipe, med.unit_price, med.on_stock, managerId, med.image_path, med.created_at, med.last_update]
            );
        }
        console.log("Sample products ok");
    }else{
      console.log("Products ok");
    }
    
}

module.exports = { setGodUser , setClientTable, setMedications };