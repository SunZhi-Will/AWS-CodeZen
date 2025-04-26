import {
    scanItems
} from './dynamoDBUtils';

// 遷移過程類型
type MigrationProcess = {
    totalItems: number;
    migratedItems: number;
    startTime: Date;
    endTime?: Date;
    tableName: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    error?: Error | string | unknown;
};

// 遷移狀態跟踪
const migrationStatus: Record<string, MigrationProcess> = {
    'Users': {
        totalItems: 0,
        migratedItems: 0,
        startTime: new Date(),
        endTime: new Date(),
        tableName: 'Users',
        status: 'completed',
    },
    'Posts': {
        totalItems: 0,
        migratedItems: 0,
        startTime: new Date(),
        endTime: new Date(),
        tableName: 'Posts',
        status: 'completed',
    },
    'Comments': {
        totalItems: 0,
        migratedItems: 0,
        startTime: new Date(),
        endTime: new Date(),
        tableName: 'Comments',
        status: 'completed',
    },
    'Likes': {
        totalItems: 0,
        migratedItems: 0,
        startTime: new Date(),
        endTime: new Date(),
        tableName: 'Likes',
        status: 'completed',
    }
};

// 獲取表格內容來更新遷移狀態
async function updateMigrationStatus() {
    try {
        // 獲取各表格的項目計數
        const users = await scanItems('Users');
        const posts = await scanItems('Posts');
        const comments = await scanItems('Comments');
        const likes = await scanItems('Likes');

        // 更新遷移狀態
        migrationStatus['Users'].migratedItems = users.length;
        migrationStatus['Users'].totalItems = users.length;

        migrationStatus['Posts'].migratedItems = posts.length;
        migrationStatus['Posts'].totalItems = posts.length;

        migrationStatus['Comments'].migratedItems = comments.length;
        migrationStatus['Comments'].totalItems = comments.length;

        migrationStatus['Likes'].migratedItems = likes.length;
        migrationStatus['Likes'].totalItems = likes.length;
    } catch (error) {
        console.error('獲取DynamoDB表格數據時出錯:', error);
    }
}

// 遷移用戶資料 (已不再執行真正的遷移，僅返回狀態)
export async function migrateUsers() {
    await updateMigrationStatus();
    return {
        success: true,
        migrated: migrationStatus['Users'].migratedItems,
        message: '系統已完全遷移至DynamoDB，不再需要執行遷移操作'
    };
}

// 遷移貼文資料 (已不再執行真正的遷移，僅返回狀態)
export async function migratePosts() {
    await updateMigrationStatus();
    return {
        success: true,
        migrated: migrationStatus['Posts'].migratedItems,
        message: '系統已完全遷移至DynamoDB，不再需要執行遷移操作'
    };
}

// 遷移評論資料 (已不再執行真正的遷移，僅返回狀態)
export async function migrateComments() {
    await updateMigrationStatus();
    return {
        success: true,
        migrated: migrationStatus['Comments'].migratedItems,
        message: '系統已完全遷移至DynamoDB，不再需要執行遷移操作'
    };
}

// 遷移點讚資料 (已不再執行真正的遷移，僅返回狀態)
export async function migrateLikes() {
    await updateMigrationStatus();
    return {
        success: true,
        migrated: migrationStatus['Likes'].migratedItems,
        message: '系統已完全遷移至DynamoDB，不再需要執行遷移操作'
    };
}

// 獲取遷移狀態
export function getMigrationStatus() {
    return migrationStatus;
}

// 運行所有遷移
export async function migrateAllData() {
    try {
        console.log('更新遷移狀態資訊...');

        // 更新表格項目計數
        await updateMigrationStatus();

        console.log('系統已全部使用DynamoDB，不需執行實際遷移');
        return {
            success: true,
            status: migrationStatus,
            message: '系統已完全遷移至DynamoDB，不再需要執行遷移操作'
        };
    } catch (error) {
        console.error('獲取遷移狀態時出錯:', error);
        return { success: false, error, status: migrationStatus };
    }
} 