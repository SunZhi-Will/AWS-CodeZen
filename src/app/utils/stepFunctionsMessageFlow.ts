import { startIdolMultimodalWorkflow } from './stepFunctionsUtils';


/**
 * 訊息回覆類型定義
 */
export type MessageReplyStyle = 'emotion' | 'brand' | 'mixed' | '';

/**
 * 訊息內容結構
 */
export interface MessageContent {
    id: number;
    content: string;
    user: string;
    time: string;
    sourcePost?: {
        id: string | number;
        idolName: string;
        postType: string;
        content: string;
    };
}

/**
 * AI 回覆建議結果
 */
export interface AiReplyRecommendation {
    emotionReply: string;
    brandReply: string;
    mixedReply: string;
    scores: {
        emotionScore: number;
        brandScore: number;
        engagementPotential: number;
    };
    originalIdolReply?: string;
}

/**
 * 使用 Step Functions 取得 AI 回覆建議
 * @param message 訊息內容
 * @returns AI 回覆建議結果的 Promise
 */
export async function getAiReplyRecommendations(message: MessageContent): Promise<AiReplyRecommendation> {
    try {
        // 準備輸入資料
        const inputData = {
            messageId: message.id,
            messageContent: message.content,
            user: message.user,
            timestamp: new Date().toISOString(),
            sourceContext: message.sourcePost ? {
                postId: message.sourcePost.id,
                idolName: message.sourcePost.idolName,
                postType: message.sourcePost.postType,
                content: message.sourcePost.content
            } : null,
            requestType: 'MESSAGE_REPLY_SUGGESTIONS'
        };

        // 呼叫多模態工作流
        const result = await startIdolMultimodalWorkflow(
            `msg-${message.id}`,
            'text',
            inputData
        );

        // 解析結果
        if (result && result.output) {
            // 檢查是否有 idol_reply 字段，這是後端可能直接返回的格式
            if (result.rawOutput) {
                try {
                    const rawData = JSON.parse(result.rawOutput);
                    if (rawData && rawData.idol_reply) {
                        // 等待1秒，模擬各個回覆請求之間的延遲
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // 將 idol_reply 整合到所有回覆中
                        return {
                            ...(result.output as unknown as AiReplyRecommendation),
                            emotionReply: rawData.idol_reply, // 將 idol_reply 應用到情感回覆
                            brandReply: rawData.idol_reply,   // 將 idol_reply 應用到品牌回覆
                            mixedReply: rawData.idol_reply,   // 將 idol_reply 應用到混合風格回覆
                            originalIdolReply: rawData.idol_reply // 保存原始的 idol_reply
                        };
                    }
                } catch (e) {
                    console.error('解析原始回覆時發生錯誤:', e);
                }
            }
            return result.output as unknown as AiReplyRecommendation;
        }

        // 若沒有正確結果，傳回預設回覆
        return getDefaultReplySuggestions(message);
    } catch (error) {
        console.error('取得 AI 回覆建議時發生錯誤:', error);
        // 發生錯誤時傳回預設回覆
        return getDefaultReplySuggestions(message);
    }
}

/**
 * 取得預設回覆建議（當 AI 流程失敗時使用）
 * @param message 訊息內容
 * @returns 預設回覆建議
 */
function getDefaultReplySuggestions(message: MessageContent): AiReplyRecommendation {
    const defaultContent = message.content.length > 0
        ? `謝謝您的留言「${message.content.substring(0, 20)}${message.content.length > 20 ? '...' : ''}」`
        : '謝謝您的留言';

    return {
        emotionReply: `${defaultContent}！💕 我們非常重視您的意見，感謝您的支持與鼓勵～`,
        brandReply: `感謝您的留言。星光夢想家團隊已收到您的訊息，我們將儘快回覆您的問題。`,
        mixedReply: `${defaultContent}！✨ 我們已收到您的訊息，感謝您對星光夢想家的支持！`,
        scores: {
            emotionScore: 0.7,
            brandScore: 0.7,
            engagementPotential: 0.6
        }
    };
}

/**
 * 使用 Step Functions 處理並提交回覆
 * @param messageId 訊息 ID
 * @param replyContent 回覆內容
 * @param replyStyle 回覆風格
 * @returns 處理結果
 */
export async function processMessageReply(
    messageId: number,
    replyContent: string,
    replyStyle: MessageReplyStyle
): Promise<unknown> {
    try {
        // 準備輸入資料
        const inputData = {
            messageId,
            replyContent,
            replyStyle,
            timestamp: new Date().toISOString(),
            action: 'PROCESS_REPLY'
        };

        // 呼叫回覆處理工作流
        const result = await startIdolMultimodalWorkflow(
            `reply-${messageId}-${Date.now()}`,
            'text',
            inputData
        );

        return result;
    } catch (error) {
        console.error('處理訊息回覆時發生錯誤:', error);
        throw error;
    }
} 