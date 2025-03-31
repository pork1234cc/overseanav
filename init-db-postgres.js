/**
 * 初始化 Postgres 数据库脚本
 */
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('开始初始化 Postgres 数据库...');
    
    // 创建表结构
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // 检查是否已存在admin用户
    const { rows: adminUsers } = await sql`
      SELECT * FROM users WHERE username = 'admin'
    `;
    
    if (adminUsers.length === 0) {
      console.log('创建默认管理员账户...');
      await sql`
        INSERT INTO users (username, password, role) 
        VALUES ('admin', '123456', 'admin')
      `;
    }
    
    // 创建其他表...
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 执行初始化
initializeDatabase(); 