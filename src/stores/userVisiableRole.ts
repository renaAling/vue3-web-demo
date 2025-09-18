import { defineStore } from 'pinia';
import { useMessage } from '/@/hooks/message';
import { getUserVisiableRoles } from '/@/api/admin/user';

export const userVisiableRole = defineStore('userVisiableRole', {
	state: (): UserRoleState => ({
		userRoleList: [],
	}),

	actions: {
		/**
		 * 获取用户可见角色信息方法
		 * @function setUserRoleInfos
		 * @async
		 */
		async setUserRoleInfos() {
			const { data, msg, code } = await getUserVisiableRoles();
			if (code === 0) {
				this.userRoleList = data;
			} else {
				useMessage().error(msg);
			}
		},
	},
});
