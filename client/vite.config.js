import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
	plugins: [react(), tailwindcss()],
	// server: { host: true },
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
	build: {
		// Gerá código nativo e moderno, menor e mais rápido de ser lido
		target: 'es2022',
		minify: 'esbuild'
	}
});
