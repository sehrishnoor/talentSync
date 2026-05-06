const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const dbName = dbUrl.pathname.replace(/^\//, '');

    const connection = await mysql.createConnection({
      host: dbUrl.hostname,
      port: dbUrl.port || 3306,
      user: dbUrl.username,
      password: dbUrl.password || '',
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created successfully.`);
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
  }
}


createDatabase();
