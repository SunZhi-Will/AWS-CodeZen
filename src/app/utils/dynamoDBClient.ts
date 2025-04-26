import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// 檢查環境變數是否設置
const region = process.env.REGION || 'ap-northeast-1';
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    console.error('警告: AWS 憑證未設置，請確保已設置 ACCESS_KEY_ID 和 SECRET_ACCESS_KEY 環境變數');
}

// 設定 DynamoDB 客戶端
const client = new DynamoDBClient({
    region,
    credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || ''
    }
});

// 創建增強型文檔客戶端
const dynamoDBClient = DynamoDBDocumentClient.from(client);

console.log(`DynamoDB 客戶端初始化完成，使用區域: ${region}`);

export default dynamoDBClient; 