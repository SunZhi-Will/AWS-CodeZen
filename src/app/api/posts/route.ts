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

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 獲取所有貼文
export async function GET(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (id) {
            // 獲取特定貼文
            const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

            if (!post) {
                return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
            }

            return NextResponse.json(post);
        } else {
            // 獲取所有貼文，按創建時間降序排序
            const posts = db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all();
            return NextResponse.json(posts);
        }
    } catch (error) {
        console.error('獲取貼文時出錯:', error);
        return NextResponse.json({ error: '獲取貼文失敗' }, { status: 500 });
    }
}

// 新增貼文
export async function POST(request: NextRequest) {
    initializeDatabase();

    if (!db) {
        return NextResponse.json({ error: '資料庫連接失敗' }, { status: 500 });
    }

    try {
        const postData = await request.json();

        // 驗證必要欄位
        if (!postData.idolName || !postData.content || !postData.postType) {
            return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 });
        }

        // 處理時間戳記
        const now = new Date();
        const timestamp = '剛剛'; // 可以根據需求修改為特定格式
        const createdAt = now.getTime();

        // 創建貼文資料
        const post = {
            id: generateUniqueId(),
            idolName: postData.idolName,
            idolAvatar: postData.idolAvatar || null,
            avatarText: postData.avatarText || postData.idolName.charAt(0),
            content: postData.content,
            postType: postData.postType,
            imageUrl: postData.imageUrl || null,
            videoUrl: postData.videoUrl || null,
            embeddedUrl: postData.embeddedUrl || null,
            musicTitle: postData.musicTitle || null,
            musicArtist: postData.musicArtist || null,
            musicDuration: postData.musicDuration || null,
            likes: 0,
            comments: 0,
            timestamp,
            createdAt
        };

        // 插入資料庫
        const stmt = db.prepare(`
            INSERT INTO posts (
                id, idolName, idolAvatar, avatarText, content, postType, imageUrl, videoUrl, embeddedUrl,
                musicTitle, musicArtist, musicDuration, likes, comments, timestamp, createdAt
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `);

        stmt.run(
            post.id, post.idolName, post.idolAvatar, post.avatarText, post.content, post.postType,
            post.imageUrl, post.videoUrl, post.embeddedUrl, post.musicTitle, post.musicArtist,
            post.musicDuration, post.likes, post.comments, post.timestamp, post.createdAt
        );

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('新增貼文時出錯:', error);
        return NextResponse.json({ error: '新增貼文失敗' }, { status: 500 });
    }
} 