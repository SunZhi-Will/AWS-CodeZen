import { NextRequest, NextResponse } from 'next/server';
import {
    getItem,
    putItem,
    queryItems,
    scanItems
} from '../../utils/dynamoDBUtils';

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 獲取所有貼文
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (id) {
            // 獲取特定貼文
            const post = await getItem('Posts', { id });

            if (!post) {
                return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
            }

            return NextResponse.json(post);
        } else {
            // 獲取所有貼文，按創建時間降序排序
            // 使用CreatedAtIndex
            const posts = await scanItems('Posts');
            // 手動排序，因為scan不支持排序
            posts.sort((a, b) => b.createdAt - a.createdAt);
            return NextResponse.json(posts);
        }
    } catch (error) {
        console.error('獲取貼文時出錯:', error);
        return NextResponse.json({ error: '獲取貼文失敗' }, { status: 500 });
    }
}

// 新增貼文
export async function POST(request: NextRequest) {
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

        // 儲存到 DynamoDB
        await putItem('Posts', post);

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('新增貼文時出錯:', error);
        return NextResponse.json({ error: '新增貼文失敗' }, { status: 500 });
    }
} 