const { DataTypes } = require('sequelize');

var sequelize=require("../database");
const ProductLine=require('./productlines');
const products = sequelize.define('products', {
  productCode: {
    type: DataTypes.STRING,
    primaryKey:true,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productLine: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },

  productScale: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  productVendor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: true,  
},
    quantityInStock: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    buyPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    MSRP: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },  
},{
    tableName:"products",
    timestamps:false,
});

products.belongsTo(ProductLine); 




module.exports=products;