const { Sequelize } = require( 'sequelize' );

const sequelize = new Sequelize('testds', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', 
})

module.exports = sequelize;
