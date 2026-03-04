import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { translateRouter } from './routes/translate';

/**
 * 创建 Express 应用
 */
export function createApp() {
  const app = express();

  // 解析 JSON 请求体
  app.use(express.json());

  // 配置静态文件服务 (public 目录)
  app.use(express.static(path.join(__dirname, '../public')));

  // 翻译路由
  app.use('/api', translateRouter);

  // 错误处理中间件
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
      error: err.message || '服务器内部错误',
    });
  });

  return app;
}
