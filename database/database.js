const Sequelize = require('sequelize');

const connection = new Sequelize('rosidocesfinos', 'root', 'admin', {
   host: 'localhost',
   dialect: 'mysql'
});

module.exports = connection;