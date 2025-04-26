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

        // 創建點讚表 (如果不存在)
        db.exec(`
            CREATE TABLE IF NOT EXISTS likes (
                id TEXT PRIMARY KEY,
                postId TEXT NOT NULL,
                userId TEXT NOT NULL,
                createdAt INTEGER NOT NULL,
                UNIQUE(postId, userId),
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

// 獲取貼文的點讚狀態
export async function GET(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get('postId');
        const userId = url.searchParams.get('userId');

        if (!postId) {
            return NextResponse.json({ error: '缺少貼文ID' }, { status: 400 });
        }

        if (userId) {
            // 檢查特定用戶是否點讚
            const like = db.prepare('SELECT * FROM likes WHERE postId = ? AND userId = ?').get(postId, userId);
            return NextResponse.json({ isLiked: !!like });
        } else {
            // 獲取點讚總數
            const count = db.prepare('SELECT COUNT(*) as count FROM likes WHERE postId = ?').get(postId);
            return NextResponse.json({ count: count.count });
        }
    } catch (error) {
        console.error('獲取點讚狀態時出錯:', error);
        return NextResponse.json({ error: '獲取點讚狀態失敗' }, { status: 500 });
    }
}

// 切換點讚狀態
export async function POST(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const { postId, userId } = await request.json();

        // 驗證必要欄位
        if (!postId || !userId) {
            return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 });
        }

        // 開始事務
        const transaction = db.transaction(() => {
            // 檢查此用戶是否已經點讚此貼文
            const existingLike = db?.prepare('SELECT * FROM likes WHERE postId = ? AND userId = ?').get(postId, userId);

            if (existingLike) {
                // 如果已經點讚，則取消點讚
                db?.prepare('DELETE FROM likes WHERE id = ?').run(existingLike.id);

                // 更新貼文的點讚數量
                db?.prepare('UPDATE posts SET likes = MAX(likes - 1, 0) WHERE id = ?').run(postId);

                return { action: 'unliked' };
            } else {
                // 如果未點讚，則添加點讚
                const now = new Date().getTime();
                const id = generateUniqueId();

                db?.prepare('INSERT INTO likes (id, postId, userId, createdAt) VALUES (?, ?, ?, ?)')
                    .run(id, postId, userId, now);

                // 更新貼文的點讚數量
                db?.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(postId);

                return { action: 'liked' };
            }
        });

        // 執行事務
        const result = transaction();

        // 獲取更新後的點讚數量
        const updatedCount = db.prepare('SELECT likes FROM posts WHERE id = ?').get(postId);

        return NextResponse.json({
            success: true,
            action: result.action,
            likes: updatedCount.likes
        });
    } catch (error) {
        console.error('處理點讚操作時出錯:', error);
        return NextResponse.json({ error: '處理點讚操作失敗' }, { status: 500 });
    }
} 