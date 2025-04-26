import { SFNClient } from '@aws-sdk/client-sfn';

// 檢查環境變數
const region = process.env.AWS_REGION || process.env.REGION || 'ap-northeast-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY || '';

// 檢查憑證是否存在
if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS 憑證未設定。請確保 AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY 環境變數已正確配置。');
}

// 設定 Step Functions 客戶端
const stepFunctionsClient = new SFNClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    // 在前端環境中需要增加以下配置
    ...(typeof window !== 'undefined' && {
        // 瀏覽器環境下的特殊配置
        customUserAgent: 'dashboardClient/1.0.0'
    })
});

export default stepFunctionsClient; 