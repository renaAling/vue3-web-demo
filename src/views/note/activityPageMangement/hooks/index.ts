export const activityList = [
  {
    label: '未开始',
    value: '1'
  },
  {
    label: '进行中',
    value: '2'
  },
  {
    label: '已结束',
    value: '3'
  },
]
import { ElMessageBox } from 'element-plus';
import router from '/@/router';
/**
* 返回函数
*
* @param refValue 表单引用对象
* @param backPath 返回路径
* @param tips 提示信息，默认为“请确认是否取消编辑”
*/
export const goBackFn = (refValue:any,backPath:string,tips:string='请确认是否取消编辑') => {
 	ElMessageBox.confirm(tips, '取消编辑', {
		distinguishCancelAndClose: true,
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			refValue?.resetFields();
			router.push({
				path: backPath,
			});
		})
		.catch(() => {
			return;
		});
}