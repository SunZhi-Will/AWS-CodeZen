import { NextRequest, NextResponse } from 'next/server';
import {
    getItem,
    putItem,
    queryItems,
    deleteItem,
    updateItem
} from '../../utils/dynamoDBUtils';

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 獲取貼文的所有評論
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: '缺少貼文ID' }, { status: 400 });
        }

        // 使用 PostIdIndex 查詢特定貼文的所有評論
        const comments = await queryItems(
            'Comments',
            'PostIdIndex',
            'postId = :postId',
            { ':postId': postId }
        );

        // 手動按創建時間降序排序
        comments.sort((a, b) => b.createdAt - a.createdAt);

        return NextResponse.json(comments);
    } catch (error) {
        console.error('獲取評論時出錯:', error);
        return NextResponse.json({ error: '獲取評論失敗' }, { status: 500 });
    }
}

// 新增評論
export async function POST(request: NextRequest) {
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

        // 儲存到 DynamoDB
        await putItem('Comments', comment);

        // 更新貼文的評論數量
        // 獲取當前貼文
        const post = await getItem('Posts', { id: comment.postId });
        if (post) {
            // 更新評論計數
            await updateItem(
                'Posts',
                { id: comment.postId },
                'SET comments = comments + :incr',
                { ':incr': 1 }
            );
        }

        return NextResponse.json({ success: true, comment });
    } catch (error) {
        console.error('新增評論時出錯:', error);
        return NextResponse.json({ error: '新增評論失敗' }, { status: 500 });
    }
}

// 刪除評論
export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        const postId = url.searchParams.get('postId');

        if (!id || !postId) {
            return NextResponse.json({ error: '缺少評論ID或貼文ID' }, { status: 400 });
        }

        // 檢查評論是否存在
        const comment = await getItem('Comments', { id });
        if (!comment) {
            return NextResponse.json({ error: '評論不存在' }, { status: 404 });
        }

        // 刪除評論
        await deleteItem('Comments', { id });

        // 更新貼文的評論數量
        const post = await getItem('Posts', { id: postId });
        if (post) {
            // 確保評論計數不會低於0
            const newCount = Math.max((post.comments || 0) - 1, 0);
            await updateItem(
                'Posts',
                { id: postId },
                'SET comments = :newCount',
                { ':newCount': newCount }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('刪除評論時出錯:', error);
        return NextResponse.json({ error: '刪除評論失敗' }, { status: 500 });
    }
} 