const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
var hbs = require('express-hbs');
var mysql      = require('mysql');
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'news'
});

connection.connect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  connection.query('SELECT * FROM actualites', (err, results) => {
    if (err) {
      console.error('Error retrieving news:', err);
      return res.status(500).send('Server error');
    }
    
    res.render('home', { actualites: results });
  });
});

app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views/add.html"));
});

app.get("/addnews", function(req, res) {
    var untitre = req.query.letitre;
    var unedesc = req.query.ladescription;
    var sql = "insert into actualites(titre, description) values(?, ?)"
    
    connection.query(sql, [untitre, unedesc], function(error, results, fields) {
        res.send(results)
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
