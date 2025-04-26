import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 初始化資料庫
let db: ReturnType<typeof Database> | null = null;

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

        // 創建評論表 (如果不存在)
        db.exec(`
            CREATE TABLE IF NOT EXISTS comments (
                id TEXT PRIMARY KEY,
                postId TEXT NOT NULL,
                username TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                createdAt INTEGER NOT NULL,
                FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
            )
        `);

        return db;
    } catch (error) {
        console.error('初始化資料庫時出錯:', error);
        return null;
    }
}

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 獲取貼文的所有評論
export async function GET(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: '缺少貼文ID' }, { status: 400 });
        }

        // 獲取指定貼文的所有評論，按創建時間降序排序
        const comments = db.prepare('SELECT * FROM comments WHERE postId = ? ORDER BY createdAt DESC').all(postId);

        return NextResponse.json(comments);
    } catch (error) {
        console.error('獲取評論時出錯:', error);
        return NextResponse.json({ error: '獲取評論失敗' }, { status: 500 });
    }
}

// 新增評論
export async function POST(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const commentData = await request.json();

        // 驗證必要欄位
        if (!commentData.postId || !commentData.username || !commentData.content) {
            return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 });
        }

        // 處理時間戳記
        const now = new Date();
        const timestamp = '剛剛'; // 可以根據需求修改為特定格式
        const createdAt = now.getTime();

        // 創建評論資料
        const comment = {
            id: generateUniqueId(),
            postId: commentData.postId,
            username: commentData.username,
            content: commentData.content,
            timestamp,
            createdAt
        };

        // 插入資料庫
        db.prepare(`
            INSERT INTO comments (id, postId, username, content, timestamp, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(comment.id, comment.postId, comment.username, comment.content, comment.timestamp, comment.createdAt);

        // 更新貼文的評論數量
        db.prepare('UPDATE posts SET comments = comments + 1 WHERE id = ?').run(comment.postId);

        return NextResponse.json({ success: true, comment });
    } catch (error) {
        console.error('新增評論時出錯:', error);
        return NextResponse.json({ error: '新增評論失敗' }, { status: 500 });
    }
}

// 刪除評論
export async function DELETE(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        const postId = url.searchParams.get('postId');

        if (!id || !postId) {
            return NextResponse.json({ error: '缺少評論ID或貼文ID' }, { status: 400 });
        }

        // 刪除評論
        const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: '評論不存在' }, { status: 404 });
        }

        // 更新貼文的評論數量
        db.prepare('UPDATE posts SET comments = MAX(comments - 1, 0) WHERE id = ?').run(postId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('刪除評論時出錯:', error);
        return NextResponse.json({ error: '刪除評論失敗' }, { status: 500 });
    }
} 