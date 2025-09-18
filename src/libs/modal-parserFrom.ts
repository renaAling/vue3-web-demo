// /**
//  * 弹窗样式的表单配置的提交
//  * @param title 标题
//  * @param formName 表单name
//  * @param isCreate 是否是编辑
//  * @param editData 详情数据
//  * @param callback 回调函数
//  * @param keyNum 重置表单key值
//  * @returns {Promise<any>}
//  */
// export default function modalParserFrom(title, formName, isCreate, editData, callback, keyNum, isCulture) {
//   const h = this.$createElement;
//   const renderNode = isCulture ? 'cultureZBParser' : 'ZBParser';
//   return new Promise((resolve, reject) => {
//     this.$msgbox({
//       title,
//       customClass: 'upload-form',
//       closeOnClickModal: false,
//       showClose: true,
//       message: h('div', { class: 'common-form-upload' }, [
//         h(renderNode, {
//           props: {
//             formName,
//             isCreate,
//             editData,
//             keyNum,
//           },
//           on: {
//             submit(formValue) {
//               callback(formValue);
//             },
//           },
//         }),
//       ]),
//       showCancelButton: true,
//       showConfirmButton: false,
//     })
//       .then(() => {
//         resolve();
//       })
//       .catch(() => {
//         reject();
//         // this.$message({
//         //   type: 'info',
//         //   message: '已取消',
//         // });
//       });
//   });
// }
interface ModalParserFromOptions {
	title: string;
	formName: string;
	isCreate: boolean;
	editData?: Record<string, any>; // 假设详情数据是一个对象
	callback: (formValue: any) => void; // 回调函数类型
	keyNum: number | string; // 重置表单key值可能是数字或字符串
	isCulture: boolean; // 是否使用文化相关的渲染节点
}

export default function modalParserFrom({
	title,
	formName,
	isCreate,
	editData = {},
	callback,
	keyNum,
	isCulture,
}: ModalParserFromOptions): Promise<any> {
	const h = this.$createElement;

	// 根据 isCulture 决定渲染哪个组件
	const renderNode = isCulture ? 'cultureZBParser' : 'ZBParser';

	return new Promise((resolve, reject) => {
		this.$msgbox({
			title,
			customClass: 'upload-form',
			closeOnClickModal: false,
			showClose: true,
			message: h('div', { class: 'common-form-upload' }, [
				h(renderNode, {
					props: {
						formName,
						isCreate,
						editData,
						keyNum,
					},
					on: {
						submit(formValue: any) {
							callback(formValue);
						},
					},
				}),
			]),
			showCancelButton: true,
			showConfirmButton: false,
		})
			.then(() => {
				resolve();
			})
			.catch(() => {
				reject();
				// 如果需要提示取消信息，可以取消注释以下代码
				// this.$message({
				//   type: 'info',
				//   message: '已取消',
				// });
			});
	});
}
