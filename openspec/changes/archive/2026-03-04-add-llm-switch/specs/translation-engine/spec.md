## MODIFIED Requirements

### Requirement: 集成 AI 服务
系统必须从 LLM 提供商管理器获取当前激活的 AI 提供商，用于执行翻译逻辑，支持动态切换提供商而无需重启服务。

#### Scenario: 成功调用 AI API
- **WHEN** 系统接收到翻译请求
- **THEN** 系统从 LLM 提供商管理器获取当前激活的 Provider，调用其 API 并返回翻译结果

#### Scenario: AI API 调用失败
- **WHEN** AI API 调用失败（网络错误、API 错误、超时等）
- **THEN** 系统返回友好的错误提示，告知用户调用失败原因

#### Scenario: 当前激活的提供商未配置有效的 API Key
- **WHEN** 当前激活的提供商未配置有效的 API Key
- **THEN** 系统提示用户配置该提供商的 API Key 并拒绝执行翻译

#### Scenario: 动态切换提供商
- **WHEN** 在运行时切换到另一个 LLM 提供商（如从 OpenAI 切换到 DeepSeek）
- **THEN** 后续的翻译请求使用新激活的提供商，无需重启服务

#### Scenario: 提供商管理器未初始化
- **WHEN** 系统尚未初始化任何 LLM 提供商
- **THEN** 系统抛出错误，提示需要先注册并激活至少一个提供商
