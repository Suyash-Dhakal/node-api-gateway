import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxyController = (path, target) => {
  const apiPath = path.replace(`${path}`, `/api/auth${path}`);
  return createProxyMiddleware({
    target: target + apiPath,
    changeOrigin: true,
      // pathRewrite: () => '/api/auth/login', // always forward to this
  });
};

export const proxyControllerNotes = (path, target) => {
  const apiPath = path.replace(`${path}`, `/api${path}`);
  
  return createProxyMiddleware({
    target: target + apiPath,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.userId) {
          proxyReq.setHeader("x-user-id", req.userId); // inject user ID header
        }
      },
    },
      // pathRewrite: () => '/api/auth/login', // always forward to this
  });
}