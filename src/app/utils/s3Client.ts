import { S3Client } from '@aws-sdk/client-s3';

// 確保在測試環境和開發環境中都能正常運作
const region = process.env.NEXT_PUBLIC_REGION || 'us-west-2';

// 建立 S3 客戶端
const s3Client = new S3Client({
    region,
    credentials: process.env.NEXT_PUBLIC_ACCESS_KEY_ID && process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
    } : undefined,
    // 如果環境變數未設定，這裡會使用 AWS SDK 的預設 credential provider，
    // 它會尋找環境變數、共享憑證檔案等
    ...((!process.env.NEXT_PUBLIC_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY) && {
        logger: {
            debug: () => { },
            info: () => { },
            warn: console.warn,
            error: console.error,
        }
    })
});

// 如果憑證未設定，顯示警告
if (!process.env.NEXT_PUBLIC_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY) {
    console.warn('AWS 憑證未設定。請確保 AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY 環境變數已正確配置。');
}

export default s3Client; 