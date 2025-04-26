# SQLite 到 DynamoDB 資料庫遷移指南

本文檔提供完整的從 SQLite 遷移到 AWS DynamoDB 的步驟說明和最佳實踐指南。

## 目錄

1. [前置準備](#前置準備)
2. [環境設定](#環境設定)
3. [資料遷移流程](#資料遷移流程)
4. [應用程式切換](#應用程式切換)
5. [最佳實踐](#最佳實踐)
6. [故障排除](#故障排除)
7. [參考資料](#參考資料)

## 前置準備

在開始遷移前，請確保您已具備：

1. **AWS 帳戶與權限**
   - 有效的 AWS 帳戶
   - 具有創建和管理 DynamoDB 表格的 IAM 權限
   - 存取金鑰 (Access Key) 和秘密金鑰 (Secret Key)

2. **本機開發環境**
   - Node.js 18+ 和 npm
   - 這個專案的最新代碼

3. **了解現有資料結構**
   - 熟悉當前 SQLite 的資料表結構和關聯
   - 了解 DynamoDB 的 NoSQL 資料模型

## 環境設定

### 1. 安裝相關依賴

專案已包含所需依賴，但如需手動安裝：

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 2. 設定環境變數

在專案根目錄創建或編輯 `.env.local` 檔案：

```
# AWS DynamoDB 設定
REGION=ap-northeast-1  # 依您的偏好修改
ACCESS_KEY_ID=your_access_key_here
SECRET_ACCESS_KEY=your_secret_key_here

# 選用設定
DEFAULT_DB_TYPE=sqlite      # 或 dynamodb
DYNAMODB_TABLE_PREFIX=      # 可選的表格名稱前綴
```

## 資料遷移流程

### 1. 使用遷移控制台

我們提供了完整的網頁界面來執行和監控資料遷移：

1. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 訪問遷移控制台：
   ```
   http://localhost:3000/migration-console
   ```

3. 在控制台中，您可以：
   - 遷移所有或特定資料表
   - 監控遷移進度和狀態
   - 切換當前使用的資料庫
   - 檢視遷移後的資料

### 2. 使用 API 端點

如需以程式方式執行遷移，可使用以下 API 端點：

**開始遷移特定資料**：
```
POST /api/migrate
Content-Type: application/json

{
  "type": "all"  // 可選值: "all", "users", "posts", "comments", "likes"
}
```

**檢查遷移狀態**：
```
GET /api/migrate
```

**快速遷移所有資料**：
```
GET /api/db-migration/run
```

**查看表格資料**：
```
GET /api/db-migration/data?table=TableName
```

### 3. 使用程式碼直接遷移

您也可以在自己的代碼中直接調用遷移功能：

```typescript
import { migrateAllData } from './src/app/utils/migrateToAWS';

async function runMigration() {
  try {
    const result = await migrateAllData();
    console.log('遷移完成:', result);
  } catch (error) {
    console.error('遷移失敗:', error);
  }
}
```

## 應用程式切換

### 從 SQLite 切換到 DynamoDB

完成遷移後，您有以下方式切換應用程式使用的資料庫：

#### 1. 使用控制台切換

在遷移控制台中的「資料庫切換」頁籤中切換資料庫類型（僅對當前會話有效）。

#### 2. 設定環境變數

編輯 `.env.local` 文件並設定：

```
DEFAULT_DB_TYPE=dynamodb
```

#### 3. 程式中切換

```typescript
import { setDbType, DbType } from './src/app/utils/dbService';

// 切換到 DynamoDB
setDbType(DbType.DYNAMODB);

// 切換到 SQLite
setDbType(DbType.SQLITE);
```

### 通用資料操作接口

我們提供了一組通用接口，可以根據設定的資料庫類型自動操作正確的資料庫：

```typescript
import { 
  insertData, 
  getById, 
  queryList, 
  updateData, 
  deleteData 
} from './src/app/utils/dbService';

// 這些函數會根據當前設定的資料庫類型操作 SQLite 或 DynamoDB
const user = await getById('users', 'user-123');
const posts = await queryList('posts', { idolName: 'idol-name' });
```

## 資料表對應

| SQLite 表格   | DynamoDB 表格 | 主鍵 | 全域二級索引 (GSI) |
|--------------|--------------|------|-------------------|
| users        | Users        | id   | UsernameIndex     |
| posts        | Posts        | id   | IdolNameIndex, CreatedAtIndex |
| comments     | Comments     | id   | PostIdIndex       |
| likes        | Likes        | id   | PostIdIndex, UserPostIndex |

## 最佳實踐

### 遷移前準備

1. **備份資料**
   - 在遷移前備份您的 SQLite 資料庫文件

2. **測試環境驗證**
   - 在生產環境使用前，先在測試環境完成遷移和驗證

3. **容量規劃**
   - 根據資料量和存取模式設定 DynamoDB 的讀寫容量單位

### 遷移中注意事項

1. **批次處理**
   - 大量資料建議分批遷移，避免一次性處理過多資料

2. **監控進度**
   - 使用遷移控制台或 API 監控遷移進度

3. **錯誤處理**
   - 記錄並分析遷移過程中的錯誤，確保資料完整性

### 遷移後檢查

1. **資料完整性驗證**
   - 比較源資料庫和目標資料庫的記錄數量
   - 抽樣檢查資料內容是否正確

2. **應用程式功能測試**
   - 在切換到 DynamoDB 後測試所有關鍵功能

3. **效能測試**
   - 評估應用程式使用 DynamoDB 後的效能表現

## 故障排除

### 常見問題

1. **遷移失敗**
   - 檢查 AWS 憑證是否正確
   - 確認 IAM 用戶有足夠權限
   - 查看應用程式日誌了解詳細錯誤

2. **資料不一致**
   - 檢查資料轉換邏輯是否正確處理所有欄位
   - 注意資料類型轉換（如日期、數字等）

3. **效能問題**
   - 確認 DynamoDB 容量單位設定是否合適
   - 檢查查詢模式是否使用了適合的索引

### 日誌檢查

遷移過程的詳細日誌可在以下位置查看：

- 控制台輸出
- 應用程式日誌
- 遷移控制台的狀態顯示

## 參考資料

- [AWS DynamoDB 開發者指南](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
- [DynamoDB 最佳實踐](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

---

如有任何問題或需要協助，請聯繫項目維護者。 