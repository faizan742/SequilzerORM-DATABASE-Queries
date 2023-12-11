const express = require('express');
const query=require('./Routes/query');
const sequelize=require("./database");
const pino = require('pino');
const pinoPretty = require('pino-pretty');
const expressPino = require('express-pino-logger');
const log = require('./Models/log');
require("dotenv").config();

const logger = pino({ prettifier: pinoPretty,}); 

const expressLogger = expressPino({ logger });

const rateLimit= require('express-rate-limit');
const { DATE } = require('sequelize');
const app = express();
const port = process.env.PORT || '8000';
var currentdate = new Date(); 
var datetime = "Last Action Perform: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
async function saveLogToDatabase(logData) {
  try {       
    log.create(logData);
  } catch (error) {
    console.error('Error saving log to the database:', error);
  }
}


app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path,result:res.statusCode }, 'Request received');
   res.on('finish',async ()=>{
    saveLogToDatabase({
      hostname:req.hostname,
      methods:req.method,
      Status:res.statusCode,
      path: req.path,
      time_stamp:datetime
     })

   })
  next(); 
});



const limitrate=rateLimit({
  windowMs: 10000, 
  max: 2, 
  message: "Too many requests from this IP, please try again later."
});


app.use(limitrate);
app.use(expressLogger);

app.use("/query",query);

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

sequelize.sync();

