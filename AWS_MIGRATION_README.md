# SQLite 到 DynamoDB 遷移指南

本文檔提供了從 SQLite 遷移到 AWS DynamoDB 的步驟說明。

## 前置要求

1. 有效的 AWS 帳戶
2. 適當的 IAM 權限設定（能夠創建與操作 DynamoDB 表格）
3. AWS 存取金鑰（Access Key）和秘密金鑰（Secret Key）

## 設定環境變數

在專案根目錄創建 `.env.local` 文件並填入以下内容：

```
# AWS DynamoDB 設定
REGION=ap-northeast-1
ACCESS_KEY_ID=your_access_key_here
SECRET_ACCESS_KEY=your_secret_key_here
```

請將 `your_access_key_here` 和 `your_secret_key_here` 替換為您的 AWS 憑證，並根據需要調整區域（Region）。

## 執行遷移

### 方法 1: 使用管理界面

1. 啟動開發伺服器：`npm run dev`
2. 訪問管理遷移界面：`http://localhost:3000/admin/db-migration`
3. 點擊相應按鈕進行遷移操作

### 方法 2: 使用 API

您也可以直接使用 API 端點進行遷移：

**獲取遷移狀態**:
```
GET /api/migrate
```

**執行遷移**:
```
POST /api/migrate
Content-Type: application/json

{
  "type": "all" // 可選值: "all", "users", "posts", "comments", "likes"
}
```

## 資料結構對照

### SQLite 到 DynamoDB 表格對應

| SQLite 表格   | DynamoDB 表格 | 主鍵    | 索引                                |
|--------------|--------------|---------|-------------------------------------|
| users        | Users        | id      | UsernameIndex (GSI)                 |
| posts        | Posts        | id      | IdolNameIndex (GSI), CreatedAtIndex (GSI) |
| comments     | Comments     | id      | PostIdIndex (GSI)                   |
| likes        | Likes        | id      | PostIdIndex (GSI), UserPostIndex (GSI) |

## 遷移後驗證

遷移完成後，請執行以下驗證步驟：

1. 在 AWS 控制台中檢查 DynamoDB 表格是否已創建
2. 驗證資料是否完整遷移
3. 測試應用程序的基本功能，確保與 DynamoDB 交互正常

## 疑難排解

如果遇到問題，請檢查：

1. AWS 憑證是否正確
2. IAM 權限是否足夠
3. 相關 API 端點的錯誤日誌
4. 檢查遷移狀態以獲取詳細的錯誤信息

## 代碼說明

遷移功能主要由以下文件提供：

- `src/app/utils/dynamoDBClient.ts`: DynamoDB 客戶端設定
- `src/app/utils/dynamoDBUtils.ts`: DynamoDB 表格創建與操作工具
- `src/app/utils/migrateToAWS.ts`: SQLite 到 DynamoDB 遷移邏輯
- `src/app/api/migrate/route.ts`: 遷移 API 端點
- `src/app/admin/db-migration/page.tsx`: 遷移管理界面

## 注意事項

1. 遷移過程可能需要一些時間，視資料量而定
2. 請確保 SQLite 資料庫在遷移過程中不會被修改
3. 建議在生產環境遷移前，先在測試環境進行驗證
4. 遷移完成後，請保留 SQLite 資料庫作為備份 