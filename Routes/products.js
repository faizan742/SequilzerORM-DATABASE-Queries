const express = require('express');
const { where } = require('sequelize');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path=require('path');
const quene1=require('../Quene/uploaddata'); 
const downloadquene=require('../Quene/senddata'); 
const products=require("../Models/products");
const orders=require("../Models/orders");
const orderdetails=require('../Models/orderdetails');
const { log } = require('console');
const customers = require('../Models/customers');
const payments = require('../Models/payements');
const employees = require('../Models/employees');
const offices = require('../Models/offices');


require("dotenv").config();

const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));



Router
.route('/fillterData')
.post((req,res)=>{
  products.findAll({where:{ 
    MSRP: {
    [Op.between]: [req.body.value, req.body.value1],
  },
}})
      .then((result) => {
        const uuid = uuidv4();
        quene1.saveData(uuid,result);
        res.json(uuid);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});

Router
.route('/downloadCSV')
.get((req, res) => {
downloadquene.DownloadData(req.body.uuid); 
res.send(200);
});

Router
.route('/MAKEINVOICE')
.post((req,res)=>{
  orders.findAll({
    include:[{
      model: orderdetails,      
      
      include:[{
        model:products,
      }],
    },{
      model:customers,
      include:[
        {
          model:payments,
          model:employees,
          include:[
            {
              model:offices
            }
          ]
        }
      ]
    }
  ],
    where:{
     orderNumber:10100 
    }
  }).then((result) => {
    console.log(result);
    res.json(result);
  }).catch((err) => {
    
  });

});



module.exports=Router;