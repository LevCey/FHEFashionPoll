import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    // Required by FHEVM + allow dev-only eval for Next/Turbopack and WASM
    const commonHeaders = [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          // Dev-only: allow inline/eval and WASM eval for Next/Turbopack + FHE WASM
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.zama.ai",
          // Next dev HMR/websocket + local RPC + Zama CDN + Relayer API + TKMS S3 keys
          "connect-src 'self' http://127.0.0.1:8545 http://localhost:8545 http://localhost:3000 http://localhost:3001 ws: https://cdn.zama.ai https://relayer.testnet.zama.cloud https://relayer.zama.cloud https://zama-zws-testnet-tkms-jpn6x.s3.eu-west-1.amazonaws.com https://*.s3.eu-west-1.amazonaws.com https://*.amazonaws.com",
          // External script elements + inline bootstrap (dev)
          "script-src-elem 'self' 'unsafe-inline' https://cdn.zama.ai",
          // Allow worker/wasm loading used by FHE/WASM
          "worker-src 'self' blob:",
          // Styles during dev
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "frame-ancestors 'self'",
          "object-src 'none'",
        ].join('; '),
      },
    ];

    return Promise.resolve([
      { source: '/', headers: commonHeaders },
      { source: '/:path*', headers: commonHeaders },
    ]);
  },
};

export default nextConfig;
