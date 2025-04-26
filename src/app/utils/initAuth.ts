"use client";

import { initAuth as initializeAuth } from './authUtils';

/**
 * 在應用啟動時初始化身份驗證系統
 */
export function initAuth() {
    // 避免在伺服器端執行
    if (typeof window !== 'undefined') {
        // 初始化 SQLite 資料庫與預設使用者
        initializeAuth();
        console.log('身份驗證系統已初始化');
    }
}

// 匯出一個組件，可在布局文件中使用
export default function AuthInitializer() {
    // 在客戶端渲染時初始化
    if (typeof window !== 'undefined') {
        initAuth();
    }

    return null;
} 