const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 可暫時加這行確認有載入
  console.log('[proxy] /api -> http://localhost:3001');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};
