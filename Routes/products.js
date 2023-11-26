const express = require('express');
const products=require("../Models/products");
const { where } = require('sequelize');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path=require('path');
const quene1=require('../Quene/uploaddata'); 
const downloadquene=require('../Quene/senddata'); 

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
  // if (fs.existsSync(filePath)) {
  //   const fileName = path.basename(filePath);

  //   // Set headers to prompt the browser to save the file
  //   res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  //   res.setHeader('Content-type', 'application/octet-stream');

  //   // Stream the file to the response
  //   const fileStream = fs.createReadStream(filePath);
  //   fileStream.pipe(res);
  // } else {
  //   res.status(404).send('File not found');
  // }
});






Router
.route('/MAKEINVOICE')
.post((req,res)=>{
  RentalModel.updateOne({"Customer.username":req.body.name},{$set:{Price:req.body.Price}})
      .then((result) => {
        console.log('Movie Upadtes:', result);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.sendStatus(404);
      });
});



module.exports=Router;