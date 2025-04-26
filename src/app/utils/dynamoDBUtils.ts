import {
    CreateTableCommand,
    DescribeTableCommand,
    ResourceNotFoundException,
    ScalarAttributeType,
    KeyType,
    ProjectionType
} from '@aws-sdk/client-dynamodb';
import {
    PutCommand,
    GetCommand,
    QueryCommand,
    ScanCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommandInput,
    UpdateCommandInput
} from '@aws-sdk/lib-dynamodb';
import dynamoDBClient from './dynamoDBClient';

// 檢查表格是否存在
export async function tableExists(tableName: string): Promise<boolean> {
    try {
        await dynamoDBClient.send(new DescribeTableCommand({ TableName: tableName }));
        return true;
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            return false;
        }
        throw error;
    }
}

// 創建用戶表
export async function createUsersTable() {
    const tableName = 'Users';

    // 檢查表格是否已存在
    if (await tableExists(tableName)) {
        console.log(`表格 ${tableName} 已存在`);
        return;
    }

    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: 'id', KeyType: KeyType.HASH }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'username', AttributeType: ScalarAttributeType.S }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'UsernameIndex',
                KeySchema: [
                    { AttributeName: 'username', KeyType: KeyType.HASH }
                ],
                Projection: {
                    ProjectionType: ProjectionType.ALL
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        const result = await dynamoDBClient.send(new CreateTableCommand(params));
        console.log('用戶表創建成功:', result);
        return result;
    } catch (error) {
        console.error('創建用戶表時出錯:', error);
        throw error;
    }
}

// 創建貼文表
export async function createPostsTable() {
    const tableName = 'Posts';

    // 檢查表格是否已存在
    if (await tableExists(tableName)) {
        console.log(`表格 ${tableName} 已存在`);
        return;
    }

    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: 'id', KeyType: KeyType.HASH }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'idolName', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'createdAt', AttributeType: ScalarAttributeType.N }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'IdolNameIndex',
                KeySchema: [
                    { AttributeName: 'idolName', KeyType: KeyType.HASH },
                    { AttributeName: 'createdAt', KeyType: KeyType.RANGE }
                ],
                Projection: {
                    ProjectionType: ProjectionType.ALL
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            },
            {
                IndexName: 'CreatedAtIndex',
                KeySchema: [
                    { AttributeName: 'createdAt', KeyType: KeyType.HASH }
                ],
                Projection: {
                    ProjectionType: ProjectionType.ALL
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        const result = await dynamoDBClient.send(new CreateTableCommand(params));
        console.log('貼文表創建成功:', result);
        return result;
    } catch (error) {
        console.error('創建貼文表時出錯:', error);
        throw error;
    }
}

// 創建評論表
export async function createCommentsTable() {
    const tableName = 'Comments';

    // 檢查表格是否已存在
    if (await tableExists(tableName)) {
        console.log(`表格 ${tableName} 已存在`);
        return;
    }

    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: 'id', KeyType: KeyType.HASH }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'postId', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'createdAt', AttributeType: ScalarAttributeType.N }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'PostIdIndex',
                KeySchema: [
                    { AttributeName: 'postId', KeyType: KeyType.HASH },
                    { AttributeName: 'createdAt', KeyType: KeyType.RANGE }
                ],
                Projection: {
                    ProjectionType: ProjectionType.ALL
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        const result = await dynamoDBClient.send(new CreateTableCommand(params));
        console.log('評論表創建成功:', result);
        return result;
    } catch (error) {
        console.error('創建評論表時出錯:', error);
        throw error;
    }
}

// 創建點讚表
export async function createLikesTable() {
    const tableName = 'Likes';

    // 檢查表格是否已存在
    if (await tableExists(tableName)) {
        console.log(`表格 ${tableName} 已存在`);
        return;
    }

    const params = {
        TableName: tableName,
        KeySchema: [
            { AttributeName: 'id', KeyType: KeyType.HASH }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'postId', AttributeType: ScalarAttributeType.S },
            { AttributeName: 'userId', AttributeType: ScalarAttributeType.S }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'PostIdIndex',
                KeySchema: [
                    { AttributeName: 'postId', KeyType: KeyType.HASH }
                ],
                Projection: {
                    ProjectionType: ProjectionType.ALL
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            },
            {
                IndexName: 'UserPostIndex',
                KeySchema: [
                    { AttributeName: 'userId', KeyType: KeyType.HASH },
                    { AttributeName: 'postId', KeyType: KeyType.RANGE }
                ],
                Projection: {
                    ProjectionType: ProjectionType.ALL
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        const result = await dynamoDBClient.send(new CreateTableCommand(params));
        console.log('點讚表創建成功:', result);
        return result;
    } catch (error) {
        console.error('創建點讚表時出錯:', error);
        throw error;
    }
}

// 通用操作函數

// 添加項目
export async function putItem(tableName: string, item: Record<string, unknown>) {
    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        return await dynamoDBClient.send(new PutCommand(params));
    } catch (error) {
        console.error(`添加項目到 ${tableName} 時出錯:`, error);
        throw error;
    }
}

// 獲取項目
export async function getItem(tableName: string, key: Record<string, unknown>) {
    const params = {
        TableName: tableName,
        Key: key
    };

    try {
        const result = await dynamoDBClient.send(new GetCommand(params));
        return result.Item;
    } catch (error) {
        console.error(`從 ${tableName} 獲取項目時出錯:`, error);
        throw error;
    }
}

// 查詢項目
export async function queryItems(
    tableName: string,
    indexName: string | undefined,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, unknown>
) {
    const params: QueryCommandInput = {
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    if (indexName) {
        params.IndexName = indexName;
    }

    try {
        const result = await dynamoDBClient.send(new QueryCommand(params));
        return result.Items || [];
    } catch (error) {
        console.error(`查詢 ${tableName} 時出錯:`, error);
        throw error;
    }
}

// 掃描表格
export async function scanItems(tableName: string) {
    const params = {
        TableName: tableName
    };

    try {
        const result = await dynamoDBClient.send(new ScanCommand(params));
        return result.Items || [];
    } catch (error) {
        console.error(`掃描 ${tableName} 時出錯:`, error);
        throw error;
    }
}

// 更新項目
export async function updateItem(
    tableName: string,
    key: Record<string, unknown>,
    updateExpression: string,
    expressionAttributeValues: Record<string, unknown>,
    expressionAttributeNames?: Record<string, string>
) {
    const params: UpdateCommandInput = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    if (expressionAttributeNames) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }

    try {
        return await dynamoDBClient.send(new UpdateCommand(params));
    } catch (error) {
        console.error(`更新 ${tableName} 中的項目時出錯:`, error);
        throw error;
    }
}

// 刪除項目
export async function deleteItem(tableName: string, key: Record<string, unknown>) {
    const params = {
        TableName: tableName,
        Key: key
    };

    try {
        return await dynamoDBClient.send(new DeleteCommand(params));
    } catch (error) {
        console.error(`從 ${tableName} 刪除項目時出錯:`, error);
        throw error;
    }
}

// 初始化所有表格
export async function initializeDynamoDBTables() {
    await createUsersTable();
    await createPostsTable();
    await createCommentsTable();
    await createLikesTable();
    console.log('所有 DynamoDB 表格初始化完成');
} 