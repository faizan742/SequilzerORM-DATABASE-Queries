const { DataTypes } = require('sequelize');

var sequelize=require("../database");
const offices=require('./offices');
const employees = sequelize.define('employees', {
    employeeNumber:{
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
  },
    lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extension: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  officeCode: {
    type: DataTypes.NUMBER,
    allowNull: false,
    
  },
  reportsTo: {
    type: DataTypes.NUMBER,
    allowNull: false,
    
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
},{
    tableName:"employees",
    timestamps:false,
});
employees.belongsTo(offices, { foreignKey: 'officeCode',});

module.exports=employees;