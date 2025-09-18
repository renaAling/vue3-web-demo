<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<div class="mb-[60px] flex justify-center" v-if="stepsActive === 1">
				<el-form ref="formEl1" class="w-[600px]" :rules="configFormRules" :model="configForm" label-width="110px">
					<el-form-item label="场馆名称" prop="name">
						<el-input v-model="configForm.name" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="场馆排序" prop="sort">
						<el-input-number v-model="configForm.sort" controls-position="right" :min="0" :max="99999" :precision="0" />
						<p class="desc">数字越小，在用户端场馆列表排序越靠前，如设置为1，则显示在第一位。</p>
					</el-form-item>
					<el-form-item label="场馆照片" prop="resources[0].imageUrl" :rules="configFormRules.resources">
						<div class="upload-item flex items-center">
							<UploadImg
								class="mr-[10px]"
								v-for="(item, index) in configForm.resources"
								:key="index"
								v-model:imageUrl="configForm.resources[index].imageUrl"
								:fileType="['image/jpeg', 'image/jpg', 'image/png']"
							>
								<template #tip>
									<span @click="handleSetCover(index)" class="text-[#409EFF] cursor-pointer">
										{{ item.isMain ? '封面' : '设为封面' }}
									</span>
								</template>
							</UploadImg>
							<el-button v-if="configForm.resources.length < 5" @click="handleCreateUploadComponent" type="primary"> 添加上传图片 </el-button>
						</div>
						<div class="desc w-full">上传场馆照片，最多5张</div>
					</el-form-item>
					<el-form-item label="是否启用" prop="status">
						<el-switch
							v-model="configForm.status"
							inline-prompt
							active-text="启用"
							inactive-text="关闭"
							:active-value="true"
							:inactive-value="false"
							:before-change="() => beforeChangeSwitch(configForm.status)"
						/>
						<p class="desc w-full">未启用的场馆在用户端不可见，已有预定的订单将不可用。</p>
					</el-form-item>
					<el-form-item label="场馆地址" prop="address">
						<el-input v-model="configForm.address" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="联系电话" prop="mobile">
						<el-input v-model="configForm.mobile" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="自动开放天数" prop="openDay">
						<el-input-number v-model="configForm.openDay" controls-position="right" :min="0" :max="99999" :precision="0">
							<template #suffix>
								<span>天</span>
							</template>
						</el-input-number>
						<p class="desc">自动开放N天(含今天)的场次供预约，设置为1则仅开放当天，次日生效。</p>
					</el-form-item>
					<el-form-item label="预定须知" prop="desc">
						<el-input type="textarea" :maxlength="200" v-model="configForm.desc" placeholder="请输入预定须知，200字以内" />
					</el-form-item>
				</el-form>
			</div>
			<div class="mb-[60px] flex justify-center" v-if="stepsActive === 2">
				<el-form ref="formEl2" class="w-[600px]" :rules="commonFormRules" :model="commonForm" label-width="110px">
					<div class="py-5 border-b border-gray-100 last:border-0" v-for="(a, i) of commonForm.stadiumConfigs" :key="i">
						<el-form-item label="场地类型" :prop="`stadiumConfigs.${i}.name`" :rules="commonFormRules.name">
							<el-input v-model="a.name" placeholder="请输入场地类型，如羽毛球、网球、足球等" />
							<el-button v-if="commonForm.stadiumConfigs.length > 1" class="absolute right-[-30px]" link :icon="Delete" @click="handleDeleteCofig(i)" />
						</el-form-item>
						<el-form-item class="font-bold" label="通用设置" />
						<el-form-item label="是否启用" prop="status">
							<el-switch
								v-model="a.status"
								inline-prompt
								active-text="启用"
								inactive-text="关闭"
								:active-value="true"
								:inactive-value="false"
								:before-change="() => beforeChange(a.status, i)"
							/>
							<p class="desc w-full">未启用的场馆在用户端不可见，已有预定的订单将不可用。</p>
						</el-form-item>
						<el-form-item label="预定时间段" required>
							<div class="flex">
								<el-time-select
									v-model="a.startTime"
									:max-time="a.endTime"
									placeholder="请选择"
									start="00:00"
									end="23:30"
									step="00:30"
									format="HH:mm"
									:prop="`stadiumConfigs.${i}.startTime`"
									:rules="commonFormRules.startTime"
								/>
								<span class="mx-2">-</span>
								<el-time-select
									v-model="a.endTime"
									:min-time="a.startTime"
									placeholder="请选择"
									start="00:00"
									end="23:30"
									step="00:30"
									format="HH:mm"
									:prop="`stadiumConfigs.${i}.endTime`"
									:rules="commonFormRules.endTime"
								/>
							</div>
						</el-form-item>
						<el-form-item label="连续预定限制" :prop="`stadiumConfigs.${i}.limitNum`" :rules="commonFormRules.limitNum">
							<el-input-number v-model="a.limitNum" controls-position="right" :min="0" :max="99999" :precision="0">
								<template #suffix>
									<span>场</span>
								</template>
							</el-input-number>
							<p class="desc">最多可选择的连续场次数量，1场=30分钟</p>
						</el-form-item>
						<el-form-item class="font-bold" label="场地配置">(至少配置1个)</el-form-item>
						<!-- :rules="commonFormRules.venueName" -->
						<el-form-item
							label="场馆名称"
							:prop="`stadiumConfigs.${i}.stadiumConfigSubs.${index}.name`"
							v-for="(item, index) of a.stadiumConfigSubs"
							:key="index"
						>
							<el-input v-model="item.name" placeholder="请输入，如1号场，10个字符以内" maxlength="10" />
							<el-button v-if="index !== 0" class="absolute right-[-30px]" link :icon="Delete" @click="a.stadiumConfigSubs.splice(index, 1)" />
						</el-form-item>
						<el-form-item>
							<el-button :icon="Plus" @click="a.stadiumConfigSubs?.push({ name: '' })">增加场地</el-button>
						</el-form-item>
					</div>
					<div>
						<el-button
							class="w-full my-5"
							:icon="Plus"
							@click="
								commonForm.stadiumConfigs?.push({ name: '', status: true, startTime: '', endTime: '', limitNum: 0, stadiumConfigSubs: [{ name: '' }] })
							"
						>
							新增场地类型
						</el-button>
					</div>
				</el-form>
			</div>
			<div class="footer">
				<el-button v-if="stepsActive < 2" type="danger" @click="handleDel">删除场馆</el-button>
				<el-button @click="cancelConfig">取消配置</el-button>
				<el-button v-if="stepsActive > 1" @click="prevStep">上一步</el-button>
				<el-button v-if="stepsActive < 2" type="primary" @click="nextStep">下一步</el-button>
				<el-button v-if="stepsActive === 2" type="primary" :loading="loading" @click="handleSave">保存配置</el-button>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import UploadImg from '/@/components/Upload/Image.vue';
import { useMessage } from '/@/hooks/message';
import { stadiumAddApi, stadiumUpdateApi, stadiumInfoApi, deleteStadium } from '/@/api/sportsVenue/index';
// import { validateMobile } from '/@/utils/toolsValidate';

const route = useRoute();
const router = useRouter();
const stepsActive = ref(1);

const formEl1 = ref();
const configForm = ref({
	name: '',
	sort: 0,
	address: '',
	mobile: '',
	openDay: 0,
	desc: '',
	status: true,
	resources: [
		{
			imageUrl: '',
			isMain: true,
			sort: 0,
		},
	],
});

const configFormRules = ref({
	name: [{ required: true, message: '请输入场馆名称', trigger: 'blur' }],
	sort: [{ required: true, message: '请输入场馆排序', trigger: 'blur' }],
	resources: [{ required: true, message: '请上传场馆照片', trigger: 'change' }],
	address: [{ required: true, message: '请输入场馆地址', trigger: 'blur' }],
	// mobile: [{ validator: validateMobile, trigger: 'blur' }],
	openDay: [{ required: true, message: '请输入自动开放天数', trigger: 'blur' }],
});

const formEl2 = ref();
const commonForm = ref({
	stadiumConfigs: [
		{
			name: '',
			status: true,
			startTime: '',
			endTime: '',
			limitNum: 0,
			stadiumConfigSubs: [
				{
					name: '',
				},
				{
					name: '',
				},
				{
					name: '',
				},
				{
					name: '',
				},
				{
					name: '',
				},
			],
		},
	],
});
const commonFormRules = ref({
	name: [
		{ required: true, message: '请输入场地类型', trigger: 'blur' },
		{
			validator: (rule: any, value: string, callback: any) => {
				if (!value) {
					callback();
					return;
				}

				const currentIndex = parseInt(rule.field.split('.')[1]); // 获取当前索引
				const hasDuplicate = commonForm.value.stadiumConfigs.some((item, index) => index !== currentIndex && item.name === value);

				if (hasDuplicate) {
					callback(new Error('该类型场地已存在，请重新输入'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
	endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
	limitNum: [{ required: true, message: '请输入连续预定限制', trigger: 'blur' }],
	// venueName: [{ required: true, message: '请输入场馆名称', trigger: 'blur' }],
});

// 上传多张图片
const handleCreateUploadComponent = () => {
	const MAX_IMAGES = 5;
	if (configForm.value.resources.some((item: any) => !item.imageUrl)) {
		useMessage().error('请先上传已有的图片');
		return;
	}
	if (configForm.value.resources.length >= MAX_IMAGES) {
		useMessage().error(`最多上传${MAX_IMAGES}张场馆照片`);
		return;
	}
	configForm.value.resources?.push({
		imageUrl: '',
		isMain: false,
		sort: configForm.value.resources.length,
	});
};

// 设为封面
const handleSetCover = (index: number) => {
	configForm.value.resources = configForm.value.resources?.map((item, i) => ({ ...item, isMain: i === index }));
};

// 场馆
const beforeChangeSwitch = async (val: boolean) => {
	if (val) {
		ElMessageBox.confirm('禁用场馆后，用户已预定的订单状态将变为"不可用"', '禁用场馆', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
		})
			.then(() => {
				configForm.value.status = !val;
			})
			.catch(() => {
				configForm.value.status = val;
			});
	} else {
		configForm.value.status = !val;
	}
};

// 场地
const beforeChange = async (val: boolean, index: number) => {
	const updatedConfigs = [...commonForm.value.stadiumConfigs];

	try {
		if (val) {
			// 当要禁用场地时显示确认对话框
			await ElMessageBox.confirm('禁用场地后，用户已预定的订单状态将变为"不可用"', '禁用场地', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
			});
		}

		updatedConfigs[index] = {
			...updatedConfigs[index],
			status: !val,
		};

		commonForm.value.stadiumConfigs = updatedConfigs;
	} catch (error) {
		// 用户取消操作时，保持原状态，只有在尝试禁用时才需要恢复原值
		if (val) {
			updatedConfigs[index] = {
				...updatedConfigs[index],
				status: val,
			};
			commonForm.value.stadiumConfigs = updatedConfigs;
		}
		console.error('操作取消或发生错误:', error);
	}
};

const handleDeleteCofig = (index: number) => {
	ElMessageBox.confirm('已被用户预定的场地，删除后订单不可用，请谨慎操作', '删除场地', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			commonForm.value.stadiumConfigs.splice(index, 1);
		})
		.catch(() => {});
};

const handleDel = () => {
	ElMessageBox.confirm('删除场馆后不可恢复，用户已预定的订单状态将变为"不可用"', '删除场馆', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			const res = await deleteStadium(route.query.code as string);
			if (res?.ok) {
				useMessage().success('删除成功');
				router.go(-1);
			}
		})
		.catch(() => {});
};

const cancelConfig = () => {
	ElMessageBox.confirm('退出后不会保存已修改的信息', '取消配置', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(() => {
			router.go(-1);
		})
		.catch(() => {});
};

const prevStep = () => {
	stepsActive.value--;
};

const nextStep = async () => {
	const valid = await formEl1.value?.validate();
	if (!valid) return;
	stepsActive.value++;
};

const getStadiumDetail = async () => {
	const params = route.query.code as string;
	if (!params) return;
	const { data } = await stadiumInfoApi(params);
	configForm.value = { ...data };
	commonForm.value = {
		stadiumConfigs: data?.stadiumConfigs?.map((item: any) => {
			return {
				...item,
				startTime: item.startTime.slice(0, 5),
				endTime: item.endTime.slice(0, 5),
				stadiumConfigSubs: item?.stadiumConfigSubs || []
			};
		}),
	};
};

const loading = ref(false);
const handleSave = async () => {
	const valid = await formEl2.value?.validate();
	if (valid) {
		const params = {
			...configForm.value,
			...commonForm.value,
			stadiumConfigs: commonForm.value.stadiumConfigs?.map((item: any) => {
				return {
					...item,
					startTime: `${item.startTime}:00`,
					endTime: `${item.endTime}:00`,
					stadiumConfigSubs: item?.stadiumConfigSubs?.filter((item: any) => item.name !== "")
				};
			}),
		};
		try {
			loading.value = true;
			const res = route.query.code ? await stadiumUpdateApi(params) : await stadiumAddApi(params);
			if (res?.ok) {
				loading.value = false;
				useMessage().success('操作成功');
				router.go(-1);
			} else {
				loading.value = false;
				useMessage().error(res?.msg || '操作失败');
			}
		} catch (err: any) {
			const errorMsg = err?.msg || '操作失败';
			useMessage().error(errorMsg);
		} finally {
			loading.value = false;
		}
	}
};

onMounted(() => {
	getStadiumDetail();
});
</script>
<style lang="scss" scoped>
.desc {
	color: #888;
	font-size: 12px;
}

.footer {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 60px;
	background: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
