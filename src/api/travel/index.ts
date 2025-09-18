import request from '/@/utils/request';

// 出行子系统后台-下拉查询成都市行政区划表
export function getRegionCodeListApi() {
	return request({
		url: `/ride/region_code/getList`,
		method: 'get',
	});
}

// 下拉列表-查询地铁线路信息表
export function getSubwayLineListApi(name?: any) {
	return request({
		url: `/ride/subway_line/page?name=${name}`,
		method: 'get',
	});
}
