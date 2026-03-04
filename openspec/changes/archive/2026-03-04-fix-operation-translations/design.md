## Context

在 add-operation-role 变更中，我们成功添加了运营角色支持，将翻译方向从 2 个扩展到 6 个：
- 原有：`pm-to-dev`, `dev-to-pm`
- 新增：`pm-to-operation`, `dev-to-operation`, `operation-to-pm`, `operation-to-dev`

**已完成的工作**：
- ✅ TranslationDirection 类型定义已扩展（src/services/translator.ts）
- ✅ TranslatorService 已实现 4 个新的翻译方法
- ✅ 前端 UI 已更新为下拉菜单，支持 6 个选项
- ✅ 4 个运营提示词文件已创建

**遗漏的工作**：
- ❌ API 路由层（src/routes/translate.ts:21）的验证逻辑仍然硬编码只接受 2 个方向

**当前问题**：
用户在前端选择新增的 4 个运营翻译方向后，点击"开始翻译"按钮，后端返回 400 错误："无效的翻译方向，请选择 pm-to-dev 或 dev-to-pm"，导致功能完全不可用。

**约束条件**：
- 必须保持向后兼容，不能影响现有的产品↔开发翻译功能
- 必须保持类型安全，避免运行时错误
- 修复必须彻底，避免未来添加新方向时再次遗漏

## Goals / Non-Goals

**Goals:**
1. 修复 API 路由层的验证逻辑，接受所有 6 个 TranslationDirection 类型值
2. 使用类型安全的验证方式，而非硬编码字符串比较
3. 更新错误提示消息，反映完整的翻译方向列表
4. 确保修复后所有 6 个翻译方向都能正常工作

**Non-Goals:**
- 不修改 TranslationDirection 类型定义（已经正确）
- 不修改 TranslatorService 实现（已经正确）
- 不修改前端 UI（已经正确）
- 不添加新的翻译方向

## Decisions

### 决策 1：使用类型守卫函数验证翻译方向

**选择**：创建一个类型守卫函数 `isValidTranslationDirection()`，基于 TranslationDirection 类型进行验证。

**理由**：
- ✅ **类型安全**：利用 TypeScript 类型系统，编译时即可检查
- ✅ **可维护性**：未来添加新方向时，只需修改类型定义，验证逻辑自动更新
- ✅ **代码复用**：类型守卫可以在多处使用
- ✅ **避免硬编码**：不会再次出现漏加新方向的问题

**替代方案 1**：扩展硬编码条件
```typescript
if (direction !== 'pm-to-dev' && direction !== 'dev-to-pm' &&
    direction !== 'pm-to-operation' && direction !== 'dev-to-operation' &&
    direction !== 'operation-to-pm' && direction !== 'operation-to-dev') {
  // error
}
```
❌ **缺点**：冗长、易出错、未来添加新方向容易遗漏

**替代方案 2**：使用数组包含检查
```typescript
const validDirections = ['pm-to-dev', 'dev-to-pm', 'pm-to-operation', ...];
if (!validDirections.includes(direction)) {
  // error
}
```
❌ **缺点**：仍然是硬编码列表，维护两份定义（类型 + 数组）

**实现方式**：
```typescript
const validDirections: TranslationDirection[] = [
  'pm-to-dev',
  'dev-to-pm',
  'pm-to-operation',
  'dev-to-operation',
  'operation-to-pm',
  'operation-to-dev'
];

function isValidTranslationDirection(value: any): value is TranslationDirection {
  return validDirections.includes(value);
}
```

### 决策 2：改进错误提示消息

**选择**：将错误消息改为列出所有 6 个有效的翻译方向。

**理由**：
- 用户能清楚了解所有可用选项
- 便于调试和问题诊断

**实现方式**：
```typescript
error: `无效的翻译方向，请选择以下之一：${validDirections.join(', ')}`
```

### 决策 3：验证逻辑位置

**选择**：保持验证逻辑在 translate.ts 路由文件中，不提取到单独的验证模块。

**理由**：
- ✅ **简单性**：这是唯一需要验证翻译方向的地方
- ✅ **局部性**：验证逻辑与使用地点紧密相关
- ❌ 如果未来有多处需要验证，再考虑提取

## Risks / Trade-offs

### 风险 1：validDirections 数组与 TranslationDirection 类型不同步

**风险描述**：如果未来添加新的翻译方向，只更新类型定义而忘记更新 validDirections 数组，会导致新方向无法通过验证。

**缓解措施**：
- 在 validDirections 定义处添加显著注释，提醒维护者同步更新
- 在测试中覆盖所有 TranslationDirection 值的验证
- 考虑在未来使用编译时检查工具（如 exhaustiveness checking）

### 风险 2：修改可能影响现有功能

**风险描述**：虽然是简单的逻辑修改，但仍有可能意外破坏现有的产品↔开发翻译功能。

**缓解措施**：
- 修改后立即进行回归测试，验证 pm-to-dev 和 dev-to-pm 仍然正常工作
- 测试所有 6 个翻译方向

### Trade-off：维护两份翻译方向定义

**Trade-off 描述**：需要维护 TranslationDirection 类型定义和 validDirections 数组两份定义。

**接受理由**：
- 这是 TypeScript 类型系统的限制，无法在运行时从类型定义推导出值列表
- 相比硬编码条件，这种方式已经大大降低了维护成本
- 可以通过注释和测试来缓解同步问题

## Open Questions

无待解决问题。修复方案明确，风险可控。
