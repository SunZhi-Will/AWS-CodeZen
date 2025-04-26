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

        // 創建貼文表 (如果不存在)
        db.exec(`
            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                idolName TEXT NOT NULL,
                idolAvatar TEXT,
                avatarText TEXT,
                content TEXT NOT NULL,
                postType TEXT NOT NULL,
                imageUrl TEXT,
                videoUrl TEXT,
                embeddedUrl TEXT,
                musicTitle TEXT,
                musicArtist TEXT,
                musicDuration TEXT,
                likes INTEGER DEFAULT 0,
                comments INTEGER DEFAULT 0,
                timestamp TEXT NOT NULL,
                createdAt INTEGER NOT NULL
            )
        `);

        return db;
    } catch (error) {
        console.error('初始化資料庫時出錯:', error);
        return null;
    }
}

// 獲取特定貼文
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const { id } = await context.params;

        // 獲取特定貼文
        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!post) {
            return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('獲取貼文時出錯:', error);
        return NextResponse.json({ error: '獲取貼文失敗' }, { status: 500 });
    }
}

// 刪除貼文
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const { id } = await context.params;

        // 檢查貼文是否存在
        const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
        if (!post) {
            return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
        }

        // 刪除貼文
        const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);

        // 如果刪除成功
        if (result.changes > 0) {
            // 也可以考慮刪除與該貼文相關的其他內容，如評論等
            // db.prepare('DELETE FROM comments WHERE postId = ?').run(id);

            return NextResponse.json({
                success: true,
                message: '貼文已成功刪除'
            });
        } else {
            return NextResponse.json({ error: '刪除貼文失敗' }, { status: 500 });
        }
    } catch (error) {
        console.error('刪除貼文時出錯:', error);
        return NextResponse.json({ error: '刪除貼文失敗' }, { status: 500 });
    }
}

// 更新貼文（可用於部分更新或完全更新）
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const { id } = await context.params;
        const updateData = await request.json();

        // 檢查貼文是否存在
        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
        if (!post) {
            return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
        }

        // 準備更新語句
        const updateFields = [];
        const updateValues = [];

        // 僅處理提供的欄位
        for (const [key, value] of Object.entries(updateData)) {
            if (key !== 'id' && key !== 'createdAt') { // 防止修改關鍵欄位
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ error: '沒有提供任何要更新的欄位' }, { status: 400 });
        }

        // 添加ID作為條件參數
        updateValues.push(id);

        // 執行更新
        const stmt = db.prepare(`
            UPDATE posts 
            SET ${updateFields.join(', ')} 
            WHERE id = ?
        `);

        const result = stmt.run(...updateValues);

        if (result.changes > 0) {
            // 重新獲取更新後的貼文
            const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
            return NextResponse.json({
                success: true,
                post: updatedPost
            });
        } else {
            return NextResponse.json({ error: '更新貼文失敗' }, { status: 500 });
        }
    } catch (error) {
        console.error('更新貼文時出錯:', error);
        return NextResponse.json({ error: '更新貼文失敗' }, { status: 500 });
    }
} 