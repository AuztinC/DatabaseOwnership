const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/thing_tracker');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json())

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));


app.put('/api/things/:id', async(req,res,next)=>{
  try {
    const SQL = `
    UPDATE things
    SET name = $1, user_id = $2
    WHERE id = $3
    RETURNING *
    `;
    const response = await client.query(SQL, [req.body.name, req.body.user_id, req.params.id])
    res.send(response.rows[0])
  } catch (error) {
    next(error)
  }
})
app.get('/api/things', async(req,res,next)=>{
  try {
    const response = await client.query("SELECT * FROM things ORDER BY name")
    res.send(response.rows)
  } catch (error) {
    next(error)
  }
})
app.get('/api/users', async(req,res,next)=>{
  try {
    const response = await client.query("SELECT * FROM users")
    res.send(response.rows)
  } catch (error) {
    next(error)
  }
})


const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
    DROP TABLE IF EXISTS things;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) UNIQUE
    );
    CREATE TABLE things(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) UNIQUE,
      user_id INTEGER REFERENCES users(id)
    );
    INSERT INTO users(name) VALUES ('moe');
    INSERT INTO users(name) VALUES ('lucy');
    INSERT INTO users(name) VALUES ('curly');
    INSERT INTO users(name) VALUES ('ethyl');
    INSERT INTO things(name, user_id) VALUES ('foo', (SELECT id FROM users WHERE name='moe'));
    INSERT INTO things(name, user_id) VALUES ('bar', (SELECT id FROM users WHERE name='moe'));
    INSERT INTO things(name) VALUES ('baz');
  `;
  await client.query(SQL)
  console.log('create your tables and seed data');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
