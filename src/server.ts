import dotenv from 'dotenv';
import { createApp } from './app';

// 加载环境变量
dotenv.config();

// 从环境变量获取端口配置
const PORT = parseInt(process.env.PORT || '3000');

// 创建并启动服务器
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
  console.log(`📝 打开浏览器访问以使用翻译助手`);

  // 检查 API Key 配置
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  警告: OPENAI_API_KEY 未配置，请在 .env 文件中设置');
  }
});
