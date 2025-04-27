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

        // 處理推薦內容 - 只保留必要信息以減少存儲空間
        const recommendations = postData.recommendations ? {
            types: postData.recommendations.selectedTypes?.slice(0, 5) || [], // 限制數量
            random: !!postData.recommendations.random
        } : null;

        // 確保 URL 不是 DataURL 格式 (這會非常大)
        const validateUrl = (url: string | null) => {
            if (!url) return null;
            // 如果是 DataURL，則返回 null，因為這種 URL 太大
            if (url.startsWith('data:')) return null;
            // 只返回實際 URL，非 URL 則返回 null
            return url.startsWith('http') ? url : null;
        };

        // 創建貼文資料 - 優化大小
        const post = {
            id: generateUniqueId(),
            idolName: postData.idolName.slice(0, 100), // 限制長度
            avatarText: postData.idolName.charAt(0),
            content: postData.content.slice(0, 2000), // 限制內容長度
            postType: postData.postType,
            imageUrl: validateUrl(postData.imageUrl),
            videoUrl: validateUrl(postData.videoUrl),
            embeddedUrl: postData.embeddedUrl ? postData.embeddedUrl.slice(0, 500) : null, // 限制 URL 長度
            musicTitle: postData.musicTitle ? postData.musicTitle.slice(0, 100) : null,
            musicArtist: postData.musicArtist ? postData.musicArtist.slice(0, 100) : null,
            musicDuration: postData.musicDuration,
            likes: 0,
            comments: 0,
            timestamp,
            createdAt,
            // 將推薦內容轉為簡化格式保存
            recTypes: recommendations?.types || null,
            recRandom: recommendations?.random || false
        };

        // 儲存到 DynamoDB
        await putItem('Posts', post);

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('新增貼文時出錯:', error);
        return NextResponse.json({ error: '新增貼文失敗' }, { status: 500 });
    }
} 