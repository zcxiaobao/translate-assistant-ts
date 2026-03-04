## 1. 修改 API 路由验证逻辑

- [x] 1.1 在 `src/routes/translate.ts` 文件顶部定义 `validDirections` 常量数组，包含所有 6 个 TranslationDirection 值
- [x] 1.2 创建类型守卫函数 `isValidTranslationDirection(value: any): value is TranslationDirection`
- [x] 1.3 将第 21 行的硬编码验证条件替换为 `!isValidTranslationDirection(direction)` 调用
- [x] 1.4 更新错误消息，使用 `validDirections.join(', ')` 列出所有有效翻译方向
- [x] 1.5 在 validDirections 定义处添加注释，提醒维护者同步更新 TranslationDirection 类型

## 2. 验证 TypeScript 编译

- [x] 2.1 运行 `npx tsc --noEmit` 验证类型检查通过
- [x] 2.2 确认没有类型错误或警告

## 3. 测试和验证

- [x] 3.1 启动应用 `npm start`，确保无启动错误
- [x] 3.2 测试原有的"产品→开发"翻译，验证功能正常
- [x] 3.3 测试原有的"开发→产品"翻译，验证功能正常
- [x] 3.4 测试新增的"产品→运营"翻译，验证能正常工作（不再返回 400 错误）
- [x] 3.5 测试新增的"开发→运营"翻译，验证能正常工作
- [x] 3.6 测试新增的"运营→产品"翻译，验证能正常工作
- [x] 3.7 测试新增的"运营→开发"翻译，验证能正常工作
- [x] 3.8 测试传入无效翻译方向（如 "invalid"），验证返回 400 错误且错误消息列出所有 6 个有效方向

## 4. 代码审查和清理

- [x] 4.1 检查代码格式和风格与现有代码保持一致
- [x] 4.2 确认所有修改处都有适当的注释
- [x] 4.3 验证没有遗留的 console.log 或调试代码
