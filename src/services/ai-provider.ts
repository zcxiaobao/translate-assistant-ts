/**
 * AI 提供商接口
 * 支持可插拔的 AI 服务实现
 */
export interface AIProvider {
  /**
   * 生成流式响应
   * @param systemPrompt 系统提示词
   * @param userMessage 用户消息
   * @returns 异步可迭代的字符串流
   */
  generateStream(
    systemPrompt: string,
    userMessage: string
  ): AsyncIterable<string>;

  /**
   * 验证 API Key 是否已配置
   * @returns 如果 API Key 有效返回 true，否则返回 false
   */
  validateApiKey(): boolean;
}
