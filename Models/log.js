const { DataTypes } = require('sequelize');

var sequelize=require("../database");

const Log = sequelize.define('logs', {
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    methods:{type:DataTypes.STRING} ,
    Status:{type:DataTypes.BIGINT} ,
    path:{type:DataTypes.STRING} ,
    hostname:{
       type: DataTypes.STRING
    } 
  },{
    tableName:"logs",
    timestamps:false,
});
  
  module.exports = Log;