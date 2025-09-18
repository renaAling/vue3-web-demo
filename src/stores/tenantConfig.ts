import { defineStore } from 'pinia';

/**
 * 修改配置时：
 * 1、需要每次都清理 `window.localStorage` 浏览器永久缓存
 * 2、或者点击布局配置最底部 `一键恢复默认` 按钮即可看到效果
 */
export const useTenantConfig = defineStore('tenantConfig', {
	state: (): TenantConfigState => ({
		tenantConfig: {
			'1': {
				name: '会员中心',
				isMerchant: false,
			},
			'1806575261299634178': {
				name: '多渠道支付管理',
				isMerchant: false,
			},
			'1816751886640836610': {
				name: '地铁好店管理系统',
				isMerchant: false,
				isLink: '#/admin/system/role/index?',
			},
			'1817759704625901569': {
				name: '好店-商家中心',
				isMerchant: false,
			},
			'1843905731950460929': {
				name: '数据中台系统',
				isMerchant: false,
			},
			'1844555183493136386': {
				name: '线上信息流广告',
				isMerchant: false,
			},
			'1853370696281276417': {
				name: '成都轨道生活智慧服务平台',
				isMerchant: false,
				isLink: '#/admin/system/user/index?',
			},
			'1855880243516456961': {
				name: '积分福利社',
				isMerchant: false,
				isLink: '#/points/configure/permission/index?activeName=third',
			},
			'1857000132515905537': {
				name: '接口分发管理',
				isMerchant: false,
			},
			'1891678024273887233': {
				// 原交易组件
				name: '文创商城系统',
				isMerchant: false,
				isMall: true,
				// isLink:'#/admin/system/role/index?'
			},
			'1891680610875998209': {
				// 原交易组件
				name: '文创商城系统-商家端',
				isMall: true,
				isMerchant: true,
			},
			'1907314253182926849': {
				name: '平台入驻管理',
				isMall: true,
				isMerchant: false,
			},
			'1830437681746067458': {
				name: '运营活动管理',
				isMerchant: false,
				isLink: '#/admin/system/role/index?',
			},
			'1815608904948617218': {
				name: '文创商城',
				isMerchant: false,
				isMall: true,
				isLink: '#/admin/system/role/index?',
			},
			'1925082852790239233': {
				name: '文创商城-商户端',
				isMall: true,
				isMerchant: true,
			},
			'1922165158034145281': {
				name: '地铁IP商城',
				isMall: true,
				isMerchant: false,
				isLink: '#/admin/system/role/index?',
			},
			'1922166211546841089': {
				name: '地铁IP商城-商户端',
				isMall: true,
				isMerchant: true,
			},
			'1922177185280557058': {
				name: '积分商城',
				isMall: true,
				isMerchant: false,
			},
			'1922177651909459970': {
				name: '积分商城-商户端',
				isMall: true,
				isMerchant: true,
			},
			'1924405083223752706': {
				name: '自有商城',
				isMall: true,
				isMerchant: false,
			},
			'1924405741414907905': {
				name: '自有商城-商户端',
				isMall: true,
				isMerchant: true,
			},
			'1925074881528070146': {
				name: '轨道甄选',
				isMall: true,
				isMerchant: false,
			},
			'1925075171367059458': {
				name: '轨道甄选-商户端',
				isMall: true,
				isMerchant: true,
			},
			'1952919039072403458': {
				name: '出行服务管理子系统',
				isMall: true,
				isMerchant: false,
			},
			'1955172500933574657': {
				name: '运动场馆管理平台',
				isMall: true,
				isMerchant: true,
			},
			'1963773220574330882': {
				name: '生活市集子系统',
				isMall: true,
				isMerchant: false,
			},
			'1963418928520757249': {
				name: '广告闪投',
				isMall: true,
				isMerchant: false,
			},
		},
	}),
	actions: {
		setThemeConfig(data: TenantConfigState) {
			this.tenantConfig = data.tenantConfig;
		},
	},
});
