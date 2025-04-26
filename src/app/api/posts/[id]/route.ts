import { NextRequest, NextResponse } from 'next/server';
import {
    getItem,
    deleteItem,
    updateItem
} from '../../../utils/dynamoDBUtils';

// 獲取特定貼文
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // 獲取特定貼文
        const post = await getItem('Posts', { id });

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
    try {
        const { id } = await context.params;

        // 檢查貼文是否存在
        const post = await getItem('Posts', { id });
        if (!post) {
            return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
        }

        // 刪除貼文
        await deleteItem('Posts', { id });

        // 注意：在實際應用中，您可能還需要刪除相關資料，如評論和點讚
        // 這些刪除操作需要額外的函數調用

        return NextResponse.json({
            success: true,
            message: '貼文已成功刪除'
        });
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
    try {
        const { id } = await context.params;
        const updateData = await request.json();

        // 檢查貼文是否存在
        const post = await getItem('Posts', { id });
        if (!post) {
            return NextResponse.json({ error: '貼文不存在' }, { status: 404 });
        }

        // 移除不應該更新的欄位
        delete updateData.id;
        delete updateData.createdAt;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: '沒有提供任何要更新的欄位' }, { status: 400 });
        }

        // 建立更新表達式和屬性
        let updateExpression = 'SET';
        const expressionAttributeValues: Record<string, unknown> = {};
        const expressionAttributeNames: Record<string, string> = {};

        Object.entries(updateData).forEach(([key, value], index) => {
            const paramName = `:val${index}`;
            const attrName = `#attr${index}`;
            updateExpression += ` ${attrName} = ${paramName},`;
            expressionAttributeValues[paramName] = value;
            expressionAttributeNames[attrName] = key;
        });

        // 移除最後的逗號
        updateExpression = updateExpression.slice(0, -1);

        // 執行更新
        await updateItem(
            'Posts',
            { id },
            updateExpression,
            expressionAttributeValues,
            expressionAttributeNames
        );

        // 獲取更新後的貼文
        const updatedPost = await getItem('Posts', { id });

        return NextResponse.json({
            success: true,
            post: updatedPost
        });
    } catch (error) {
        console.error('更新貼文時出錯:', error);
        return NextResponse.json({ error: '更新貼文失敗' }, { status: 500 });
    }
} 