import { AIProvider } from './ai-provider';
import { PM_TO_DEV_SYSTEM_PROMPT } from '../prompts/pm-to-dev';
import { DEV_TO_PM_SYSTEM_PROMPT } from '../prompts/dev-to-pm';

/**
 * 翻译方向类型
 */
export type TranslationDirection = 'pm-to-dev' | 'dev-to-pm';

/**
 * 翻译服务类
 * 负责调用 AI 提供商进行翻译，并处理流式响应
 */
export class TranslatorService {
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * 产品→开发翻译
   * @param content 产品需求描述
   * @returns 异步可迭代的翻译结果流
   */
  async *translatePMToDev(content: string): AsyncIterable<string> {
    // 验证 API Key
    if (!this.aiProvider.validateApiKey()) {
      throw new Error('API Key 未配置或无效，请检查环境变量 OPENAI_API_KEY');
    }

    // 调用 AI 提供商进行流式翻译
    yield* this.aiProvider.generateStream(PM_TO_DEV_SYSTEM_PROMPT, content);
  }

  /**
   * 开发→产品翻译
   * @param content 技术方案描述
   * @returns 异步可迭代的翻译结果流
   */
  async *translateDevToPM(content: string): AsyncIterable<string> {
    // 验证 API Key
    if (!this.aiProvider.validateApiKey()) {
      throw new Error('API Key 未配置或无效，请检查环境变量 OPENAI_API_KEY');
    }

    // 调用 AI 提供商进行流式翻译
    yield* this.aiProvider.generateStream(DEV_TO_PM_SYSTEM_PROMPT, content);
  }

  /**
   * 通用翻译方法
   * @param direction 翻译方向
   * @param content 待翻译内容
   * @returns 异步可迭代的翻译结果流
   */
  async *translate(
    direction: TranslationDirection,
    content: string
  ): AsyncIterable<string> {
    if (direction === 'pm-to-dev') {
      yield* this.translatePMToDev(content);
    } else if (direction === 'dev-to-pm') {
      yield* this.translateDevToPM(content);
    } else {
      throw new Error(`不支持的翻译方向: ${direction}`);
    }
  }
}
