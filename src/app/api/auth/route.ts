import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole } from '../../../types/user';
import {
    getItem,
    putItem,
    queryItems,
    scanItems
} from '../../utils/dynamoDBUtils';

// 獲取特定用戶 API (通過 ID)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // 如果指定了 ID，獲取特定用戶
            const user = await getItem('Users', { id });
            if (!user) {
                return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
            }
            return NextResponse.json(user);
        } else {
            // 否則獲取所有用戶
            const users = await scanItems('Users');
            return NextResponse.json(users);
        }
    } catch (error) {
        console.error('獲取用戶時出錯:', error);
        return NextResponse.json({ error: '獲取用戶失敗' }, { status: 500 });
    }
}

// 登入功能
export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: '缺少用戶名稱' }, { status: 400 });
        }

        // 使用UsernameIndex查詢用戶
        const users = await queryItems(
            'Users',
            'UsernameIndex',
            'username = :username',
            { ':username': username }
        );

        if (!users || users.length === 0) {
            return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
        }

        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('登入時出錯:', error);
        return NextResponse.json({ error: '登入失敗' }, { status: 500 });
    }
} 