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
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true // This will automatically add `createdAt` and `updatedAt` fields
});

sequelize.sync().then(async () => {
    // Insert an initial test user if not exists
    const testUser = await User.findOne({ where: { username: 'testuser' } });
    if (!testUser) {
        await User.create({
            username: 'testuser',
            password: 'hashedpassword', // Replace with a hashed password in a real application
            email: 'testuser@example.com'
        });
    }
});

module.exports = { User, sequelize };
