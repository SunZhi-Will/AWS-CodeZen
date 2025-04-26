import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { User, UserRole } from '../../../types/user';

let db: ReturnType<typeof Database> | null = null;

// 初始化資料庫
function initializeDatabase() {
    if (db) return db;

    try {
        // 確保資料庫目錄存在
        const dbDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // 初始化資料庫連接
        const dbPath = path.join(dbDir, 'idol_platform.db');
        db = new Database(dbPath);

        // 創建用戶表
        db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        displayName TEXT NOT NULL,
        avatar TEXT
      )
    `);

        // 檢查是否需要初始化預設用戶
        const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
        if (count.count === 0) {
            createDefaultUsers();
        }

        return db;
    } catch (error) {
        console.error('初始化資料庫時出錯:', error);
        return null;
    }
}

// 創建預設用戶
function createDefaultUsers() {
    if (!db) return;

    const insertUser = db.prepare(
        'INSERT INTO users (id, username, role, displayName, avatar) VALUES (?, ?, ?, ?, ?)'
    );

    const defaultUsers: User[] = [
        {
            id: '1',
            username: 'admin',
            role: UserRole.ADMIN,
            displayName: '系統管理員',
            avatar: '/images/avatars/admin.png'
        },
        {
            id: '2',
            username: 'idol1',
            role: UserRole.IDOL,
            displayName: '虛擬偶像小雪',
            avatar: '/images/avatars/idol1.png'
        },
        {
            id: '3',
            username: 'fan1',
            role: UserRole.FAN,
            displayName: '熱情粉絲',
            avatar: '/images/avatars/fan1.png'
        }
    ];

    // 開始一個事務
    const transaction = db.transaction(() => {
        for (const user of defaultUsers) {
            insertUser.run(user.id, user.username, user.role, user.displayName, user.avatar);
        }
    });

    transaction();
    console.log('預設用戶創建完成');
}

// 獲取特定用戶 API (通過 ID)
export async function GET(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // 如果指定了 ID，獲取特定用戶
            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
            if (!user) {
                return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
            }
            return NextResponse.json(user);
        } else {
            // 否則獲取所有用戶
            const users = db.prepare('SELECT * FROM users').all();
            return NextResponse.json(users);
        }
    } catch (error) {
        console.error('獲取用戶時出錯:', error);
        return NextResponse.json({ error: '獲取用戶失敗' }, { status: 500 });
    }
}

// 登入功能
export async function POST(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: '缺少用戶名稱' }, { status: 400 });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('登入時出錯:', error);
        return NextResponse.json({ error: '登入失敗' }, { status: 500 });
    }
} 