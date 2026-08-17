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
		minify: 'esbuild',

		rollupOptions: {
			output: {
				manualChunks(id) {
					// Verifica se o arquivo vem da pasta node_modules
					if (id.includes('node_modules')) {
						// Garante que o react fique em cache no navegador
						if (id.includes('react') || id.includes('react-dom')) {
							return 'vendor-react';
						}

						// Utilitários grandes
						if (id.includes('react-router') || id.includes('axios')) {
							return 'vendor-utils';
						}

						// Fallback para qualquer outra biblioteca instalada
						return 'vendor-shared'; 
					}
				}
			}
		}
	}
});
