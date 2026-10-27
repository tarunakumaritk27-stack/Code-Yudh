const { sequelize } = require('./model');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // sync({ alter: true }) safely updates tables without dropping data
    await sequelize.sync({ alter: true });
    console.log('All PostgreSQL tables and enums created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect or sync the database:', error);
    process.exit(1);
  }
}

initializeDatabase();