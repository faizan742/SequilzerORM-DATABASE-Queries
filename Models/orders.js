const { DataTypes } = require('sequelize');

var sequelize=require("../database");
const ordersdetails = require('./orderdetails');
const customers= require('./customers');

const Orders = sequelize.define('orders', {
  orderNumber: {
    type: DataTypes.NUMBER,
    primaryKey:true,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requiredDate: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },

  shippedDate: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,  
},
    customerNumber: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    
},{
    tableName:"orders",
    timestamps:false,
});

Orders.hasOne(ordersdetails,{foreignKey:'orderNumber'});
ordersdetails.belongsTo(Orders,{foreignKey:'orderNumber'});

Orders.belongsTo(customers,{foreignKey:'customerNumber'}
);



module.exports=Orders;