import {
    StartExecutionCommand,
    DescribeExecutionCommand,
    ListExecutionsCommand,
    StopExecutionCommand,
    SendTaskSuccessCommand,
    StartExecutionCommandInput,
    ListExecutionsCommandInput,
    DescribeExecutionCommandInput,
    StopExecutionCommandInput,
    SendTaskSuccessCommandInput
} from '@aws-sdk/client-sfn';
import stepFunctionsClient from './stepFunctionsClient';
import { getStateMachineArn } from './stepFunctionsMachines';

/**
 * 啟動 Step Functions 狀態機執行
 * @param stateMachineArn 狀態機的 ARN
 * @param input 執行的輸入數據 (JSON 字符串)
 * @param name 執行的名稱 (可選)
 * @returns 執行的詳細信息
 */
export async function startExecution(
    stateMachineArn: string,
    input: Record<string, unknown>,
    name?: string
) {
    const params: StartExecutionCommandInput = {
        stateMachineArn,
        input: JSON.stringify(input),
        name
    };

    try {
        const command = new StartExecutionCommand(params);
        const response = await stepFunctionsClient.send(command);
        console.log('Step Functions 執行已啟動:', response);
        return response;
    } catch (error) {
        console.error('啟動 Step Functions 執行時發生錯誤:', error);
        throw error;
    }
}

/**
 * 獲取 Step Functions 執行的詳細信息
 * @param executionArn 執行的 ARN
 * @returns 執行的詳細信息
 */
export async function describeExecution(executionArn: string) {
    const params: DescribeExecutionCommandInput = {
        executionArn
    };

    try {
        const command = new DescribeExecutionCommand(params);
        const response = await stepFunctionsClient.send(command);
        return response;
    } catch (error) {
        console.error('獲取 Step Functions 執行詳情時發生錯誤:', error);
        throw error;
    }
}

/**
 * 列出狀態機的所有執行
 * @param stateMachineArn 狀態機的 ARN
 * @param statusFilter 狀態過濾器 (可選)
 * @param maxResults 最大結果數 (可選，默認 100)
 * @returns 執行列表
 */
export async function listExecutions(
    stateMachineArn: string,
    statusFilter?: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED_OUT' | 'ABORTED',
    maxResults: number = 100
) {
    const params: ListExecutionsCommandInput = {
        stateMachineArn,
        statusFilter,
        maxResults
    };

    try {
        const command = new ListExecutionsCommand(params);
        const response = await stepFunctionsClient.send(command);
        return response.executions;
    } catch (error) {
        console.error('列出 Step Functions 執行時發生錯誤:', error);
        throw error;
    }
}

/**
 * 停止正在運行的執行
 * @param executionArn 執行的 ARN
 * @param cause 停止原因 (可選)
 * @param error 錯誤代碼 (可選)
 * @returns 停止執行的響應
 */
export async function stopExecution(
    executionArn: string,
    cause?: string,
    error?: string
) {
    const params: StopExecutionCommandInput = {
        executionArn,
        cause,
        error
    };

    try {
        const command = new StopExecutionCommand(params);
        const response = await stepFunctionsClient.send(command);
        console.log('Step Functions 執行已停止:', response);
        return response;
    } catch (error) {
        console.error('停止 Step Functions 執行時發生錯誤:', error);
        throw error;
    }
}

/**
 * 發送任務成功信號
 * @param taskToken 任務令牌
 * @param output 輸出數據 (JSON 字符串)
 * @returns 發送成功的響應
 */
export async function sendTaskSuccess(
    taskToken: string,
    output: Record<string, unknown>
) {
    const params: SendTaskSuccessCommandInput = {
        taskToken,
        output: JSON.stringify(output)
    };

    try {
        const command = new SendTaskSuccessCommand(params);
        const response = await stepFunctionsClient.send(command);
        return response;
    } catch (error) {
        console.error('發送任務成功信號時發生錯誤:', error);
        throw error;
    }
}

/**
 * 等待 Step Functions 執行完成並返回結果
 * @param executionArn 執行的 ARN
 * @param intervalMs 檢查間隔時間 (毫秒) (默認 2000)
 * @param timeoutMs 超時時間 (毫秒) (默認 300000，即 5 分鐘)
 * @returns 執行的最終狀態和輸出
 */
export async function waitForExecution(
    executionArn: string,
    intervalMs: number = 2000,
    timeoutMs: number = 300000
): Promise<{
    status: string | undefined;
    rawOutput: string | null;
    output: Record<string, unknown> | null;
    execution: unknown;
}> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
        const execution = await describeExecution(executionArn);

        if (execution.status !== 'RUNNING') {
            // 保留原始回應格式，不對 output 進行 JSON.parse 處理
            let rawOutput = null;
            let parsedOutput = null;

            if (execution.output) {
                rawOutput = execution.output;
                try {
                    parsedOutput = JSON.parse(execution.output);
                } catch (e) {
                    console.error('解析輸出時發生錯誤:', e);
                }
            }

            return {
                status: execution.status,
                rawOutput: rawOutput,
                output: parsedOutput,
                execution
            };
        }

        // 等待指定的間隔時間
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error(`執行超時，超過了 ${timeoutMs}ms`);
}

/**
 * 使用 Step Functions 創建和執行數據處理工作流
 * @param workflowType 工作流類型
 * @param inputData 輸入數據
 * @returns 處理結果
 */
export async function runDataProcessingWorkflow(
    workflowType: 'ETL' | 'ANALYSIS' | 'MIGRATION' | 'IDOL_MULTIMODAL',
    inputData: Record<string, unknown>
) {
    // 從配置獲取狀態機 ARN
    const stateMachineArn = getStateMachineArn(workflowType);

    if (!stateMachineArn) {
        throw new Error(`未找到 ${workflowType} 工作流的狀態機 ARN 配置`);
    }

    // 啟動執行
    const execution = await startExecution(stateMachineArn, {
        workflowType,
        data: inputData,
        timestamp: new Date().toISOString()
    });

    // 確保 executionArn 存在
    if (!execution.executionArn) {
        throw new Error('執行啟動後未返回有效的執行 ARN');
    }

    // 等待執行完成並返回結果
    return await waitForExecution(execution.executionArn);
}

/**
 * 啟動偶像多模態處理工作流
 * @param mediaId 媒體ID
 * @param mediaType 媒體類型 (image, video, audio, text)
 * @param contentData 內容資料
 * @returns 處理結果
 */
export async function startIdolMultimodalWorkflow(
    mediaId: string,
    mediaType: 'image' | 'video' | 'audio' | 'text',
    contentData: Record<string, unknown>
) {
    const input = {
        mediaId,
        mediaType,
        contentData,
        processTimestamp: new Date().toISOString()
    };

    return await runDataProcessingWorkflow('IDOL_MULTIMODAL', input);
} 