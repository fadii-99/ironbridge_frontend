import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/',                 // deploy at domain root
  build: {
    outDir: 'dist',
    assetsDir: 'assets',     // puts hashed JS/CSS into /dist/assets
    sourcemap: false
  }
})
