// config.js
const { Sequelize, DataTypes } = require('sequelize');

// use dotenv to load environment variables
const dotenv = require('dotenv');
dotenv.config();
  
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, // Assuming you're running the Node app on the same host as the Docker container
    port: process.env.DB_PORT, // The port mapping you specified
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync();

module.exports = { User, sequelize };
