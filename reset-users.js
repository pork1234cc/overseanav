/**
 * 重置用户表并添加管理员账户
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resetUsers() {
  try {
    // 打开数据库连接
    const db = await open({
      filename: join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    console.log('数据库连接成功，开始重置用户表...');

    // 删除现有用户表（如果存在）
    await db.exec('DROP TABLE IF EXISTS users');
    
    // 创建新的用户表
    await db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 添加管理员用户
    await db.run(`
      INSERT INTO users (username, password, role) 
      VALUES ('admin', '123456', 'admin')
    `);
    
    // 验证用户是否创建成功
    const user = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    console.log('创建的管理员用户:', user);

    console.log('用户表重置完成');
    await db.close();
    
  } catch (error) {
    console.error('重置用户表失败:', error);
    process.exit(1);
  }
}

// 执行重置
resetUsers(); 