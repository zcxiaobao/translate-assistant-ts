## Context

当前系统已经有了良好的架构基础：
- `AIProvider` 接口定义了 AI 提供商的标准行为
- `OpenAIProvider` 实现了 OpenAI 的具体调用逻辑
- `TranslatorService` 通过依赖注入使用 AIProvider

但是当前架构存在以下局限：
1. 只支持单一的 OpenAI 提供商，无法切换到其他 LLM 服务
2. Provider 实例在应用启动时硬编码创建，无法动态切换
3. 缺少统一的配置管理机制来支持多个提供商的配置
4. 没有提供商注册和发现机制

**约束条件**:
- 必须保持现有的 AIProvider 接口不变，确保向后兼容
- 需要支持 DeepSeek AI 作为默认提供商
- 需要支持运行时动态切换，无需重启服务
- 配置信息（API Key）需要安全存储

## Goals / Non-Goals

**Goals:**
- 创建统一的 LLM 提供商管理机制，支持注册、配置、切换多个提供商
- 实现 DeepSeek Provider，并将其设为默认提供商
- 支持运行时动态切换提供商，无需重启服务
- 提供统一的配置管理接口，支持多个提供商的 API Key 和配置信息
- 解耦 TranslatorService 与具体的 Provider 实例，改为从管理器获取当前激活的 Provider
- 保持现有代码的向后兼容性

**Non-Goals:**
- 不支持同时使用多个提供商（只能有一个活跃的提供商）
- 不实现自动故障转移或负载均衡
- 不提供 UI 界面来管理提供商配置（仅通过配置文件和环境变量）
- 不在本次变更中实现其他 LLM 提供商（如 Claude、Gemini），只实现 DeepSeek

## Decisions

### 1. 提供商管理器架构：单例模式 + 工厂模式

**决策**: 创建 `LLMProviderManager` 单例类，负责管理所有提供商实例和切换逻辑。

**理由**:
- 单例模式确保全局只有一个管理器实例，便于状态管理和配置共享
- 工厂模式用于创建不同类型的 Provider 实例，支持扩展性

**备选方案**:
- ❌ 使用依赖注入容器（如 InversifyJS）：过度工程化，增加复杂度
- ❌ 使用全局变量直接存储 Provider：缺少封装和管理能力

**实现方案**:
```typescript
class LLMProviderManager {
  private static instance: LLMProviderManager;
  private providers: Map<string, AIProvider>;
  private activeProvider: string;

  static getInstance(): LLMProviderManager;
  registerProvider(name: string, provider: AIProvider): void;
  setActiveProvider(name: string): void;
  getActiveProvider(): AIProvider;
}
```

### 2. DeepSeek Provider 实现：使用 OpenAI 兼容接口

**决策**: DeepSeek 支持 OpenAI 兼容的 API 接口，因此复用 OpenAI SDK，只需修改 baseURL。

**理由**:
- DeepSeek API 完全兼容 OpenAI 的接口规范，无需重新实现客户端
- 减少代码量和维护成本
- 已有的 OpenAI SDK 成熟稳定，错误处理完善

**备选方案**:
- ❌ 使用 DeepSeek 官方 SDK：目前 DeepSeek 主要推荐使用 OpenAI SDK，没有独立的 TypeScript SDK
- ❌ 使用 HTTP 库手动调用：增加开发和维护成本

**实现方案**:
```typescript
export class DeepSeekProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string, model: string = 'deepseek-chat') {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com',
    });
  }
}
```

### 3. 配置管理：环境变量 + 配置对象

**决策**: 使用环境变量存储敏感信息（API Key），使用配置对象存储提供商元数据。

**理由**:
- 环境变量是存储敏感信息的标准做法，避免硬编码到代码中
- 配置对象支持结构化的提供商元数据（名称、模型、baseURL 等）
- 易于在不同环境（开发、生产）中切换配置

**备选方案**:
- ❌ 使用配置文件（JSON/YAML）存储 API Key：存在安全风险
- ❌ 使用数据库存储配置：过度工程化，增加系统复杂度

**配置结构**:
```typescript
interface ProviderConfig {
  name: string;
  apiKey: string;
  model?: string;
  baseURL?: string;
}
```

**环境变量命名**:
- `DEEPSEEK_API_KEY`: DeepSeek API Key（默认提供）
- `OPENAI_API_KEY`: OpenAI API Key（已有）
- `DEFAULT_LLM_PROVIDER`: 默认提供商名称（默认为 'deepseek'）

### 4. 提供商切换：修改 TranslatorService 初始化逻辑

**决策**: 修改 `TranslatorService` 不再直接持有 `AIProvider` 实例，而是在每次调用时从管理器获取当前激活的 Provider。

**理由**:
- 支持运行时动态切换提供商
- 确保始终使用最新的激活 Provider
- 保持 TranslatorService 的单一职责，只负责翻译逻辑

**备选方案**:
- ❌ 每次切换时重新创建 TranslatorService：破坏单例模式，增加内存开销
- ❌ TranslatorService 持有 Provider 引用并提供 setProvider 方法：增加状态管理复杂度

**修改方案**:
```typescript
export class TranslatorService {
  async *translatePMToDev(content: string): AsyncIterable<string> {
    const provider = LLMProviderManager.getInstance().getActiveProvider();
    yield* provider.generateStream(PM_TO_DEV_SYSTEM_PROMPT, content);
  }
}
```

### 5. 初始化流程：应用启动时注册所有提供商

**决策**: 在应用启动时（`app.ts` 或 `server.ts`）自动注册所有可用的提供商。

**理由**:
- 集中管理初始化逻辑，便于维护
- 提前验证配置的有效性，避免运行时错误
- 支持通过环境变量控制默认提供商

**初始化流程**:
1. 读取环境变量获取 API Keys
2. 创建 DeepSeek 和 OpenAI Provider 实例
3. 注册到 LLMProviderManager
4. 根据 `DEFAULT_LLM_PROVIDER` 环境变量设置激活的提供商（默认 deepseek）

## Risks / Trade-offs

### [风险] API Key 泄露风险
**风险**: 多个 API Key 存储在环境变量中，可能被意外提交到代码仓库或日志中暴露。

**缓解措施**:
- 在 `.gitignore` 中明确忽略 `.env` 文件
- 添加 API Key 验证逻辑，避免使用无效的 Key 调用 API
- 在日志中脱敏处理 API Key（只显示前后几位）

---

### [风险] Provider 切换时的状态一致性
**风险**: 如果在翻译过程中（流式响应进行中）切换提供商，可能导致响应中断或状态不一致。

**缓解措施**:
- 当前设计不支持翻译过程中切换提供商（非目标场景）
- 每次调用 `translate` 方法时获取当前激活的 Provider，确保单次翻译使用同一个 Provider
- 可在未来版本中添加"正在使用"的锁机制，防止翻译时切换

---

### [权衡] 性能开销
**权衡**: 每次翻译时都需要从管理器获取 Provider，相比直接持有引用会有轻微的性能开销。

**分析**:
- 性能影响极小（单次 Map 查找，O(1) 时间复杂度）
- 相比网络 I/O 和 LLM 推理时间，可以忽略不计
- 换取的灵活性和可维护性值得这个微小代价

---

### [权衡] 只支持单一激活提供商
**权衡**: 当前设计不支持同时使用多个提供商进行 A/B 测试或负载均衡。

**分析**:
- 符合当前需求（降低成本，灵活切换）
- 保持系统简单，避免过度设计
- 如未来需要支持多提供商并发，可以通过策略模式扩展

## Migration Plan

**部署步骤**:

1. **添加依赖** (如果需要):
   - 确认 `openai` SDK 版本支持自定义 baseURL（已安装版本应该支持）

2. **更新环境变量**:
   - 在 `.env` 文件中添加 `DEEPSEEK_API_KEY=REDACTED_KEY`
   - 添加 `DEFAULT_LLM_PROVIDER=deepseek`

3. **代码部署**:
   - 创建 `DeepSeekProvider` 类
   - 创建 `LLMProviderManager` 类
   - 修改 `TranslatorService` 的实现
   - 修改应用初始化逻辑（`app.ts` 或 `server.ts`）

4. **测试验证**:
   - 测试 DeepSeek Provider 的基本翻译功能
   - 测试提供商切换功能
   - 测试错误处理（无效 API Key、网络异常等）

5. **回滚策略**:
   - 如果 DeepSeek 出现问题，可以通过设置 `DEFAULT_LLM_PROVIDER=openai` 快速切换回 OpenAI
   - 保留原有的 `OpenAIProvider` 实现，确保可回滚性

**兼容性说明**:
- 现有的 `AIProvider` 接口不变，向后兼容
- `TranslatorService` 的公开接口不变，调用方无需修改代码
- 只需更新环境变量配置，无需修改调用代码

## Open Questions

1. **是否需要支持运行时通过 API 切换提供商？**
   - 当前设计只支持启动时通过环境变量配置
   - 如果需要运行时切换，需要添加管理接口（如 REST API 或 CLI 命令）
   - 建议先实现基础功能，根据实际需求再扩展

2. **是否需要记录提供商切换的日志和监控？**
   - 建议添加切换日志，便于排查问题
   - 可以在 `setActiveProvider` 方法中添加日志记录

3. **是否需要支持提供商级别的错误重试或降级？**
   - 当前设计不包含自动降级逻辑
   - 如果某个提供商不可用，需要手动切换
   - 可在未来版本中添加健康检查和自动降级机制
