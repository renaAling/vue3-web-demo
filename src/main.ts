import { createApp } from 'vue';
import pinia from '/@/stores/index';
import vuex from '/@/storesVuex/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive';
import { i18n } from '/@/i18n';
import other from '/@/utils/other'; // 完整加载
import VueLuckyCanvas from '@lucky-canvas/vue';

import ElementPlus from 'element-plus';
import '/@/theme/tailwind.css';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';
import '/@/assets/iconfont/iconfont-weapp-icon.css';
import '/@/assets/iconfont/iconfont.css';

// @ts-ignore 引入VForm3库
import VForm3 from 'form-designer-plus'; //
import 'form-designer-plus/dist/designer.style.css'; //引入VForm3样式
// 部门树组件
import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';

// 日历组件
import { setupCalendar } from 'v-calendar';

import { DelWrap, DictTag, Editor,EditorText, ElementIcons, Pagination, RightToolbar, Tip, UploadExcel, UploadFile, UploadImg } from '/@/components/index';
import { dateStr, dateTimeStr, parseDate, parseTime, timeStr } from '/@/utils/formatTime';

// @ts-ignore 布局工具
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const app = createApp(App);

// 导入通用自定义组件
app.component('DictTag', DictTag);
app.component('Pagination', Pagination);
app.component('RightToolbar', RightToolbar);
app.component('uploadExcel', UploadExcel);
app.component('UploadFile', UploadFile);
app.component('UploadImg', UploadImg);
app.component('Editor', Editor);
app.component('EditorText', EditorText);
app.component('Tip', Tip);
app.component('DelWrap', DelWrap);
// 导入布局插件
app.component('Splitpanes', Splitpanes);
app.component('Pane', Pane);
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.parseDate = parseDate;
app.config.globalProperties.dateTimeStr = dateTimeStr;
app.config.globalProperties.dateStr = dateStr;
app.config.globalProperties.timeStr = timeStr;
app.config.globalProperties.baseURL = import.meta.env.VITE_API_URL;

directive(app);
other.elSvg(app);
app
	.use(pinia) // pinia 存储
	.use(vuex) // vuex 存储
	.use(router) // 路由
	.use(ElementPlus) // ElementPlus 全局引入
	.use(ElementIcons) // elementIcons 图标全局引入
	.use(VForm3) // 表单设计
	.use(vue3TreeOrg) // 组织架构组件
	.use(i18n) // 国际化
	.use(setupCalendar, {}) // 日历组件
	.use(VueLuckyCanvas)
	.mount('#app');
