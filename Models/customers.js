const { DataTypes } = require('sequelize');

var sequelize=require("../database");
var payments=require('./payements');
const employees=require('./employees')
const customers = sequelize.define('customers', {
    customerNumber: {
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactLastName: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },

  contactFirstName: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,  
},
addressLine1: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
country: {
    type: DataTypes.STRING,
    allowNull: false,
    },

    salesRepEmployeeNumber: {
type: DataTypes.NUMBER,
allowNull: false,
},

creditLimit: {
type: DataTypes.DOUBLE,
allowNull: false,
},
    
},{
    tableName:"customers",
    timestamps:false,
});
customers.hasMany(payments, { foreignKey: 'customerNumber', targetKey: 'customerNumber' })
customers.belongsTo(employees, { foreignKey: 'salesRepEmployeeNumber',})

module.exports=customers;