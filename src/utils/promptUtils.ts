import { ElMessageBox, ElMessage } from 'element-plus';

/**
 * 打开 textarea 输入框，用于输入备注信息并校验
 */
export async function showRemarkPrompt() {
	try {
		const { value } = await ElMessageBox.prompt('', '请输入备注', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputErrorMessage: '备注内容不能为空',
			inputType: 'textarea', // 设置为 textarea
			inputValue: '', // 默认值
			inputPlaceholder: '请输入备注', // 占位符提示
			showClose: true,
			closeOnClickModal: false,
			customClass: 'remark-prompt-box',
			inputValidator: (value) => {
				if (!value || value.trim() === '') {
					return '备注内容不能为空';
				}
				if (value.length > 200) {
					return '备注内容不能超过200字';
				}
				return true; // 校验通过
			},
		});

		ElMessage.success('提交成功');
		console.log('用户输入的备注:', value);
		return value;
	} catch (err) {
		ElMessage.info('取消输入');
		throw new Error('用户取消输入备注');
	}
}
