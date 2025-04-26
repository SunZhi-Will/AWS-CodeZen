/**
 * AWS Step Functions 狀態機資訊配置
 * 此文件定義專案使用的 Step Functions 狀態機的 ARN 和相關資訊
 */

export const STEP_FUNCTIONS_MACHINES = {
    // 偶像多模態處理工作流
    IDOL_MULTIMODAL_FLOW: {
        NAME: 'idol-multimodal-flow',
        ARN: 'arn:aws:states:us-west-2:422163173683:stateMachine:idol-multimodal-flow',
        ROLE_ARN: 'arn:aws:iam::422163173683:role/service-role/StepFunctions-idol-multimodal-flow-role-3nj3i9h7s',
        DESCRIPTION: '處理偶像內容的多模態工作流，整合影像、音訊和文字內容處理'
    },

    // 可在此處添加更多狀態機定義
    ETL: {
        NAME: 'etl-data-processing',
        ARN: '', // 待設定
        DESCRIPTION: 'ETL 資料處理工作流'
    },

    ANALYSIS: {
        NAME: 'data-analysis-workflow',
        ARN: '', // 待設定
        DESCRIPTION: '資料分析工作流'
    },

    MIGRATION: {
        NAME: 'data-migration-workflow',
        ARN: '', // 待設定
        DESCRIPTION: '資料遷移工作流'
    }
};

/**
 * 根據工作流類型獲取狀態機 ARN
 * @param workflowType 工作流類型
 * @returns 狀態機 ARN
 */
export function getStateMachineArn(workflowType: string): string {
    switch (workflowType) {
        case 'IDOL_MULTIMODAL':
            return STEP_FUNCTIONS_MACHINES.IDOL_MULTIMODAL_FLOW.ARN;
        case 'ETL':
            return STEP_FUNCTIONS_MACHINES.ETL.ARN || process.env.ETL_STATE_MACHINE_ARN || '';
        case 'ANALYSIS':
            return STEP_FUNCTIONS_MACHINES.ANALYSIS.ARN || process.env.ANALYSIS_STATE_MACHINE_ARN || '';
        case 'MIGRATION':
            return STEP_FUNCTIONS_MACHINES.MIGRATION.ARN || process.env.MIGRATION_STATE_MACHINE_ARN || '';
        default:
            throw new Error(`未找到 ${workflowType} 工作流的狀態機 ARN 配置`);
    }
} 