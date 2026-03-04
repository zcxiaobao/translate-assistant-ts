import dotenv from 'dotenv';
import { createApp } from './app';
import { LLMProviderManager } from './services/llm-provider-manager';
import { OpenAIProvider } from './services/openai-provider';
import { DeepSeekProvider } from './services/deepseek-provider';

// 加载环境变量
dotenv.config();

// 初始化 LLM 提供商管理器
function initializeLLMProviders() {
  const manager = LLMProviderManager.getInstance();

  // 从环境变量读取 API Keys
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  const defaultProvider = process.env.DEFAULT_LLM_PROVIDER || 'deepseek';

  console.log('🔧 初始化 LLM 提供商...');

  // 创建并注册 OpenAI Provider（如果配置了 API Key）
  if (openaiApiKey) {
    const openaiProvider = new OpenAIProvider(openaiApiKey);
    manager.registerProvider('openai', openaiProvider);
  } else {
    console.warn('⚠️  OPENAI_API_KEY 未配置，OpenAI 提供商将不可用');
  }

  // 创建并注册 DeepSeek Provider（如果配置了 API Key）
  if (deepseekApiKey) {
    const deepseekProvider = new DeepSeekProvider(deepseekApiKey);
    manager.registerProvider('deepseek', deepseekProvider);
  } else {
    console.warn('⚠️  DEEPSEEK_API_KEY 未配置，DeepSeek 提供商将不可用');
  }

  // 设置默认激活的提供商
  const registeredProviders = manager.getRegisteredProviders();
  if (registeredProviders.length === 0) {
    throw new Error('❌ 错误: 没有可用的 LLM 提供商，请配置至少一个 API Key');
  }

  try {
    // 尝试设置用户指定的默认提供商
    manager.setActiveProvider(defaultProvider);
  } catch (error) {
    // 如果指定的提供商不存在，回退到第一个可用的提供商
    console.warn(
      `⚠️  警告: 指定的默认提供商 '${defaultProvider}' 未注册，回退到 '${registeredProviders[0]}'`
    );
    manager.setActiveProvider(registeredProviders[0]);
  }

  console.log(`✅ 已注册的提供商: ${registeredProviders.join(', ')}`);
  console.log(`✅ 当前激活的提供商: ${manager.getActiveProviderName()}`);
}

// 从环境变量获取端口配置
const PORT = parseInt(process.env.PORT || '3000');

// 初始化 LLM 提供商
initializeLLMProviders();

// 创建并启动服务器
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
  console.log(`📝 打开浏览器访问以使用翻译助手`);
});
