// 出行
import { defineStore } from 'pinia';
import { useMessage } from '/@/hooks/message';
import { getRegionCodeListApi, getSubwayLineListApi } from '/@/api/note/noteInfo';

export const travelCommunalData = defineStore('travelCommunalData', {
	state: (): any => ({
		regionCodeList: [],
		regionCodeMap: {},
		stationTypeList: {
			1: '公交站',
			2: '公租自行车站',
		},
		subwayLineList: [],
	}),

	actions: {
		/**
		 * 出行子系统后台-下拉查询成都市行政区划表
		 */
		async getRegionCodeList() {
			const { data, msg, code } = await getRegionCodeListApi();
			if (code === 0) {
				this.regionCodeList = data;
				this.regionCodeList.map((item: any) => {
					this.regionCodeMap[item.regionCode] = item.regionName;
				});
				console.log('data', data);
			} else {
				useMessage().error(msg);
			}
		},
		/**
		 * 下拉列表-查询地铁线路信息表
		 */
		async getSubwayLineList(name?: any) {
			console.log('name', name);
			const { data, msg, code } = await getSubwayLineListApi(name);
			if (code === 0) {
				this.subwayLineList = data;
				console.log('data', data);
			} else {
				useMessage().error(msg);
			}
		},
	},
});
