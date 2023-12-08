const { DataTypes } = require('sequelize');

var sequelize=require("../database");
const Accounts = sequelize.define('accounts', {
    ID: {
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    
  },    
},{
    tableName:"accounts",
    timestamps:false,
});

module.exports=Accounts;