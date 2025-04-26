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

// 獲取貼文的點讚狀態
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get('postId');
        const userId = url.searchParams.get('userId');

        if (!postId) {
            return NextResponse.json({ error: '缺少貼文ID' }, { status: 400 });
        }

        if (userId) {
            // 檢查特定用戶是否點讚
            const likes = await queryItems(
                'Likes',
                'UserPostIndex',
                'userId = :userId AND postId = :postId',
                {
                    ':userId': userId,
                    ':postId': postId
                }
            );
            return NextResponse.json({ isLiked: likes.length > 0 });
        } else {
            // 獲取點讚總數
            const likes = await queryItems(
                'Likes',
                'PostIdIndex',
                'postId = :postId',
                { ':postId': postId }
            );
            return NextResponse.json({ count: likes.length });
        }
    } catch (error) {
        console.error('獲取點讚狀態時出錯:', error);
        return NextResponse.json({ error: '獲取點讚狀態失敗' }, { status: 500 });
    }
}

// 切換點讚狀態
export async function POST(request: NextRequest) {
    try {
        const { postId, userId } = await request.json();

        // 驗證必要欄位
        if (!postId || !userId) {
            return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 });
        }

        // 檢查此用戶是否已經點讚此貼文
        const existingLikes = await queryItems(
            'Likes',
            'UserPostIndex',
            'userId = :userId AND postId = :postId',
            {
                ':userId': userId,
                ':postId': postId
            }
        );

        let action = '';
        let updatedLikesCount = 0;

        if (existingLikes.length > 0) {
            // 如果已經點讚，則取消點讚
            const existingLike = existingLikes[0];
            await deleteItem('Likes', { id: existingLike.id });

            // 更新貼文的點讚數量
            // 先獲取當前貼文
            const post = await getItem('Posts', { id: postId });
            if (post) {
                // 確保點讚計數不會低於0
                const newCount = Math.max((post.likes || 0) - 1, 0);
                await updateItem(
                    'Posts',
                    { id: postId },
                    'SET likes = :newCount',
                    { ':newCount': newCount }
                );
                updatedLikesCount = newCount;
            }

            action = 'unliked';
        } else {
            // 如果未點讚，則添加點讚
            const now = new Date().getTime();
            const id = generateUniqueId();

            await putItem('Likes', {
                id,
                postId,
                userId,
                createdAt: now
            });

            // 更新貼文的點讚數量
            // 先獲取當前貼文
            const post = await getItem('Posts', { id: postId });
            if (post) {
                await updateItem(
                    'Posts',
                    { id: postId },
                    'SET likes = likes + :incr',
                    { ':incr': 1 }
                );
                updatedLikesCount = (post.likes || 0) + 1;
            }

            action = 'liked';
        }

        // 獲取更新後的貼文
        const updatedPost = await getItem('Posts', { id: postId });
        updatedLikesCount = updatedPost?.likes || updatedLikesCount;

        return NextResponse.json({
            success: true,
            action,
            likes: updatedLikesCount
        });
    } catch (error) {
        console.error('處理點讚操作時出錯:', error);
        return NextResponse.json({ error: '處理點讚操作失敗' }, { status: 500 });
    }
} 