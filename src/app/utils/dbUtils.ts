"use client";

// 用戶角色類型
export enum UserRole {
    ADMIN = 'admin',
    IDOL = 'idol',
    FAN = 'fan'
}

// 用戶資料類型
export interface User {
    id: string;
    username: string;
    role: UserRole;
    displayName: string;
    avatar?: string;
}

// 獲取所有用戶
export async function getAllUsers(): Promise<User[]> {
    try {
        const response = await fetch('/api/auth');
        if (!response.ok) {
            throw new Error('獲取用戶列表失敗');
        }

        return await response.json();
    } catch (error) {
        console.error('獲取所有用戶時出錯:', error);
        return [];
    }
}

// 根據 ID 獲取用戶
export async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await fetch(`/api/auth?id=${id}`);
        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('根據 ID 獲取用戶時出錯:', error);
        return null;
    }
}

// 根據用戶名獲取用戶
export async function getUserByUsername(username: string): Promise<User | null> {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('根據用戶名獲取用戶時出錯:', error);
        return null;
    }
}

// 初始化資料庫 - 客戶端不需要實際執行，僅為 API 兼容
export function initializeDatabase() {
    // 實際初始化在 API 端進行
    console.log('在 API 端初始化資料庫');
    return null;
} 