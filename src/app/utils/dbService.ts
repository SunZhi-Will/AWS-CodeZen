import {
    getItem,
    putItem,
    queryItems,
    scanItems,
    updateItem,
    deleteItem
} from './dynamoDBUtils';

// 資料庫種類
export enum DbType {
    DYNAMODB = 'dynamodb',
    SQLITE = 'sqlite' // 保留以維持相容性
}

// 當前使用的資料庫類型
let currentDbType: DbType = DbType.DYNAMODB;

// 設定使用的資料庫類型 (僅為維持相容性)
export function setDbType(dbType: DbType) {
    // 忽略嘗試切換到SQLite的請求
    if (dbType === DbType.SQLITE) {
        console.warn('SQLite已被棄用，僅支援DynamoDB。此切換請求將被忽略。');
        return;
    }
    currentDbType = DbType.DYNAMODB;
}

// 獲取當前使用的資料庫類型
export function getDbType(): DbType {
    return currentDbType;
}

// 表格名稱映射
const tableMapping: Record<string, string> = {
    'users': 'Users',
    'posts': 'Posts',
    'comments': 'Comments',
    'likes': 'Likes'
};

// 獲取 DynamoDB 表格名稱
function getDynamoTableName(tableName: string): string {
    return tableMapping[tableName] || tableName;
}

// 插入資料
export async function insertData(
    table: string,
    data: Record<string, unknown>
): Promise<Record<string, unknown>> {
    // DynamoDB 插入
    const dynamoTable = getDynamoTableName(table);
    await putItem(dynamoTable, data);
    return data;
}

// 依 ID 獲取資料
export async function getById(
    table: string,
    id: string
): Promise<Record<string, unknown> | null> {
    // DynamoDB 獲取
    const dynamoTable = getDynamoTableName(table);
    const result = await getItem(dynamoTable, { id });
    return result || null;
}

// 查詢資料列表
export async function queryList(
    table: string,
    conditions?: Record<string, unknown>,
    orderBy?: string,
    limit?: number
): Promise<Record<string, unknown>[]> {
    // DynamoDB 查詢
    const dynamoTable = getDynamoTableName(table);

    // 如果有具體查詢條件，使用 query 而不是 scan
    if (conditions && Object.keys(conditions).length > 0) {
        const key = Object.keys(conditions)[0];
        const value = conditions[key];

        // 構建查詢表達式
        const keyCondition = `${key} = :value`;
        const expressionValues = { ':value': value };

        // 簡單條件查詢
        const results = await queryItems(
            dynamoTable,
            `${key}Index`, // 假定索引名為欄位名+Index
            keyCondition,
            expressionValues
        );

        // 如果需要排序，手動在應用層排序
        if (orderBy) {
            const [field, direction] = orderBy.split(' ');
            results.sort((a, b) => {
                if (direction === 'DESC') {
                    return b[field] - a[field];
                }
                return a[field] - b[field];
            });
        }

        // 如果需要限制結果數量
        if (limit && limit > 0) {
            return results.slice(0, limit);
        }

        return results;
    } else {
        // 無條件，使用 scan
        const results = await scanItems(dynamoTable);

        // 如果需要排序，手動在應用層排序
        if (orderBy) {
            const [field, direction] = orderBy.split(' ');
            results.sort((a, b) => {
                if (direction === 'DESC') {
                    return b[field] - a[field];
                }
                return a[field] - b[field];
            });
        }

        // 如果需要限制結果數量
        if (limit && limit > 0) {
            return results.slice(0, limit);
        }

        return results;
    }
}

// 更新資料
export async function updateData(
    table: string,
    id: string,
    data: Record<string, unknown>
): Promise<boolean> {
    // DynamoDB 更新
    const dynamoTable = getDynamoTableName(table);

    // 構建更新表達式
    let updateExpr = 'SET';
    const exprValues: Record<string, unknown> = {};
    const exprNames: Record<string, string> = {};

    Object.entries(data).forEach(([key, value], index) => {
        const paramName = `:val${index}`;
        const attrName = `#attr${index}`;
        updateExpr += ` ${attrName} = ${paramName},`;
        exprValues[paramName] = value;
        exprNames[attrName] = key;
    });

    // 移除最後的逗號
    updateExpr = updateExpr.slice(0, -1);

    await updateItem(
        dynamoTable,
        { id },
        updateExpr,
        exprValues,
        exprNames
    );

    return true;
}

// 刪除資料
export async function deleteData(
    table: string,
    id: string
): Promise<boolean> {
    // DynamoDB 刪除
    const dynamoTable = getDynamoTableName(table);
    await deleteItem(dynamoTable, { id });
    return true;
} 