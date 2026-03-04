# 职能沟通翻译助手

> 基于 AI 的智能翻译助手，弥合产品经理、开发工程师、运营人员之间的沟通鸿沟

一个使用 AI 大模型驱动的职能沟通翻译工具，帮助不同职能角色更好地理解彼此的语言和思维方式。通过精心设计的提示词工程，将产品语言、技术语言、运营语言相互转换，提升团队协作效率。

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm 或 pnpm

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置 API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件，至少配置一个 LLM 提供商的 API Key：

```env
# OpenAI API 配置（可选）
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# DeepSeek API 配置（可选）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat

# 默认使用的 LLM 提供商（openai 或 deepseek）
DEFAULT_LLM_PROVIDER=deepseek

# 服务器端口（默认 3000）
PORT=3000

# 最大内容长度限制（默认 2000 字符）
MAX_CONTENT_LENGTH=2000
```

> **注意**：至少需要配置一个 API Key（OPENAI_API_KEY 或 DEEPSEEK_API_KEY），系统会自动使用已配置的提供商。

### 3. 运行项目

**开发模式（支持热重载）**：

```bash
npm run dev
```

**生产模式**：

```bash
npm run build
npm start
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`

## ✨ 功能说明

### 🔄 六向翻译支持

支持产品经理、开发工程师、运营人员三个角色之间的双向翻译：

| 翻译方向 | 说明 | 输出重点 |
|---------|------|---------|
| **产品 → 开发** | 将产品需求翻译为技术实现方案 | 技术方案、数据处理、性能要求、工作量评估 |
| **开发 → 产品** | 将技术方案翻译为业务价值 | 用户体验、业务增长、商业价值、成本收益 |
| **产品 → 运营** | 将产品需求翻译为运营策略 | 增长机会、数据指标、运营手段、效果预估 |
| **开发 → 运营** | 将技术方案翻译为数据和功能说明 | 功能可用性、数据埋点、性能影响、上线时间 |
| **运营 → 产品** | 将运营需求翻译为产品功能 | 用户价值、功能优先级、业务影响、产品规划 |
| **运营 → 开发** | 将运营需求翻译为技术需求 | 数据需求、接口需求、埋点需求、技术方案 |

### 🎯 智能特性

- **流式输出**：实时展示 AI 生成过程，无需等待完整结果
- **智能补充**：自动识别输入中的缺失信息并主动补充关键关注点
- **结构化输出**：按固定格式输出，便于阅读和理解
- **类型安全**：TypeScript 全栈实现，编译时类型检查
- **多模型支持**：支持 OpenAI、DeepSeek 等多个 LLM 提供商

### 🔌 可扩展架构

- **可插拔 AI 提供商**：轻松切换或添加新的 LLM 提供商
- **提示词模块化**：独立的提示词文件，便于迭代优化
- **Few-shot Learning**：每个翻译方向都包含完整示例

## 📝 测试用例

### 示例 1: 产品 → 开发翻译

**输入（产品视角）**：
```
我们需要一个智能推荐功能，提升用户停留时长
```

**翻译结果（开发视角）**：
```
## 技术实现方案
建议采用协同过滤算法（Collaborative Filtering），可以选择基于用户的
协同过滤或基于物品的协同过滤。考虑到实时性要求，推荐使用 Redis 缓存
热门推荐结果，降低响应延迟。

## 数据来源和处理方式
- 数据来源：用户行为日志（浏览、点击、收藏等）
- 离线处理：每天凌晨通过 Spark 批处理计算相似度矩阵
- 实时处理：用户请求时从 Redis 读取预计算结果，结合实时行为微调

## 性能和实时性要求
- 响应时间：< 100ms
- 并发支持：QPS 1000+
- 准确率目标：推荐点击率提升 20%

## 预估开发工作量
- 算法实现和调试：3-5 天
- 数据管道搭建：2-3 天
- 接口开发和测试：2 天
- 总计：约 7-10 天

## 需要明确的技术问题
1. 用户行为数据的历史积累量有多少？
2. 是否需要考虑冷启动问题（新用户/新内容）？
3. 推荐结果的更新频率要求是实时还是准实时（如每小时更新）？
```

---

### 示例 2: 开发 → 产品翻译

**输入（开发视角）**：
```
我们优化了数据库查询，QPS 提升了 30%
```

**翻译结果（产品视角）**：
```
## 用户体验提升
- 页面加载速度更快：用户打开页面的等待时间缩短约 30%，从原来的
  3 秒降低到 2 秒左右
- 操作响应更流畅：搜索、筛选等操作的响应时间明显缩短，用户不再需要
  长时间等待
- 减少卡顿和超时：高峰期用户遇到的页面卡顿或超时问题将大幅减少

## 业务增长空间
- 支持更多并发用户：原来系统只能稳定支持 1000 人同时在线，现在可以
  支持 1300+ 人
- 为未来增长预留空间：在用户量增长 30% 的情况下，系统依然能保持当前
  的响应速度

## 商业价值
- 提升用户留存：更快的响应速度可以降低用户流失率，预计用户留存率
  提升 5-10%
- 降低服务器成本：相同的服务器资源可以服务更多用户，延缓服务器扩容
  时间约 3-6 个月
- 提升转化率：更好的体验有助于提升购买转化率，预计 GMV 提升 2-3%
```

---

### 示例 3: 运营 → 产品翻译

**输入（运营视角）**：
```
我们需要提升推荐内容的点击率，目前只有 8%，希望能达到 15% 以上
```

**翻译结果（产品视角）**：
```
## 用户价值分析
当前用户在浏览推荐内容时，点击率偏低说明推荐的内容与用户兴趣匹配度不够高。
提升推荐准确性可以：
1. 帮助用户更快找到感兴趣的内容，节省浏览时间
2. 减少无效信息干扰，提升浏览体验
3. 增加用户发现优质内容的机会，提高满意度

## 功能优先级建议
**优先级：高（P0）**
- 推荐是核心功能，直接影响用户体验和留存
- 点击率从 8% 提升到 15% 能显著提升整体活跃度
- 建议在下个迭代（2-3 周内）启动优化

## 业务影响预估
如果点击率从 8% 提升到 15%，预计带来：
1. 用户停留时长提升 30-40%（从平均 5 分钟到 7 分钟）
2. 7 日留存率提升 10-15 个百分点
3. 内容消费量增加 50%，带动广告收入增长 20-25%

## 产品规划建议
**短期优化方向**（2-3 周）：
1. 优化推荐算法：引入用户画像和协同过滤，提高推荐准确性
2. 改进推荐位样式：A/B 测试不同的展示样式，找到最优方案
3. 增加个性化标签：让用户主动选择兴趣标签，辅助推荐
```

## 🎨 提示词设计说明

### 设计理念

本项目的核心是**提示词工程**，通过精心设计的提示词让 AI 理解不同职能角色的思维模式和关注重点。

### 关键设计点

#### 1. 系统角色定义

每个翻译方向都有明确的系统角色设定：

- **产品 → 开发**：AI 扮演"资深技术专家"
  - 关注点：技术实现、数据来源、性能要求、工作量评估
  - 语言风格：技术导向，包含专业术语

- **开发 → 产品**：AI 扮演"产品顾问"
  - 关注点：用户体验、业务增长、商业价值、成本收益
  - 语言风格：业务导向，避免技术术语

- **产品 → 运营**：AI 扮演"运营顾问/增长专家"
  - 关注点：用户增长、数据指标、活动策划、ROI
  - 语言风格：数据驱动，强调指标和效果

- **开发 → 运营**：AI 扮演"运营数据分析师"
  - 关注点：功能可用性、数据埋点、性能影响
  - 语言风格：简单易懂，避免技术术语

- **运营 → 产品**：AI 扮演"产品经理"
  - 关注点：用户价值、功能优先级、业务影响
  - 语言风格：产品导向，强调用户价值

- **运营 → 开发**：AI 扮演"技术需求分析师"
  - 关注点：数据需求、接口需求、埋点需求
  - 语言风格：技术导向，明确规范

#### 2. 结构化输出

提示词明确要求 AI 按照固定的结构输出翻译结果，确保信息完整且便于阅读：

- 产品 → 开发：技术方案 → 数据处理 → 性能要求 → 工作量 → 待明确问题
- 开发 → 产品：用户体验 → 业务增长 → 商业价值 → 待关注问题
- 产品 → 运营：增长机会 → 数据指标 → 运营策略 → 效果预估
- 开发 → 运营：功能说明 → 数据埋点 → 性能影响 → 可用时间
- 运营 → 产品：用户价值 → 优先级 → 业务影响 → 产品规划
- 运营 → 开发：数据需求 → 接口需求 → 埋点需求 → 技术方案

#### 3. 主动补充机制

提示词指导 AI 在输入内容不够明确时，主动补充对方角色可能关心的问题：

- 产品需求模糊时 → 补充技术关注点和需要明确的技术问题
- 技术方案缺少业务背景时 → 补充业务价值和用户影响分析
- 运营需求抽象时 → 补充技术细节或产品功能建议

#### 4. Few-shot Learning

每个翻译方向都提供了完整的示例（Few-shot Learning），帮助 AI 理解期望的输出风格和内容深度。

示例文件位置：
- `src/prompts/pm-to-dev.ts` - 产品→开发示例
- `src/prompts/dev-to-pm.ts` - 开发→产品示例
- `src/prompts/pm-to-operation.ts` - 产品→运营示例
- `src/prompts/dev-to-operation.ts` - 开发→运营示例
- `src/prompts/operation-to-pm.ts` - 运营→产品示例
- `src/prompts/operation-to-dev.ts` - 运营→开发示例

#### 5. 长度控制

提示词要求输出长度在 200-500 字，确保信息量充足但不冗长，便于快速阅读和理解。

### 提示词优化建议

如需优化提示词效果，可以：

1. **调整系统角色描述**：使其更贴近实际工作场景和团队文化
2. **增加或修改示例**：覆盖更多实际业务场景
3. **细化输出结构**：根据团队需求调整输出格式
4. **优化关注点清单**：基于实际使用反馈调整各角色的关注重点

## 🏗️ 技术架构

### 技术栈

**后端**：
- **语言**：TypeScript
- **框架**：Express 5
- **AI SDK**：OpenAI SDK (兼容 DeepSeek 等)
- **流式输出**：Server-Sent Events (SSE)
- **环境管理**：dotenv

**前端**：
- **技术栈**：原生 HTML/CSS/JavaScript
- **通信**：Fetch API + ReadableStream
- **样式**：响应式设计，支持移动端
- **UI 设计**：现代扁平化风格，渐变背景

### 项目结构

```
translate-assistant-ts/
├── src/
│   ├── services/
│   │   ├── ai-provider.ts           # AI 提供商接口定义
│   │   ├── openai-provider.ts       # OpenAI 提供商实现
│   │   ├── deepseek-provider.ts     # DeepSeek 提供商实现
│   │   ├── llm-provider-manager.ts  # LLM 提供商管理器（单例）
│   │   └── translator.ts            # 翻译服务（核心业务逻辑）
│   ├── prompts/
│   │   ├── pm-to-dev.ts             # 产品→开发提示词
│   │   ├── dev-to-pm.ts             # 开发→产品提示词
│   │   ├── pm-to-operation.ts       # 产品→运营提示词
│   │   ├── dev-to-operation.ts      # 开发→运营提示词
│   │   ├── operation-to-pm.ts       # 运营→产品提示词
│   │   └── operation-to-dev.ts      # 运营→开发提示词
│   ├── routes/
│   │   └── translate.ts             # 翻译 API 路由
│   ├── app.ts                       # Express 应用配置
│   └── server.ts                    # 服务器入口（初始化 LLM 提供商）
├── public/
│   └── index.html                   # Web UI（单页应用）
├── openspec/                        # OpenSpec 规范和变更历史
│   ├── specs/                       # 主规范文件
│   │   ├── prompt-engineering/      # 提示词工程规范
│   │   ├── translation-engine/      # 翻译引擎规范
│   │   ├── user-interface/          # 用户界面规范
│   │   └── llm-provider-management/ # LLM 提供商管理规范
│   └── changes/archive/             # 已归档的变更历史
├── .env.example                     # 环境变量示例
├── package.json                     # 项目依赖
├── tsconfig.json                    # TypeScript 配置
└── README.md                        # 项目文档
```

### 核心模块说明

#### 1. LLM 提供商管理 (llm-provider-manager.ts)

使用**单例模式**管理多个 LLM 提供商：

- 动态注册和切换提供商
- 统一的接口抽象（AIProvider）
- 支持运行时切换，无需重启服务

#### 2. 翻译服务 (translator.ts)

核心业务逻辑：

- 定义 6 个翻译方向的类型
- 实现 6 个翻译方法（每个方向一个）
- 支持流式输出（AsyncIterable）
- 类型安全的验证逻辑

#### 3. API 路由 (routes/translate.ts)

RESTful API 接口：

- POST `/api/translate` - 翻译接口
- 请求验证：翻译方向、内容长度
- SSE 流式响应
- 错误处理和友好提示

#### 4. 提示词模块 (prompts/)

模块化的提示词设计：

- 每个翻译方向独立文件
- 系统角色 + 关注点清单 + 输出结构
- Few-shot Learning 示例
- 便于迭代优化和版本管理

## 🛠️ 开发指南

### 添加新的 LLM 提供商

1. 实现 `AIProvider` 接口：

```typescript
// src/services/your-provider.ts
import { AIProvider } from './ai-provider';

export class YourProvider implements AIProvider {
  constructor(private apiKey: string) {}

  validateApiKey(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  async *generateStream(systemPrompt: string, userPrompt: string): AsyncIterable<string> {
    // 实现流式生成逻辑
  }
}
```

2. 在 `server.ts` 中注册提供商：

```typescript
import { YourProvider } from './services/your-provider';

const yourApiKey = process.env.YOUR_API_KEY;
if (yourApiKey) {
  const yourProvider = new YourProvider(yourApiKey);
  manager.registerProvider('your-provider', yourProvider);
}
```

3. 更新 `.env.example` 添加配置说明

### 添加新的翻译方向

如需扩展更多职能角色（如：设计师、测试工程师等）：

1. 在 `src/services/translator.ts` 中扩展 `TranslationDirection` 类型
2. 创建新的提示词文件（如 `src/prompts/pm-to-designer.ts`）
3. 在 `TranslatorService` 中添加新的翻译方法
4. 更新 `translate()` 方法的路由逻辑
5. 在前端 UI 添加新的翻译方向选项

### 优化提示词

提示词文件位于 `src/prompts/` 目录：

1. 修改系统角色描述（SYSTEM_PROMPT）
2. 调整关注点清单和输出结构
3. 更新或添加 Few-shot 示例（EXAMPLES 数组）
4. 重新编译并测试效果

```bash
npm run build
npm start
```

## 📊 OpenSpec 开发工作流

本项目采用 [OpenSpec](https://openspec.dev) 规范驱动的开发流程：

### 工作流程

1. **创建变更** (`/opsx:new`) - 创建新的功能或修复
2. **生成 Proposal** - 定义需求和影响范围
3. **编写 Design** - 设计技术方案
4. **创建 Specs** - 定义详细规范
5. **分解 Tasks** - 生成实施任务清单
6. **实施变更** (`/opsx:apply`) - 逐步完成任务
7. **归档变更** (`/opsx:archive`) - 同步规范并归档

### 已归档的变更

- **add-llm-switch** - 添加多 LLM 提供商支持
- **add-operation-role** - 添加运营角色翻译功能
- **fix-operation-translations** - 修复运营翻译验证逻辑
- **pm-dev-translator** - 初始产品↔开发翻译功能

详见 `openspec/changes/archive/` 目录。

## 📄 许可证

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**Built with ❤️ using TypeScript, Express, and OpenAI**
