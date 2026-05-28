import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        // Alias @ to the src directory
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        // Resolve Figma Make asset imports to local asset files
        find: /^figma:asset\//,
        replacement: `${path.resolve(__dirname, './src/assets')}/`,
      },
    ],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5059', // your .NET backend port
        changeOrigin: true,
      },
      '/hubs': {
        target: 'http://localhost:5059',
        changeOrigin: true,
        ws: true, // needed for SignalR websockets
      },
    },
  },
})


