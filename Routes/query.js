const express = require('express');
const { where, json } = require('sequelize');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const path=require('path');
const products=require("../Models/products");
const orders=require("../Models/orders");
const orderdetails=require('../Models/orderdetails');
const { log } = require('console');
const customers = require('../Models/customers');
const payments = require('../Models/payements');
const employees = require('../Models/employees');
const offices = require('../Models/offices');
const ST=require('../Models/SFM');
const UFT=require('../Models/USFM');
const fs=require('fs');
const sequelize=require('../database');
const accounts=require('../Models/Accounts');
const { roundedRect } = require('pdfkit');
const resquery=require('../templete/queryres');
const productslines = require('../Models/productlines');
const Orders = require('../Models/orders');
require("dotenv").config();

const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));

Router
.route('/transcation')
.post(async (req,res)=>{
  var sender;
  var receiver;
  const t = await sequelize.transaction();
  try {
    
    sender = await accounts.findOne({ where: { Username: req.body.SenderName } }, { transaction: t });
    receiver = await accounts.findOne({ where: { UserName: req.body.ReciverName } }, { transaction: t });
  
    const transactionAmount = parseFloat(req.body.Amount);
  
    if (sender && receiver && sender.Amount >= transactionAmount) {
      await accounts.update(
        { Amount: sequelize.literal(`Amount - ${transactionAmount}`) },
        { where: { UserName: req.body.SenderName }, transaction: t }
      );
      await accounts.update(
        { Amount: sequelize.literal(`Amount + ${transactionAmount}`) },
        { where: { UserName: req.body.ReciverName }, transaction: t }
      );
      
      
       

      await ST.create({
      
        'Receiver Name':req.body.ReciverName, 
        'Sender Name':req.body.SenderName, 
        Amount:req.body.Amount
      },{transaction:t});
      
      await t.commit();
      
      console.log('Transaction committed successfully!');
      res.sendStatus(200);

    } else {
      console.log('Sender does not have enough balance for the transaction or accounts not found.');
      
      await UFT.create({
        'Receiver Name':req.body.ReciverName, 
        'Sender Name':req.body.SenderName, 
        Amount:req.body.Amount
      },{transaction:t});
      await t.rollback();

      res.sendStatus(400);
    }
  } catch (error) {
    
    console.log('AN ERROR HAS OCCURRED:', error);
    
    await UFT.create({
      'Receiver Name':req.body.ReciverName, 
      'Sender Name':req.body.SenderName, 
      Amount:req.body.Amount
    },{transaction:t});
    
    await t.rollback();
    
  }
  
});

Router
.route('/t1')
.post(async (req,res)=>{

  const products1 = await products.findAll({
    attributes: ['productName', 'productLine']
  });
  
  res.json(resquery(data=products1,meta={'TOTAL DATA FETCH':products1.length,"RESPONSE":res.statusCode}));

});

Router
.route('/t2')
.post(async (req,res)=>{
  const result=await orders.findAll({
    attributes:['customerNumber',
    [sequelize.fn('COUNT',sequelize.col('orderNumber')),'COUNT']],
    group:['customerNumber'],
    order: [[sequelize.literal('orderNumber'), 'DESC']]
    });
    res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));

});


Router
.route('/t3')
.post(async (req,res)=>{
  const result=await customers.findAll({
    attributes:['customerName',    [sequelize.fn('SUM', sequelize.col('payments.amount')), 'totalAmount']],
    include:[{
      model:payments,
      attributes:[],
      require:false

    }],
    group:['customerNumber']
  })
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router
.route('/t4')
.post(async (req,res)=>{
  const result = await orderdetails.findAll({
    attributes: [
      [sequelize.col('product.productName'), 'productName'],
      [sequelize.fn('COUNT', sequelize.col('orderdetails.orderNumber')), 'Total Orders']
    ],
    include: [
      {
        model: products,
        attributes: [],
        required: false
      }
    ],
    group: ['orderdetails.productCode'],
    order: [[sequelize.literal('SUM (orderdetails.orderLineNumber)'), 'DESC']]
  }); 
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});


Router
.route('/t5')
.post(async (req,res)=>{
  const result = await employees.findAll({
    attributes: ['firstName'],
    
    include: [{
      model: customers,
      attributes:[],
      required: false // LEFT JOIN
    }],
    where: { employeeNumber: sequelize.literal('customers.salesRepEmployeeNumber IS null')  }
  });
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router
.route('/t6')
.post(async (req,res)=>{
  const result = await customers.findAll({
    attributes: ['customerName',[sequelize.fn('COUNT',sequelize.col('orders.orderNumber')),'TOTAL ORDERS']],
    
    include: [{
      model: orders,
      attributes:[],
      required: true // LEFT JOIN
    }],
    group: ['customers.customerNumber']
     });
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router
.route('/t7')
.post(async (req,res)=>{
  const result = await 
  customers.findAll({
    attributes: ['city'],
    include: [{
      model: payments,
      attributes: [],
      required: true // INNER JOIN
    }],
    group: ['customers.city'],
    having: sequelize.literal('AVG(`payments`.`amount`) > 1000')
  })
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router
.route('/t8')
.post(async (req,res)=>{
  const result = await 
  products.findAll({
    attributes: ['productName',
    [sequelize.fn('SUM',sequelize.col('orderdetails.quantityOrdered')), 'ORDERS']
  ],
    include: [{
      model: orderdetails,
      attributes: [],
      required: true // INNER JOIN
    }],
    group: ['products.productName'],
    
  })
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});


Router.route('/t9').post(async (req, res) => {
  const result = await employees.findAll({
    attributes: ['firstName'],
    include: [
      {
        model: customers,
        attributes: [], // Empty array or specific attributes you need
      },
      {
        model: offices,
        attributes: [], // Empty array or specific attributes you need
        where: {
          country: 'USA',
        },
      },
    ],
    where: {
        employeeNumber:sequelize.literal('customers.salesRepEmployeeNumber IS null'),
    },
  });
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t10').post(async (req, res) => {
  const result = await products.findAll({
    attributes: [
      'productName',
      [sequelize.fn('COUNT', sequelize.col('orderdetails.orderNumber')), 'order_count']
    ],
    include: [
      {
        model: orderdetails,
        attributes: [],
        include: [
          {
            model: orders,
            attributes: [],
            include: [
              {
                model: customers,
                attributes: [],
                
              }
            ]
          }
        ]
      }
    ],
    where:{country : sequelize.literal('country = "USA" ')},
    group: ['products.productName'],
    order: [[sequelize.col('order_count'), 'DESC']]
  })

  console.log(result)

  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});  


Router.route('/t11').post(async (req, res) => {
  const result = await productslines.findAll({
    attributes: ['productLine', [sequelize.fn('SUM', sequelize.literal('`products->orderdetails`.`priceEach` * `products->orderdetails`.`quantityOrdered`')), 'REVEN'],
  ],
    include: [
      {
        model: products,
        attributes: [],
        include: [
          {
            model: orderdetails,
            attributes: []
          }
        ]
      }
    ],
    group: ['productlines.productLine'],
    logging:console.log()
  });
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t12').post(async (req, res) => {
  const result = await customers.findAll({
    attributes: [
        'customerName',
        [sequelize.col('orders.orderNumber'), 'orderNumber'],
        [sequelize.col('payments.amount'), 'PaymentAmount'],
    ],
    include: [
        {
            model: Orders,
            attributes: [],
        },
        {
            model: payments,
            attributes: [],
        },
    ],
    having: sequelize.literal('orderNumber IS NOT NULL'),
    order: [['orderNumber', 'ASC']],
})
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t13').post(async (req, res) => {
  const result = await customers.findAll({
    attributes: [
      'customerName',
      
    ],
    include: [
      {
        model: employees,
        attributes: ['firstName'] 
      }
    ],
    on: {
      salesRepEmployeeNumber: sequelize.col('employees.employeeNumber')
    },
    right: true
  });
  
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t14').post(async (req, res) => {
  const result = await productslines.findAll({
    attributes: [
    'productLine',
    ],
    include: [
      {
        model: products,
        attributes: ['productName'] 
      }
    ],
    required: false
  });
  
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t15').post(async (req, res) => {
  const result = await customers.findAll({
    attributes: ['customerName'],
    include: [
      {
        model: payments,
        attributes: [
          'paymentDate','amount'
          ]
      }
    ],
    required: true,
    group:['customers.customerNumber']
  });
  
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t16').post(async (req, res) => {
  const result = await employees.findAll({
    attributes: ['firstName'],
    include: [
      {
        model: offices,
        attributes: [
          [sequelize.col('city'),'CITY NAME AS OFFICE NAME']
          ]
      }
    ],
    required: true,
  
  });
  
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});

Router.route('/t17').post(async (req, res) => {
  const result = await productslines.findAll({
    attributes: ['productLine', [sequelize.fn('SUM', sequelize.col('amount')), 'Total_SUM']],
    include: [
      {
        model: products,
        attributes: [],
        include: [
          {
            model: orderdetails,
            attributes: [],
            include: [
              {
                model: orders,
                attributes: [],
                include: [
                  {
                    model: customers,
                    attributes: [],
                    include: [
                      {
                        model: payments,
                        attributes: [
    
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    group: ['productLine'], // Grouping by product line
    raw: true // Get raw data instead of Sequelize instances

  });
  
  res.json(resquery(data=result,meta={'TOTAL DATA FETCH':result.length,"RESPONSE":res.statusCode}));
});


Router.route('/t18').post(async (req,res)=>{
  try {
    const subquery = await payments.findAll({
      attributes: [
        'customerNumber',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],

      ],
      include:[{
        model:customers,
        attributes:[],
        required:true,

      }],
      group: ['customerNumber'],
    });
    
    for (const paymentTotal of subquery) {
      const customerNumber = paymentTotal.getDataValue('customerNumber');
      const totalAmount = paymentTotal.getDataValue('total_amount');
      const customer = await customers.findByPk(customerNumber);
      if (customer) {
        let updatedCreditLimit;
        if (totalAmount > 1000) {
          updatedCreditLimit = Math.round(customer.creditLimit * 1.1);
        } else {
          updatedCreditLimit = Math.min(customer.creditLimit, 50000);
        }
        await customer.update({ creditLimit: updatedCreditLimit });
      }
    }
    res.send(200);
  } catch (error) {
    console.error('Error updating credit limits:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error updating credit limits.',
      status: 500,
    });
  }

})

Router.route('/t19').post(async (req,res)=>{
      try {
        await products.update(
          {
            buyPrice: sequelize.literal(`
              CASE
                WHEN productLine = 'Motorcycles' THEN ROUND(buyPrice * 0.85)
                WHEN productLine = 'Ships' THEN ROUND(buyPrice * 0.80)
                ELSE buyPrice
              END
            `),
          },
          {
            where: {
              productLine: ['Motorcycles', 'Ships'],
            },
          }
        );
        res.json({message:'Prices updated successfully.'});
      }
       catch (error) {
        console.error('Error updating prices:', error);
      }
});





module.exports=Router;
