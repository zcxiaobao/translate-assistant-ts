## Why

新增的 4 个运营翻译方向（产品→运营、开发→运营、运营→产品、运营→开发）在前端 UI 和 TranslatorService 服务层都已实现，但 API 路由层的验证逻辑仍然硬编码只接受 `pm-to-dev` 和 `dev-to-pm`，导致用户选择新增的翻译方向后点击翻译按钮时收到"无效的翻译方向"错误提示，功能完全不可用。这是上次变更遗漏的关键部分，需要立即修复。

## What Changes

- 更新 `src/routes/translate.ts` 中的翻译方向验证逻辑，从硬编码的 2 个方向扩展到支持全部 6 个方向
- 将验证逻辑改为使用 TranslationDirection 类型约束，确保类型安全
- 更新错误提示消息，反映完整的翻译方向列表

## Capabilities

### New Capabilities
<!-- 无新增 capabilities -->

### Modified Capabilities
- `translation-engine`: API 路由层需要接受和验证 4 个新的翻译方向值（pm-to-operation, dev-to-operation, operation-to-pm, operation-to-dev）

## Impact

**受影响的代码**:
- `src/routes/translate.ts` - POST /api/translate 端点的请求验证逻辑（第 21-25 行）

**影响范围**:
- 这是一个纯修复性变更，不影响现有的产品↔开发翻译功能
- 修复后，用户将能够正常使用所有 6 个翻译方向
- 无 API 接口变更，无破坏性修改
