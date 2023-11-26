const { DataTypes } = require('sequelize');

var sequelize=require("../database");

const productslines = sequelize.define('productlines', {
  productLine: {
    type: DataTypes.STRING,
    primaryKey:true,
    allowNull: false,
  },
  textDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  htmlDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
},{
    tableName:"productlines",
    timestamps:false,
});






module.exports=productslines;