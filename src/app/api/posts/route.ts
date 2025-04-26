import { NextRequest, NextResponse } from 'next/server';
import {
    getItem,
    putItem,
    scanItems
} from '../../utils/dynamoDBUtils';

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 獲取所有貼文
export async function GET(request: NextRequest) {
    try {
        console.log('開始處理貼文 GET 請求');
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (id) {
            console.log(`嘗試獲取特定貼文，ID: ${id}`);
            // 獲取特定貼文
            const post = await getItem('Posts', { id });

            if (!post) {
                console.log(`貼文不存在，ID: ${id}`);
                return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
            }

            console.log(`已成功獲取貼文，ID: ${id}`);
            return NextResponse.json(post);
        } else {
            console.log('嘗試獲取所有貼文');
            // 獲取所有貼文，按創建時間降序排序
            const posts = await scanItems('Posts');

            // 檢查是否成功獲取貼文
            if (!posts || !Array.isArray(posts)) {
                console.error('無法獲取貼文或回傳值不是陣列', posts);
                return NextResponse.json({ error: '獲取貼文失敗，伺服器回傳格式不正確' }, { status: 500 });
            }

            console.log(`成功獲取 ${posts.length} 篇貼文`);
            // 手動排序，因為scan不支持排序
            posts.sort((a, b) => b.createdAt - a.createdAt);
            return NextResponse.json(posts);
        }
    } catch (error) {
        console.error('獲取貼文時出錯:', error);
        // 提供更詳細的錯誤信息
        const errorMessage = error instanceof Error
            ? `${error.name}: ${error.message}`
            : '未知錯誤';

        console.error(`詳細錯誤訊息: ${errorMessage}`);
        return NextResponse.json({ error: `獲取貼文失敗: ${errorMessage}` }, { status: 500 });
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