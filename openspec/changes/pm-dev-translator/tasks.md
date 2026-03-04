## 1. 项目初始化

- [x] 1.1 初始化 TypeScript 项目并配置 tsconfig.json
- [x] 1.2 安装必要依赖 (express, openai, dotenv, @types/express, @types/node, tsx)
- [x] 1.3 创建项目目录结构 (src/services, src/prompts, src/routes, public)
- [x] 1.4 配置 package.json 脚本 (dev, build, start)

## 2. AI 提供商接口层

- [x] 2.1 定义 AI 提供商接口 (src/services/ai-provider.ts)
- [x] 2.2 实现 OpenAI 提供商类 (src/services/openai-provider.ts)
- [x] 2.3 添加流式输出支持，返回 AsyncIterable<string>
- [x] 2.4 添加错误处理逻辑 (API 调用失败、网络错误、超时)
- [x] 2.5 添加 API Key 验证逻辑

## 3. 提示词设计

- [x] 3.1 设计产品→开发提示词 (src/prompts/pm-to-dev.ts)
- [x] 3.2 设计开发→产品提示词 (src/prompts/dev-to-pm.ts)
- [x] 3.3 定义系统角色和关注点清单
- [x] 3.4 添加 Few-shot 翻译示例
- [x] 3.5 定义结构化输出格式要求
- [x] 3.6 添加主动补充缺失信息的指令

## 4. 翻译服务

- [x] 4.1 实现翻译服务类 (src/services/translator.ts)
- [x] 4.2 实现 translatePMToDev 方法 (产品→开发)
- [x] 4.3 实现 translateDevToPM 方法 (开发→产品)
- [x] 4.4 集成 AI 提供商接口
- [x] 4.5 处理流式响应并转发给客户端

## 5. 后端 API 实现

- [x] 5.1 创建 Express 应用 (src/app.ts)
- [x] 5.2 配置静态文件服务 (public 目录)
- [x] 5.3 实现翻译路由 (src/routes/translate.ts)
- [x] 5.4 实现 SSE (Server-Sent Events) 流式输出
- [x] 5.5 添加请求参数验证 (翻译方向、内容长度限制)
- [x] 5.6 添加错误处理中间件
- [x] 5.7 创建服务器入口 (src/server.ts)

## 6. Web 前端界面

- [x] 6.1 创建 HTML 页面结构 (public/index.html)
- [x] 6.2 添加翻译方向选择控件 (单选按钮或下拉菜单)
- [x] 6.3 添加内容输入区域 (textarea)
- [x] 6.4 添加翻译触发按钮
- [x] 6.5 添加结果展示区域
- [x] 6.6 实现 EventSource 客户端连接
- [x] 6.7 实现流式内容追加逻辑
- [x] 6.8 添加加载状态显示 (正在翻译...)
- [x] 6.9 添加错误提示显示
- [x] 6.10 添加输入验证 (空内容、内容过长)
- [x] 6.11 添加基础样式 (简洁清晰的布局)
- [x] 6.12 实现翻译进行中禁用按钮功能

## 7. 配置管理

- [x] 7.1 创建 .env.example 文件模板
- [x] 7.2 配置环境变量加载 (dotenv)
- [x] 7.3 添加 API Key 配置项 (OPENAI_API_KEY)
- [x] 7.4 添加模型选择配置项 (OPENAI_MODEL, 默认 gpt-3.5-turbo)
- [x] 7.5 添加端口配置项 (PORT, 默认 3000)
- [x] 7.6 添加最大内容长度配置项 (MAX_CONTENT_LENGTH, 默认 2000)

## 8. 测试和调试

- [x] 8.1 测试产品→开发翻译功能
- [x] 8.2 测试开发→产品翻译功能
- [x] 8.3 测试流式输出效果
- [x] 8.4 测试错误处理 (API 失败、网络错误、空输入等)
- [x] 8.5 调试提示词效果并优化
- [x] 8.6 测试 API Key 未配置的提示

## 9. 文档编写

- [x] 9.1 编写 README.md - 快速开始部分
- [x] 9.2 编写 README.md - 功能说明部分
- [x] 9.3 编写 README.md - 测试用例 (产品→开发示例)
- [x] 9.4 编写 README.md - 测试用例 (开发→产品示例)
- [x] 9.5 编写 README.md - 提示词设计说明
- [x] 9.6 添加 .gitignore 文件 (node_modules, .env, dist)
