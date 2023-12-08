const { DataTypes } = require('sequelize');

var sequelize=require("../database");
const products=require('./products');
const ordersdetails = sequelize.define('orderdetails', {
  orderNumber:{
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
  },
    productCode: {
    type: DataTypes.STRING,
    primaryKey:true,
    allowNull: false,
  },
  quantityOrdered: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  priceEach: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    
  },

  orderLineNumber: {
    type: DataTypes.NUMBER,
    allowNull: false,
    
  },
    
},{
    tableName:"orderdetails",
    timestamps:false,
});
ordersdetails.belongsTo(products, { foreignKey: 'productCode', targetKey: 'productCode' });

products.hasMany(ordersdetails, { foreignKey: 'productCode', sourceKey: 'productCode' });
//ordersdetails.belongsToMany(products, { through: 'productCode' });
//ordersdetails.hasMany(products, { foreignKey: 'productCode' });
// products.hasMany(OrderDetails, { foreignKey: 'productCode' });

module.exports=ordersdetails;