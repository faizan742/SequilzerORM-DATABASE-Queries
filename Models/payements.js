const { DataTypes } = require('sequelize');

var sequelize=require("../database");

const payments = sequelize.define('payments', {
  customerNumber: {
    type: DataTypes.NUMBER,
    
    allowNull: false,
  },
  checkNumber: {
    type: DataTypes.STRING,
    primaryKey:true,
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    
  }
    
},{
    tableName:"payments",
    timestamps:false,
});


module.exports=payments;