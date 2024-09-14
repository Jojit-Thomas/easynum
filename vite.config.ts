import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      manifest: {
        name: 'EasyNum',
        short_name: 'EasyNum',
        description: 'Instant currency conversions as you browse. Transform "$1 million" to "₹8.3 crore" with a tap. Understand global financial news effortlessly.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa/icon/192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa/icon/512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa/icon/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'pwa/screenshot/web.png',
            sizes: '1404x666',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Homescreen'
          },
          {
            src: 'pwa/screenshot/mobile.png',
            sizes: '850x1162',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Homescreen'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })],
  base: '/'
})
