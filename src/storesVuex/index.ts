import { createStore } from 'vuex';
import productModule from './product';
import mobildConfig from './mobildConfig';
import settings from './settings';

// 创建
const vuex = createStore({
	modules: {
		product: productModule,
		mobildConfig: mobildConfig,
		settings: settings,
	},
});

// 导出
export default vuex;
