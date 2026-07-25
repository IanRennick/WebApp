// vite.config.ts
// =========================================================================
// HYBRID VITE AND VITEST CENTRAL RUNTIME CONFIGURATION
// =========================================================================
import { defineConfig } from 'vitest/config'; // ✅ FIXED: Drops standard 'vite' to automatically enable 'test' types!
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // ✅ FIXED: Reverted back to the standard IP address loopback to match your Rails CORS filters!
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
});