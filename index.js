const express = require('express');
const products=require('./Routes/products');
var sequelize=require("./database");

 const cron = require('node-cron');
// const fetch = require('node-fetch');
require("dotenv").config();

const app = express();
const port = process.env.PORT || '8000';

app.use("/products",products);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('HI There this is base ');
  });
  
app.listen(port, (err) => {
    if (err) {
      return console.log('ERROR: ' + err);
    }
    console.log('Listening on Port ' + port);
  });

app.set('view engine', 'ejs');
app.set('views', './View');

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

//cron.schedule('*/10 * * * *', myTask);