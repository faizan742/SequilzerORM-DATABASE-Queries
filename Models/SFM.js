const { DataTypes } = require('sequelize');

var sequelize=require("../database");
const ST = sequelize.define('successfull transactions', {
    ID: {
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
    autoIncrement:true,
  },
  'Sender Name': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'Receiver Name': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    
  },
  time_stamp:{type:DataTypes.STRING} 

},{
    tableName:"successfull transactions",
    timestamps:false,
});

module.exports=ST;