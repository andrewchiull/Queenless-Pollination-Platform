// config.js
const { Sequelize, DataTypes } = require('sequelize');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZoneName = 'Asia/Taipei';
const timeZoneOffset = dayjs().tz(timeZoneName).format('Z'); // +08:00

// use dotenv to load environment variables
const dotenv = require('dotenv');
const { Hooks } = require('sequelize/lib/hooks');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, // Assuming you're running the Node app on the same host as the Docker container
    port: process.env.DB_PORT, // The port mapping you specified
    dialect: 'mysql',
    timezone: timeZoneName, // Set the time zone for the Sequelize instance to 'Asia/Taipei'
    dialectOptions: {
        timezone: timeZoneOffset // Set timezone passed to Connection (must be '+08:00', not name)
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
    createdAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deletedAt: {
        type: 'TIMESTAMP',
        allowNull: true
    }
}, {
  timestamps: true, // Enable Sequelize's createdAt, updatedAt, deletedAt.

  // To guarantee 'TIMESTAMP' (with timezone) instead of 'DATETIME' (without timezone),
  // we need to use Sequelize.literal('CURRENT_TIMESTAMP') to override the default value.

  // In timestamp fields (createdAt, updatedAt, deletedAt),
  // Sequelize's DataTypes.DATE use different data type in different database.
  // For example, it's 'TIMESTAMP' for Postgres, but it's 'DATETIME' for MySQL.
  // See: [Sequelize Docs](https://sequelize.org/docs/v7/models/data-types/#dates)
  hooks: {
    beforeCreate: (options) => {
      options.createdAt = Sequelize.literal('CURRENT_TIMESTAMP');
      return options;
    },
    beforeUpdate: (options) => {
      options.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
      return options;
    },
    beforeDestroy: (options) => {
      options.deletedAt = Sequelize.literal('CURRENT_TIMESTAMP');
      return options;
    }
    }
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
    } else {
        // update email for testing
        await testUser.update({
            email: 'testuserupdated@example.com'
        });
    }
});

module.exports = { User, sequelize };
