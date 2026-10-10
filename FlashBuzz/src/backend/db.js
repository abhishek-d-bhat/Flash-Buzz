import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST || process.env.MYSQLHOST;
const user = process.env.DB_USER || process.env.MYSQLUSER;
const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const database = process.env.DB_NAME || process.env.MYSQLDATABASE;
const port = Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306;

const missingConfigs = [];
if (!host) missingConfigs.push("DB_HOST (or MYSQLHOST)");
if (!user) missingConfigs.push("DB_USER (or MYSQLUSER)");
if (!database) missingConfigs.push("DB_NAME (or MYSQLDATABASE)");

if (missingConfigs.length > 0) {
    console.error("❌ Database configuration missing required environment variables:");
    console.error(`   ${missingConfigs.join(", ")}`);
    console.error("👉 Please set these variables in Railway or in your .env file.");
}

const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    if (missingConfigs.length > 0) {
        console.warn("⚠️ MySQL connection check skipped: Required database environment variables are not set.");
        return;
    }

    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL connected successfully!");

        connection.release();
    } catch (error) {
        console.error("❌ MySQL connection failed!");
        console.error(error.message);
    }
}

testConnection();

export default pool;