import { Router, Request, Response } from 'express';
import { TranslatorService, TranslationDirection } from '../services/translator';

export const translateRouter = Router();

// 从环境变量获取配置
const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH || '2000');

/**
 * 所有有效的翻译方向
 * 注意：添加新的翻译方向时，必须同步更新此数组和 TranslationDirection 类型定义
 */
const validDirections: TranslationDirection[] = [
  'pm-to-dev',
  'dev-to-pm',
  'pm-to-operation',
  'dev-to-operation',
  'operation-to-pm',
  'operation-to-dev'
];

/**
 * 类型守卫函数：验证翻译方向是否有效
 */
function isValidTranslationDirection(value: any): value is TranslationDirection {
  return validDirections.includes(value);
}

// 初始化翻译服务（不再需要传入 aiProvider，从 LLMProviderManager 获取）
const translator = new TranslatorService();

/**
 * POST /api/translate
 * 翻译接口 - 支持 SSE 流式输出
 */
translateRouter.post('/translate', async (req: Request, res: Response) => {
  try {
    const { direction, content } = req.body;

    // 请求参数验证：翻译方向
    if (!direction || !isValidTranslationDirection(direction)) {
      return res.status(400).json({
        error: `无效的翻译方向，请选择以下之一：${validDirections.join(', ')}`,
      });
    }

    // 请求参数验证：内容不能为空
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        error: '请输入需要翻译的内容',
      });
    }

    // 请求参数验证：内容长度限制
    if (content.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({
        error: `内容过长，请精简后重试（最大长度 ${MAX_CONTENT_LENGTH} 字符）`,
      });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 流式输出翻译结果
    try {
      for await (const chunk of translator.translate(
        direction as TranslationDirection,
        content
      )) {
        // 发送 SSE 数据
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      // 发送完成信号
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      // 流式输出中断时的错误处理
      res.write(
        `data: ${JSON.stringify({ error: error.message || '翻译失败' })}\n\n`
      );
      res.end();
    }
  } catch (error: any) {
    // 请求处理错误
    if (!res.headersSent) {
      res.status(500).json({
        error: error.message || '服务器内部错误',
      });
    }
  }
});
