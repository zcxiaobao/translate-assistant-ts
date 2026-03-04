# llm-provider-management

## Purpose

大语言模型（LLM）提供商管理能力负责统一管理多个 LLM 服务提供商，支持提供商的注册、配置、切换和调用。通过提供统一的接口和管理机制，系统可以在运行时动态切换不同的 LLM 提供商（如 OpenAI、DeepSeek 等），而无需修改业务逻辑代码或重启服务。

## Requirements

### Requirement: 提供商注册与配置
系统必须支持注册多个 LLM 提供商，并为每个提供商配置相应的参数（API Key、Base URL、模型名称等）。

#### Scenario: 注册新的 LLM 提供商
- **WHEN** 应用启动时注册 DeepSeek 提供商
- **THEN** 系统创建 DeepSeek Provider 实例并存储到提供商注册表中

#### Scenario: 注册提供商时验证配置
- **WHEN** 注册提供商时未提供必需的 API Key
- **THEN** 系统记录警告日志但不阻止注册，该提供商在调用时会报错

#### Scenario: 注册多个提供商
- **WHEN** 应用启动时注册 OpenAI 和 DeepSeek 两个提供商
- **THEN** 系统存储两个提供商实例，可通过名称查询

### Requirement: 提供商切换
系统必须支持在运行时切换当前激活的 LLM 提供商，无需重启服务。

#### Scenario: 切换到指定提供商
- **WHEN** 调用 setActiveProvider('deepseek')
- **THEN** 系统将 DeepSeek 设置为当前激活的提供商，后续翻译请求使用 DeepSeek

#### Scenario: 切换到不存在的提供商
- **WHEN** 调用 setActiveProvider('unknown-provider')
- **THEN** 系统抛出错误，提示提供商未注册

#### Scenario: 获取当前激活的提供商
- **WHEN** 调用 getActiveProvider()
- **THEN** 系统返回当前激活的提供商实例

### Requirement: 默认提供商配置
系统必须支持通过环境变量配置默认的 LLM 提供商，如果未配置则使用 DeepSeek 作为默认提供商。

#### Scenario: 使用环境变量指定默认提供商
- **WHEN** 环境变量 DEFAULT_LLM_PROVIDER 设置为 'openai'
- **THEN** 系统启动时将 OpenAI 设置为默认激活提供商

#### Scenario: 未配置默认提供商
- **WHEN** 环境变量 DEFAULT_LLM_PROVIDER 未设置
- **THEN** 系统默认使用 DeepSeek 作为激活提供商

#### Scenario: 配置的默认提供商未注册
- **WHEN** 环境变量 DEFAULT_LLM_PROVIDER 设置为未注册的提供商名称
- **THEN** 系统记录错误日志并回退到 DeepSeek 作为默认提供商

### Requirement: 提供商统一接口
系统必须为所有 LLM 提供商定义统一的接口（AIProvider），确保不同提供商的调用方式一致。

#### Scenario: 调用任意提供商的生成方法
- **WHEN** 通过 AIProvider 接口调用 generateStream()
- **THEN** 无论使用哪个提供商，都返回一致的异步可迭代流

#### Scenario: 新增提供商实现接口
- **WHEN** 开发者实现 AIProvider 接口创建新的提供商
- **THEN** 新提供商可以直接注册到管理器中，无需修改业务逻辑

### Requirement: DeepSeek 提供商支持
系统必须实现 DeepSeek AI 提供商，并支持其特定的 API 配置（Base URL、模型名称）。

#### Scenario: 创建 DeepSeek Provider 实例
- **WHEN** 使用 DEEPSEEK_API_KEY 环境变量创建 DeepSeek Provider
- **THEN** 系统创建 OpenAI 客户端实例，配置 baseURL 为 'https://api.deepseek.com'

#### Scenario: 调用 DeepSeek API 生成翻译
- **WHEN** 使用 DeepSeek Provider 调用 generateStream()
- **THEN** 系统向 DeepSeek API 发送请求并返回流式响应

#### Scenario: DeepSeek API 调用失败
- **WHEN** DeepSeek API 返回错误（如 401 Unauthorized）
- **THEN** 系统抛出友好的错误信息，提示 API Key 无效或其他错误原因

### Requirement: 配置管理
系统必须支持从环境变量读取各个提供商的 API Key 和配置信息。

#### Scenario: 读取 DeepSeek API Key
- **WHEN** 系统从环境变量 DEEPSEEK_API_KEY 读取配置
- **THEN** 系统使用该 API Key 创建 DeepSeek Provider 实例

#### Scenario: 读取 OpenAI API Key
- **WHEN** 系统从环境变量 OPENAI_API_KEY 读取配置
- **THEN** 系统使用该 API Key 创建 OpenAI Provider 实例

#### Scenario: API Key 未配置
- **WHEN** 对应提供商的环境变量未设置或为空
- **THEN** 系统记录警告日志，该提供商注册但在调用时会报错
