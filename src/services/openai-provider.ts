import OpenAI from 'openai';
import { AIProvider } from './ai-provider';

/**
 * OpenAI 提供商实现
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;
  private apiKey: string;

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  /**
   * 验证 API Key 是否已配置
   */
  validateApiKey(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 0;
  }

  /**
   * 生成流式响应
   * 支持 AsyncIterable 返回，逐块返回生成的内容
   */
  async *generateStream(
    systemPrompt: string,
    userMessage: string
  ): AsyncIterable<string> {
    try {
      // 调用 OpenAI API 进行流式响应
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: true,
      });

      // 逐块返回生成的内容
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error: any) {
      // 错误处理逻辑
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('网络连接失败，请检查网络设置');
      } else if (error.status === 401) {
        throw new Error('API Key 无效，请检查配置');
      } else if (error.status === 429) {
        throw new Error('API 请求过于频繁，请稍后重试');
      } else if (error.status >= 500) {
        throw new Error('OpenAI 服务暂时不可用，请稍后重试');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('请求超时，请稍后重试');
      } else {
        throw new Error(`API 调用失败: ${error.message || '未知错误'}`);
      }
    }
  }
}
