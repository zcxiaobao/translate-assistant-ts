## 1. 创建运营相关的提示词文件

- [x] 1.1 创建 `src/prompts/pm-to-operation.ts` 文件
- [x] 1.2 编写产品→运营提示词内容，包含系统角色、关注点清单（用户增长、DAU/MAU、转化率、留存率、GMV、ROI）和输出结构
- [x] 1.3 添加产品→运营的 Few-shot Learning 翻译示例
- [x] 1.4 创建 `src/prompts/dev-to-operation.ts` 文件
- [x] 1.5 编写开发→运营提示词内容，包含系统角色、关注点清单（功能可用性、数据埋点、性能影响）和输出结构
- [x] 1.6 添加开发→运营的 Few-shot Learning 翻译示例
- [x] 1.7 创建 `src/prompts/operation-to-pm.ts` 文件
- [x] 1.8 编写运营→产品提示词内容，包含系统角色、关注点清单（用户价值、功能优先级、业务影响）和输出结构
- [x] 1.9 添加运营→产品的 Few-shot Learning 翻译示例
- [x] 1.10 创建 `src/prompts/operation-to-dev.ts` 文件
- [x] 1.11 编写运营→开发提示词内容，包含系统角色、关注点清单（数据需求、接口需求、埋点需求）和输出结构
- [x] 1.12 添加运营→开发的 Few-shot Learning 翻译示例

## 2. 更新翻译引擎类型定义

- [x] 2.1 修改 `src/services/translator.ts` 中的 `TranslationDirection` 类型定义
- [x] 2.2 添加 4 个新的翻译方向类型：`'pm-to-operation'`, `'dev-to-operation'`, `'operation-to-pm'`, `'operation-to-dev'`
- [x] 2.3 验证类型定义的 TypeScript 编译通过

## 3. 在 TranslatorService 中添加新的翻译方法

- [x] 3.1 导入 4 个新的提示词常量（PM_TO_OPERATION_SYSTEM_PROMPT, DEV_TO_OPERATION_SYSTEM_PROMPT, OPERATION_TO_PM_SYSTEM_PROMPT, OPERATION_TO_DEV_SYSTEM_PROMPT）
- [x] 3.2 实现 `translatePMToOperation()` 方法，调用运营相关提示词
- [x] 3.3 实现 `translateDevToOperation()` 方法，调用运营相关提示词
- [x] 3.4 实现 `translateOperationToPM()` 方法，调用运营相关提示词
- [x] 3.5 实现 `translateOperationToDev()` 方法，调用运营相关提示词
- [x] 3.6 为 4 个新方法添加 API Key 验证逻辑
- [x] 3.7 为 4 个新方法添加错误处理逻辑

## 4. 更新通用翻译方法的路由逻辑

- [x] 4.1 修改 `translate()` 方法的 switch 语句
- [x] 4.2 添加 `'pm-to-operation'` case，调用 `translatePMToOperation()`
- [x] 4.3 添加 `'dev-to-operation'` case，调用 `translateDevToOperation()`
- [x] 4.4 添加 `'operation-to-pm'` case，调用 `translateOperationToPM()`
- [x] 4.5 添加 `'operation-to-dev'` case，调用 `translateOperationToDev()`
- [x] 4.6 确保原有的 `'pm-to-dev'` 和 `'dev-to-pm'` case 保持不变

## 5. 更新用户界面

- [x] 5.1 在 `public/index.html` 中找到翻译方向选择器（当前为单选按钮）
- [x] 5.2 将单选按钮替换为下拉菜单（`<select>` 元素）
- [x] 5.3 添加 6 个翻译方向选项：
  - 产品 → 开发：将产品需求翻译为技术实现方案
  - 开发 → 产品：将技术方案翻译为业务价值
  - 产品 → 运营：将产品需求翻译为运营策略
  - 开发 → 运营：将技术方案翻译为数据和功能说明
  - 运营 → 产品：将运营需求翻译为产品功能
  - 运营 → 开发：将运营需求翻译为技术需求
- [x] 5.4 设置默认选中值为 `'pm-to-dev'`，保持向后兼容
- [x] 5.5 更新前端 JavaScript 代码，正确读取下拉菜单的选中值
- [x] 5.6 更新 CSS 样式，确保下拉菜单的视觉风格与整体界面一致

## 6. 测试和验证

- [x] 6.1 启动应用，验证编译和启动无错误
- [x] 6.2 测试产品→运营翻译功能，验证输出内容符合运营视角
- [x] 6.3 测试开发→运营翻译功能，验证输出包含数据埋点说明
- [x] 6.4 测试运营→产品翻译功能，验证输出包含用户价值分析
- [x] 6.5 测试运营→开发翻译功能，验证输出包含技术需求清单
- [x] 6.6 回归测试原有的产品→开发翻译，确保功能正常
- [x] 6.7 回归测试原有的开发→产品翻译，确保功能正常
- [x] 6.8 测试 UI 下拉菜单交互，确保所有选项可选择
- [x] 6.9 测试默认选中值，确保首次访问时默认为产品→开发
- [x] 6.10 测试错误处理，验证 API Key 无效时的错误提示
- [x] 6.11 测试输入验证，验证空内容和超长内容的提示

## 7. 文档和代码审查

- [x] 7.1 检查所有新增代码的注释和文档字符串
- [x] 7.2 确认所有提示词文件的格式和内容质量
- [x] 7.3 验证代码风格与现有代码保持一致
- [x] 7.4 确认没有遗留的 console.log 或调试代码
- [x] 7.5 检查类型定义的完整性和准确性
