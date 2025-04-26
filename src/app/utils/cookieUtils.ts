'use client';

// Cookie 工具函數
// 用於在客戶端保存和獲取留言與回覆記錄

// 定義留言和回覆的介面
interface Reply {
    id: number;
    content: string;
    time: string;
    mode?: string;
}

interface Message {
    id: number;
    user: string;
    content: string;
    time: string;
    status: string;
    replies: Reply[];
}

/**
 * 設置 Cookie
 * @param name Cookie 名稱
 * @param value Cookie 值
 * @param days Cookie 過期天數
 */
export function setCookie(name: string, value: string, days: number = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * 獲取 Cookie 值
 * @param name Cookie 名稱
 * @returns Cookie 值，如果不存在則返回空字符串
 */
export function getCookie(name: string): string {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
}

/**
 * 刪除 Cookie
 * @param name Cookie 名稱
 */
export function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * 保存留言與回覆記錄到 Cookie
 * @param messages 留言與回覆記錄
 */
export function saveMessagesToCookie(messages: Message[]) {
    try {
        // 確保數據不超過 cookie 大小限制 (約 4KB)
        const strData = JSON.stringify(messages);

        // 如果數據太大，可能需要拆分或僅存儲最近的留言
        if (strData.length > 3800) {
            // 僅保留最近的10條留言
            const recentMessages = messages.slice(0, 10);
            setCookie('idol-messages', JSON.stringify(recentMessages));
            console.warn('留言數據過大，僅保存最近10條留言');
        } else {
            setCookie('idol-messages', strData);
        }
    } catch (error) {
        console.error('保存留言到 Cookie 失敗:', error);
    }
}

/**
 * 從 Cookie 獲取留言與回覆記錄
 * @returns 留言與回覆記錄，如果不存在則返回空數組
 */
export function getMessagesFromCookie(): Message[] {
    const messagesStr = getCookie('idol-messages');
    if (!messagesStr) return [];
    try {
        return JSON.parse(messagesStr);
    } catch (error) {
        console.error('解析 Cookie 中的留言記錄失敗:', error);
        return [];
    }
} 