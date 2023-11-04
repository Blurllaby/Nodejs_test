require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views/public');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/loginSubmit', (req, res) => {
  const { username, password } = req.body;
  console.log('Received username:', username);

  const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'duongdb.database.windows.net',
    options: {
      encrypt: true, // for Azure
      trustServerCertificate: false, // change to true for local dev / self-signed certs
    },
  };

  sql.connect(sqlConfig, err => {
    // ... error checks

    // Query
    new sql.Request().query(`
        select * from Users where
        userName in ('${username}')
        `, (err, result) => {
      // ... error checks
      console.log(err)
      if (err) {
        res.render('login', { message: 'Login error please check your input data' });
      }
      else {
        console.dir(result);
        let pass = result['recordset'][0]['PasswordID'];
        console.log(result['recordset'])
        if (pass == password) {
          console.log('value present')
          res.render('login', { message: 'success' });
        }
        else {
          res.render('login', { message: 'Login error please check your password' });
        }

      }
    })

  })




});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
