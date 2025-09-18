import { defineStore } from 'pinia';
// 成都轨道生活智慧服务平台
export const usePortalList = defineStore('portal', {
	state: (): portalState => ({
		homeActive: false,
		newsActive: false,
		setActive: false,
		modeView: 'user', // 管理模式 admin | 用户模式 user
		systemList: [],
	}),
	actions: {
		async setHomeActive() {
			this.homeActive = true;
			this.setActive = false;
			this.newsActive = false;
		},
		async setNewsActive() {
			this.setActive = false;
			this.homeActive = false;
			this.newsActive = true;
		},
		async setSetActive() {
			this.setActive = true;
			this.homeActive = false;
			this.newsActive = false;
		},
		async setModeView(mode: string) {
			this.modeView = mode;
		},
		async setSystemList(list: any[]) {
			this.systemList = list;
		},
	},
});
