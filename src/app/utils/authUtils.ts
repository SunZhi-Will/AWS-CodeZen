"use client";

import { setCookie, getCookie, deleteCookie } from './cookieUtils';
import { getUserByUsername, getUserById, UserRole, User, getAllUsers as fetchAllUsers } from './dbUtils';

// Cookie 名稱常數
const CURRENT_USER_KEY = 'idol_platform_current_user';

// 初始化認證系統 - 在客戶端只是初始化 cookie
export function initAuth() {
    if (typeof window === 'undefined') return;

    // 實際初始化在 API 端進行
    console.log('身份驗證系統初始化');
}

// 登入功能
export async function login(username: string): Promise<User | null> {
    try {
        // 從 API 獲取用戶
        const user = await getUserByUsername(username);

        if (user) {
            // 設置 Cookie，有效期 7 天
            setCookie(CURRENT_USER_KEY, user.id, 7);
            return user;
        }

        return null;
    } catch (error) {
        console.error('登入時出錯:', error);
        return null;
    }
}

// 登出功能
export function logout() {
    deleteCookie(CURRENT_USER_KEY);
}

// 獲取當前用戶
export async function getCurrentUser(): Promise<User | null> {
    try {
        // 從 Cookie 獲取用戶 ID
        const userId = getCookie(CURRENT_USER_KEY);
        if (userId) {
            return await getUserById(userId);
        }

        return null;
    } catch (error) {
        console.error('獲取當前用戶時出錯:', error);
        return null;
    }
}

// 檢查用戶是否有權限 (非同步)
export async function hasPermission(requiredRole: UserRole): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    // 管理員擁有所有權限
    if (currentUser.role === UserRole.ADMIN) return true;

    // 檢查其他角色
    return currentUser.role === requiredRole;
}

// 獲取所有用戶 (重新匯出)
export async function getAllUsers(): Promise<User[]> {
    return await fetchAllUsers();
}

// 重新匯出 UserRole 和 User 類型
export type { User } from './dbUtils';
export { UserRole } from './dbUtils';
