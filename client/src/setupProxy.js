// client/src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");


module.exports = function (app) {
  console.log("[proxy] /api -> http://localhost:3001");
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );
};
