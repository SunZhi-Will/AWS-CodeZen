import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// 設定 DynamoDB 客戶端
const client = new DynamoDBClient({
    region: process.env.REGION || 'ap-northeast-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || ''
    }
});

// 創建增強型文檔客戶端
const dynamoDBClient = DynamoDBDocumentClient.from(client);

export default dynamoDBClient; 