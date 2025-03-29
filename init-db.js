/**
 * 初始化数据库脚本
 * 创建必要的表结构和默认数据
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  try {
    // 打开数据库连接
    const db = await open({
      filename: join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    console.log('数据库连接成功，开始初始化...');

    // 读取SQL文件
    const sql = await readFile(join(__dirname, 'database.sql'), 'utf8');
    
    // 分割SQL语句并执行
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await db.exec(statement + ';');
      }
    }

    // 检查users表是否存在
    const userTable = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    
    if (!userTable) {
      console.log('创建users表...');
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // 检查是否已存在admin用户
    const adminUser = await db.get("SELECT * FROM users WHERE username = 'admin'");
    
    if (!adminUser) {
      console.log('创建默认管理员账户...');
      await db.run(`
        INSERT INTO users (username, password, role) 
        VALUES ('admin', '123456', 'admin')
      `);
    }

    console.log('数据库初始化完成');
    await db.close();
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化
initializeDatabase();
