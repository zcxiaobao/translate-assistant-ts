## Context

当前系统架构支持产品经理和开发工程师之间的双向翻译：
- `TranslationDirection` 类型定义了 2 个方向：`'pm-to-dev'` 和 `'dev-to-pm'`
- `TranslatorService` 提供了对应的翻译方法：`translatePMToDev()` 和 `translateDevToPM()`
- 提示词文件存储在 `src/prompts/` 目录：`pm-to-dev.ts` 和 `dev-to-pm.ts`
- 用户界面使用单选按钮切换 2 个翻译方向

现在需要扩展系统以支持运营角色，形成三角协作关系：产品 ↔ 开发 ↔ 运营。

**约束条件**:
- 必须保持向后兼容，不能破坏现有的产品↔开发翻译功能
- 需要复用现有的翻译引擎和 LLM 提供商管理机制
- 用户界面需要保持简洁，不能因为选项增多而变得复杂

## Goals / Non-Goals

**Goals:**
- 添加 4 个新的翻译方向：产品↔运营、开发↔运营
- 定义运营角色的关注点和语言风格
- 更新 UI 支持 6 个翻译方向选择
- 保持代码架构的一致性和可扩展性
- 向后兼容，不影响现有用户

**Non-Goals:**
- 不支持三方同时翻译（如：产品→开发+运营）
- 不实现角色权限控制或用户登录功能
- 不在此次变更中优化现有的提示词质量
- 不添加翻译历史记录或保存功能

## Decisions

### 1. 翻译方向类型扩展：字符串联合类型

**决策**: 继续使用字符串联合类型（String Union Type）扩展 `TranslationDirection`。

**理由**:
- 当前实现已使用字符串联合类型，保持一致性
- 类型安全：TypeScript 会在编译时检查类型错误
- 易于扩展：添加新方向只需在类型定义中添加字符串字面量
- 便于前后端传输：字符串类型可直接序列化为 JSON

**备选方案**:
- ❌ 使用枚举（Enum）：虽然更严格，但会增加代码复杂度，且当前代码风格不使用枚举
- ❌ 使用常量对象：缺少类型安全，编译时无法检查

**实现方案**:
```typescript
export type TranslationDirection =
  | 'pm-to-dev'
  | 'dev-to-pm'
  | 'pm-to-operation'
  | 'dev-to-operation'
  | 'operation-to-pm'
  | 'operation-to-dev';
```

### 2. 提示词组织：按角色对命名

**决策**: 使用 `{source}-to-{target}` 的命名模式创建 4 个新的提示词文件。

**理由**:
- 与现有的命名模式保持一致（`pm-to-dev.ts`, `dev-to-pm.ts`）
- 文件名清晰表达了翻译方向
- 便于维护和查找

**文件结构**:
```
src/prompts/
├── pm-to-dev.ts           # 现有
├── dev-to-pm.ts           # 现有
├── pm-to-operation.ts     # 新增
├── dev-to-operation.ts    # 新增
├── operation-to-pm.ts     # 新增
└── operation-to-dev.ts    # 新增
```

**提示词内容设计**:
- **运营角色关注点**：用户增长、数据指标、活动策划、转化率、留存率、GMV、ROI
- **运营语言风格**：数据驱动、目标导向、强调指标和效果
- **输出结构**：
  - 产品→运营：用户增长机会、关键数据指标、运营策略建议
  - 开发→运营：功能可用性、数据埋点说明、性能影响
  - 运营→产品：用户价值分析、功能优先级建议、业务影响
  - 运营→开发：数据需求、接口需求、埋点需求

### 3. TranslatorService 扩展：通用翻译方法 + 专用方法

**决策**: 保留现有的专用翻译方法，添加新的专用方法，并增强通用 `translate()` 方法的路由能力。

**理由**:
- 保持向后兼容，现有的 `translatePMToDev()` 和 `translateDevToPM()` 不变
- 专用方法提供更好的类型提示和代码可读性
- 通用方法作为统一入口，简化调用逻辑

**备选方案**:
- ❌ 只使用通用方法：缺少类型提示，代码可读性下降
- ❌ 使用策略模式：过度设计，增加不必要的复杂度

**实现方案**:
```typescript
export class TranslatorService {
  // 现有方法（保持不变）
  async *translatePMToDev(content: string): AsyncIterable<string>
  async *translateDevToPM(content: string): AsyncIterable<string>

  // 新增方法
  async *translatePMToOperation(content: string): AsyncIterable<string>
  async *translateDevToOperation(content: string): AsyncIterable<string>
  async *translateOperationToPM(content: string): AsyncIterable<string>
  async *translateOperationToDev(content: string): AsyncIterable<string>

  // 增强通用方法
  async *translate(direction: TranslationDirection, content: string): AsyncIterable<string> {
    switch (direction) {
      case 'pm-to-dev': return yield* this.translatePMToDev(content);
      case 'dev-to-pm': return yield* this.translateDevToPM(content);
      case 'pm-to-operation': return yield* this.translatePMToOperation(content);
      // ... 其他方向
    }
  }
}
```

### 4. UI 选择器设计：下拉菜单替代单选按钮

**决策**: 将单选按钮改为下拉菜单（Select），支持 6 个翻译方向选择。

**理由**:
- 单选按钮适合 2-3 个选项，6 个选项会占用过多空间
- 下拉菜单节省界面空间，保持界面简洁
- 可以为每个选项添加描述文案，帮助用户理解

**备选方案**:
- ❌ 两级选择（先选源角色，再选目标角色）：增加交互步骤，用户体验不佳
- ❌ 矩阵选择器：过于复杂，适合更多角色的场景

**选项文案设计**:
```
产品 → 开发：将产品需求翻译为技术实现方案
开发 → 产品：将技术方案翻译为业务价值
产品 → 运营：将产品需求翻译为运营策略
开发 → 运营：将技术方案翻译为数据和功能说明
运营 → 产品：将运营需求翻译为产品功能
运营 → 开发：将运营需求翻译为技术需求
```

### 5. 向后兼容策略：保持 API 和 UI 行为不变

**决策**:
- API 层面：`TranslationDirection` 类型扩展，现有类型值仍然有效
- 服务层面：现有的翻译方法签名和行为不变
- UI 层面：默认选中 `'pm-to-dev'`，与现有行为一致

**理由**:
- 用户无感知升级，现有功能正常工作
- 代码修改为纯扩展，不涉及重构或破坏性变更
- 降低测试和验证成本

## Risks / Trade-offs

### [权衡] UI 复杂度增加

**权衡**: 翻译方向从 2 个增加到 6 个，用户需要更多时间理解和选择。

**分析**:
- 下拉菜单比单选按钮多一次点击交互
- 选项增多可能导致用户选择困难
- 通过清晰的文案和描述可以缓解这个问题

**缓解措施**:
- 为每个选项提供简短的描述文案
- 默认选中最常用的方向（产品→开发）
- 考虑在未来版本中添加"最近使用"或"收藏"功能

---

### [风险] 提示词质量不一致

**风险**: 新增的 4 个运营相关提示词可能与现有的产品↔开发提示词质量不一致，导致翻译效果参差不齐。

**缓解措施**:
- 参考现有提示词的结构和风格编写新提示词
- 在 Few-shot Learning 示例中提供高质量的翻译案例
- 实施后收集反馈并持续优化提示词

---

### [风险] 翻译方向组合爆炸

**风险**: 如果未来需要添加更多角色（如测试、设计），翻译方向数量会呈指数增长（N 个角色需要 N*(N-1) 个方向）。

**分析**:
- 3 个角色需要 6 个方向（可接受）
- 4 个角色需要 12 个方向（开始复杂）
- 5 个角色需要 20 个方向（不可维护）

**缓解措施**:
- 当前设计足够支持 3-4 个角色
- 如果未来需要更多角色，考虑以下方案：
  - 引入角色分组或层级结构
  - 使用中间翻译（如：测试→产品→开发）
  - 重新设计为"角色理解模式"而非"方向翻译模式"

## Migration Plan

**部署步骤**:

1. **创建新的提示词文件**:
   - 创建 4 个新文件：`pm-to-operation.ts`, `dev-to-operation.ts`, `operation-to-pm.ts`, `operation-to-dev.ts`
   - 定义运营角色的关注点和语言风格
   - 添加 Few-shot Learning 示例

2. **更新翻译引擎**:
   - 修改 `TranslationDirection` 类型定义
   - 在 `TranslatorService` 中添加 4 个新的翻译方法
   - 更新 `translate()` 通用方法的路由逻辑

3. **更新用户界面**:
   - 将单选按钮改为下拉菜单
   - 添加 6 个翻译方向选项和描述文案
   - 更新前端的类型定义和请求逻辑

4. **测试验证**:
   - 测试 4 个新翻译方向的功能
   - 回归测试原有的产品↔开发翻译
   - 测试 UI 交互和错误处理

5. **回滚策略**:
   - 如果新功能有问题，可以在 UI 层隐藏运营相关选项
   - 后端代码扩展式修改，不影响现有功能
   - 数据库无变更，无需数据回滚

**兼容性说明**:
- API 向后兼容：现有的 `'pm-to-dev'` 和 `'dev-to-pm'` 请求仍然有效
- UI 向后兼容：默认选中 `'pm-to-dev'`，与现有行为一致
- 无需修改现有的调用代码

## Open Questions

1. **运营角色的具体关注点是否需要进一步细化？**
   - 当前设计基于通用的运营视角
   - 是否需要区分不同类型的运营（用户运营、内容运营、活动运营）？
   - 建议先实现通用版本，根据实际使用反馈再细化

2. **是否需要支持"运营→运营"的自我翻译？**
   - 理论上可以支持同角色的不同维度翻译（如：策略→执行）
   - 当前设计不包含此场景
   - 如有需求，可在未来版本中添加

3. **是否需要在 UI 中提供角色说明或帮助文档？**
   - 帮助用户理解各个角色的定位和翻译方向的用途
   - 可以考虑添加"?"图标或帮助链接
   - 建议在首次实现后根据用户反馈决定是否添加
