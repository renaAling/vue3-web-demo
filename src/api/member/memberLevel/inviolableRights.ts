import request from '/@/utils/request';

// 分页查询历史版本规则
export const getMemberLevelGetList = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/getList',
		method: 'get',
		params,
	});
};

// 新增或编辑会员等级图片及权益
export const postSaveOrUpdateMemberLevelOther = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/saveOrUpdateMemberLevelOther',
		method: 'post',
		data: params,
	});
};

// 通过id查询会员等级信息(含图片及会员权益数组)
export const memberLevelGet = (id: string) => {
	return request({
		url: `/uac/memberLevel/get?id=${id}`,
		method: 'get',
	});
};
