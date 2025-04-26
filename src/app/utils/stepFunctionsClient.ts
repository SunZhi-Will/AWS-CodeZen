import { SFNClient } from '@aws-sdk/client-sfn';

// 設定 Step Functions 客戶端
const stepFunctionsClient = new SFNClient({
    region: process.env.REGION || 'ap-northeast-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || ''
    }
});

export default stepFunctionsClient; 