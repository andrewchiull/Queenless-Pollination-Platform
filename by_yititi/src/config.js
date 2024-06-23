// config.js
const { Sequelize, DataTypes } = require('sequelize');

// use dotenv to load environment variables
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, // Assuming you're running the Node app on the same host as the Docker container
    port: process.env.DB_PORT, // The port mapping you specified
    dialect: 'mysql',
    timezone: '+08:00', // Set the time zone for the Sequelize instance to Taipei (UTC+8)
    dialectOptions: {
        timezone: 'Asia/Taipei' // Set the time zone for the database connection to Taipei
    }
});

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
  timestamps: false // Disable Sequelize's automatic timestamp fields (createdAt and updatedAt)
  // Sequelize use DataTypes.DATE for timestamp
  // But when using Sequelize in MySQL, DataTypes.DATE is DATETIME
  // So we need to use 'TIMESTAMP' instead of DataTypes.DATE
}
);

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
