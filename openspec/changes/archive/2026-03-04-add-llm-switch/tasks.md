## 1. 环境配置和依赖准备

- [x] 1.1 在 `.env` 文件中添加 `DEEPSEEK_API_KEY=REDACTED_KEY`
- [x] 1.2 在 `.env` 文件中添加 `DEFAULT_LLM_PROVIDER=deepseek`（可选，默认为 deepseek）
- [x] 1.3 验证现有的 `openai` SDK 版本支持自定义 `baseURL` 参数

## 2. 实现 DeepSeek Provider

- [x] 2.1 创建 `src/services/deepseek-provider.ts` 文件
- [x] 2.2 实现 `DeepSeekProvider` 类，继承 `AIProvider` 接口
- [x] 2.3 在构造函数中初始化 OpenAI 客户端，设置 `baseURL` 为 'https://api.deepseek.com'
- [x] 2.4 实现 `generateStream()` 方法，调用 DeepSeek API 返回流式响应
- [x] 2.5 实现 `validateApiKey()` 方法，验证 API Key 是否有效
- [x] 2.6 添加错误处理逻辑，处理网络错误、API 错误、超时等异常情况

## 3. 实现 LLM Provider Manager

- [x] 3.1 创建 `src/services/llm-provider-manager.ts` 文件
- [x] 3.2 实现 `LLMProviderManager` 单例类
- [x] 3.3 添加 `private providers: Map<string, AIProvider>` 存储提供商实例
- [x] 3.4 添加 `private activeProvider: string` 存储当前激活的提供商名称
- [x] 3.5 实现 `getInstance()` 静态方法，返回单例实例
- [x] 3.6 实现 `registerProvider(name: string, provider: AIProvider)` 方法，注册新提供商
- [x] 3.7 实现 `setActiveProvider(name: string)` 方法，切换激活的提供商，添加错误处理（提供商不存在时抛出异常）
- [x] 3.8 实现 `getActiveProvider(): AIProvider` 方法，返回当前激活的提供商实例，添加错误处理（未初始化时抛出异常）
- [x] 3.9 在 `setActiveProvider()` 中添加日志记录，便于追踪提供商切换

## 4. 修改 TranslatorService

- [x] 4.1 移除 `TranslatorService` 构造函数中的 `aiProvider` 参数（保持向后兼容，如果有传入则忽略）
- [x] 4.2 修改 `translatePMToDev()` 方法，从 `LLMProviderManager.getInstance().getActiveProvider()` 获取当前 Provider
- [x] 4.3 修改 `translateDevToPM()` 方法，从 `LLMProviderManager.getInstance().getActiveProvider()` 获取当前 Provider
- [x] 4.4 更新错误提示信息，提示用户配置当前激活的提供商的 API Key（而不是硬编码 OPENAI_API_KEY）

## 5. 修改应用初始化逻辑

- [x] 5.1 在 `src/app.ts` 或 `src/server.ts` 中导入 `LLMProviderManager`、`OpenAIProvider` 和 `DeepSeekProvider`
- [x] 5.2 从环境变量读取 `OPENAI_API_KEY` 和 `DEEPSEEK_API_KEY`
- [x] 5.3 创建 OpenAI Provider 实例（如果 OPENAI_API_KEY 存在）
- [x] 5.4 创建 DeepSeek Provider 实例（如果 DEEPSEEK_API_KEY 存在）
- [x] 5.5 注册 OpenAI Provider 到 `LLMProviderManager`（使用名称 'openai'）
- [x] 5.6 注册 DeepSeek Provider 到 `LLMProviderManager`（使用名称 'deepseek'）
- [x] 5.7 从环境变量读取 `DEFAULT_LLM_PROVIDER`，如果未设置则默认为 'deepseek'
- [x] 5.8 调用 `setActiveProvider()` 设置默认激活的提供商，添加错误处理（提供商未注册时回退到 deepseek）
- [x] 5.9 添加日志输出，显示已注册的提供商和当前激活的提供商

## 6. 测试验证

- [x] 6.1 启动应用，验证 DeepSeek Provider 正确注册并激活
- [x] 6.2 测试产品→开发翻译功能，验证使用 DeepSeek API
- [x] 6.3 测试开发→产品翻译功能，验证使用 DeepSeek API
- [x] 6.4 测试切换到 OpenAI Provider，验证翻译功能正常
- [x] 6.5 测试 API Key 无效时的错误处理
- [x] 6.6 测试网络异常时的错误处理
- [x] 6.7 测试未配置 DEEPSEEK_API_KEY 时的警告日志
- [x] 6.8 测试切换到不存在的提供商时的错误提示
