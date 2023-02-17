import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/js-famfamfam-search/",
	css: {
		postcss: {
			plugins: [ autoprefixer({}) ],
		},
	},
});
