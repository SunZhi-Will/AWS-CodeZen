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