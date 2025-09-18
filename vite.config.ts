import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import';
import viteCompression from 'vite-plugin-compression';
// @ts-ignore
import { svgBuilder } from '/@/components/IconSelector/index';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const getBuildInputs = (includeViews: string[]) => {
	const inputs: Record<string, string> = {
		main: pathResolve('./index.html')
	};

	if (includeViews.length > 0) {
		// Process each specified view directory
		includeViews.forEach(view => {
			const viewDir = pathResolve(`src/views/${view}`);
			
			// Check if directory exists
			if (fs.existsSync(viewDir) && fs.statSync(viewDir).isDirectory()) {
				// Find all .vue files in the directory and subdirectories
				const vueFiles = glob.sync(`${viewDir}/**/*.vue`);
				
				vueFiles.forEach(file => {
					const relativePath = path.relative(pathResolve('src/views'), file);
					const name = relativePath.replace('.vue', '').replace(/\//g, '_').replace(/\\/g, '_');
					inputs[name] = file;
				});
			}
		});
	} else {
		// Default behavior: include all views
		const allVueFiles = glob.sync('src/views/**/*.vue', { 
			cwd: process.cwd(),
			absolute: true
		});
		allVueFiles.forEach(file => {
			const relativePath = path.relative(pathResolve('src/views'), file);
			const name = relativePath.replace('.vue', '').replace(/\//g, '_').replace(/\\/g, '_');
			inputs[name] = file;
		});
	}

	return inputs;
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, pathResolve('./env'));
	const includeViews = process.env.INCLUDE_VIEWS?.split(',') || []
	console.log('includeViews====', includeViews)
	
	return {
		envDir: './env',
		plugins: [
			vue(),
			svgBuilder('./src/assets/icons/'),
			vueSetupExtend(),
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'],
				dts: './auto-imports.d.ts',
			}),
			createStyleImportPlugin({
				resolves: [VxeTableResolve()],
			}),
			topLevelAwait({
				promiseExportName: '__tla',
				promiseImportName: (i) => `__tla_${i}`,
			}),
			viteCompression({
				deleteOriginFile: false,
			}),
		],
		root: process.cwd(),
		resolve: { alias },
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: ['element-plus/es/locale/lang/zh-cn', 'element-plus/es/locale/lang/en'],
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: env.VITE_OPEN === 'true',
			hmr: true,
			proxy: {
				'/api/gen': {
					target: env.VITE_IS_MICRO === 'true' ? env.VITE_ADMIN_PROXY_PATH : env.VITE_GEN_PROXY_PATH,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'/api': {
					target: env.VITE_ADMIN_PROXY_PATH,
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'^/ws/info/.*': {
					target: env.VITE_ADMIN_PROXY_PATH,
					ws: true,
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: env.VITE_APP_OUTPUT ? env.VITE_APP_OUTPUT : 'dist',
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				input: getBuildInputs(includeViews),
				output: {
					entryFileNames: `assets/[name].[hash].js`,
					chunkFileNames: `assets/[name].[hash].js`,
					assetFileNames: `assets/[name].[hash].[ext]`,
					compact: true,
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia'],
						echarts: ['echarts'],
					},
				},
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;