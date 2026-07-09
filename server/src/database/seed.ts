import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
  });

  try {
    // Use path relative to current working directory
    const sqlFilePath = path.resolve(
      process.cwd(),
      "src",
      "database",
      "init.sql",
    );
    const sql = fs.readFileSync(sqlFilePath, "utf-8");

    // Split SQL statements and execute them
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await connection.query(statement);
      }
    }

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await connection.end();
  }
};

initializeDatabase();
