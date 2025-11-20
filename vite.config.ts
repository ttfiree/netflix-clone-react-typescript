import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
    viteCompression({ threshold: 10240, algorithm: 'gzip', ext: '.gz' })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // ❌ 删除 video.js 的拆分逻辑，它太危险了

            // ✅ MUI 可以放心拆，它的模块独立性很好
            if (id.includes('@mui')) {
              return 'mui-vendor';
            }
            if (id.includes('@emotion')) {
              return 'emotion-vendor';
            }

            // ❌ 不要拆 react-core，让它和 vendor 在一起最安全

            // 其他所有第三方库归入 vendor
            return 'vendor';
          }
        },
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500, // 调大警告阈值，不要让它烦你
    sourcemap: false,
    minify: 'esbuild',
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  }
})