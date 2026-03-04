import { AIProvider } from './ai-provider';

/**
 * LLM 提供商管理器
 * 单例模式，负责管理所有提供商实例和切换逻辑
 */
export class LLMProviderManager {
  private static instance: LLMProviderManager;
  private providers: Map<string, AIProvider>;
  private activeProvider: string | null;

  private constructor() {
    this.providers = new Map();
    this.activeProvider = null;
  }

  /**
   * 获取单例实例
   */
  static getInstance(): LLMProviderManager {
    if (!LLMProviderManager.instance) {
      LLMProviderManager.instance = new LLMProviderManager();
    }
    return LLMProviderManager.instance;
  }

  /**
   * 注册新的提供商
   * @param name 提供商名称（如 'openai', 'deepseek'）
   * @param provider AIProvider 实例
   */
  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider);
    console.log(`[LLMProviderManager] 已注册提供商: ${name}`);
  }

  /**
   * 设置激活的提供商
   * @param name 提供商名称
   * @throws 如果提供商未注册则抛出错误
   */
  setActiveProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(
        `提供商 '${name}' 未注册。已注册的提供商: ${Array.from(this.providers.keys()).join(', ')}`
      );
    }

    const oldProvider = this.activeProvider;
    this.activeProvider = name;

    if (oldProvider !== name) {
      console.log(`[LLMProviderManager] 切换提供商: ${oldProvider || '无'} → ${name}`);
    }
  }

  /**
   * 获取当前激活的提供商实例
   * @returns 当前激活的 AIProvider 实例
   * @throws 如果未初始化任何提供商则抛出错误
   */
  getActiveProvider(): AIProvider {
    if (!this.activeProvider) {
      throw new Error(
        '尚未设置激活的提供商。请先调用 setActiveProvider() 方法设置提供商。'
      );
    }

    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(
        `激活的提供商 '${this.activeProvider}' 不存在。这不应该发生。`
      );
    }

    return provider;
  }

  /**
   * 获取所有已注册的提供商名称
   */
  getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * 获取当前激活的提供商名称
   */
  getActiveProviderName(): string | null {
    return this.activeProvider;
  }
}
