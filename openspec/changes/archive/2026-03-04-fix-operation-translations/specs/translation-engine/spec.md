## ADDED Requirements

### Requirement: API 路由层必须验证所有翻译方向
API 路由层必须验证传入的翻译方向参数，确保只接受有效的 TranslationDirection 类型值，拒绝无效的翻译方向并返回清晰的错误提示。

#### Scenario: 接受所有有效的翻译方向
- **WHEN** 用户发送翻译请求时传入有效的翻译方向参数（pm-to-dev, dev-to-pm, pm-to-operation, dev-to-operation, operation-to-pm, operation-to-dev 之一）
- **THEN** 系统接受该请求并继续处理翻译逻辑

#### Scenario: 拒绝无效的翻译方向
- **WHEN** 用户发送翻译请求时传入无效的翻译方向参数（如 "invalid-direction"、空值、null 等）
- **THEN** 系统返回 400 错误，错误消息列出所有有效的翻译方向选项

#### Scenario: 使用类型安全的验证方式
- **WHEN** 系统验证翻译方向参数
- **THEN** 验证逻辑基于 TranslationDirection 类型定义，而非硬编码的字符串比较，确保类型安全

#### Scenario: 验证逻辑与类型定义保持同步
- **WHEN** TranslationDirection 类型定义中新增翻译方向
- **THEN** API 路由层的验证逻辑能够自动接受新的翻译方向，无需额外修改硬编码条件

#### Scenario: 错误提示消息清晰明确
- **WHEN** 用户传入无效的翻译方向导致验证失败
- **THEN** 错误提示消息明确列出所有有效的翻译方向选项，帮助用户纠正输入
