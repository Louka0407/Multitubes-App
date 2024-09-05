const { createProxyMiddleware } = require('http-proxy-middleware');

console.log("Proxy is being set up");

module.exports = function (app) {

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5001',
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                console.log(`Proxying request to: ${proxyReq.path}`);
            },
            onError: (err, req, res) => {
                console.error('Proxy error:', err);
            },
        })
    );
};