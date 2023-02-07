import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	assetsInclude: ['./src/assets/*.zip'],
	build: {
		outDir: './public',
		target: 'es2020',
	},
	server: {
		port: 3000,
	},
});
