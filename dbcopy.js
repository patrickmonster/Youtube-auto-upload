const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto('dbneocat', 'neocat', 'soungjin1120!', {
    host: 'db.neocat.gabia.io',
    port: '3306',
    dialect: "mysql"
});
auto.run((err) => {
    if (err) throw err;
})


const models = require("./models");
console.log(models);
/*
"development": {
    "username": "neocat",
    "password": "soungjin1120!",
    "database": "dbneocat",
    "host": "db.neocat.gabia.io",
    "dialect": "mysql",
    "logging": true
  },
*/