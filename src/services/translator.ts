import { AIProvider } from './ai-provider';
import { PM_TO_DEV_SYSTEM_PROMPT } from '../prompts/pm-to-dev';
import { DEV_TO_PM_SYSTEM_PROMPT } from '../prompts/dev-to-pm';
import { LLMProviderManager } from './llm-provider-manager';

/**
 * 翻译方向类型
 */
export type TranslationDirection = 'pm-to-dev' | 'dev-to-pm';

/**
 * 翻译服务类
 * 负责调用 AI 提供商进行翻译，并处理流式响应
 */
export class TranslatorService {
  // 保持向后兼容，构造函数参数为可选
  constructor(aiProvider?: AIProvider) {
    // 忽略传入的 aiProvider，始终从管理器获取
    if (aiProvider) {
      console.warn(
        '[TranslatorService] 构造函数参数 aiProvider 已废弃，将从 LLMProviderManager 获取提供商'
      );
    }
  }

  /**
   * 产品→开发翻译
   * @param content 产品需求描述
   * @returns 异步可迭代的翻译结果流
   */
  async *translatePMToDev(content: string): AsyncIterable<string> {
    // 从管理器获取当前激活的提供商
    const provider = LLMProviderManager.getInstance().getActiveProvider();
    const providerName = LLMProviderManager.getInstance().getActiveProviderName();

    // 验证 API Key
    if (!provider.validateApiKey()) {
      throw new Error(
        `API Key 未配置或无效，请检查当前激活的提供商 '${providerName}' 的 API Key 配置`
      );
    }

    // 调用 AI 提供商进行流式翻译
    yield* provider.generateStream(PM_TO_DEV_SYSTEM_PROMPT, content);
  }

  /**
   * 开发→产品翻译
   * @param content 技术方案描述
   * @returns 异步可迭代的翻译结果流
   */
  async *translateDevToPM(content: string): AsyncIterable<string> {
    // 从管理器获取当前激活的提供商
    const provider = LLMProviderManager.getInstance().getActiveProvider();
    const providerName = LLMProviderManager.getInstance().getActiveProviderName();

    // 验证 API Key
    if (!provider.validateApiKey()) {
      throw new Error(
        `API Key 未配置或无效，请检查当前激活的提供商 '${providerName}' 的 API Key 配置`
      );
    }

    // 调用 AI 提供商进行流式翻译
    yield* provider.generateStream(DEV_TO_PM_SYSTEM_PROMPT, content);
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
