<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 日期选择器 -->
			<div class="date-box">
				<el-icon class="btn" @click="handleDatePrev"><ArrowLeft /></el-icon>
				<div class="date-title">{{ year }} 年 {{ month }} 月</div>
				<el-icon class="btn" @click="handleDateNext"><ArrowRight /></el-icon>
			</div>

			<!-- 日历内容 -->
			<div class="content">
				<div class="calendar-box">
					<!-- 菜单内容 -->
					<div class="main-flex">
						<div v-for="(item, index) in dataList" :key="index" class="calendar-item" @click="selectDay(index)">
							<div class="item-header">
								<span>{{ weekDays[index] }}</span>
							</div>
							<div :class="['item-card', { active: selectedDay === index }]">
								<!-- 编辑图标按钮 -->
								<div class="btn-icon-edit" @click="onEditCard(item)">
									<el-icon><Edit /></el-icon>
								</div>
								<ul class="meal-list">
									<li v-for="(mealItem, idx) in item.calendarDetailVoList?.slice(0, 5)" :key="idx">{{ mealItem.spuName }}</li>
									<li v-if="item.calendarDetailVoList?.length > 5">...</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<ChooseMealDialog ref="chooseMealRef" @onRefresh="loadData" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import ChooseMealDialog from './components/chooseMealDialog.vue';
import { useMessage } from '/@/hooks/message';
import { getWeekDataApi } from '/@/api/goodStore/mall';
import { parseDate } from '/@/utils/formatTime';

// 定义星期名称
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const chooseMealRef = ref();
// 当前日期
const dt = new Date();
const year = ref(dt.getFullYear());
const month = ref(dt.getMonth() + 1);
// 当前选中的日期索引
const selectedDay = ref(dt.getDay() - 1); // 默认选中当天


// 菜单数据
const dataList = ref([]);

// 获取数据
const loadData = async () => {
	try {
		let params = {
			foodDate: parseDate(new Date(year.value + '/' + month.value), '{y}-{m}'),
		};
		let res = await getWeekDataApi(params);
		if (res.code == 0) {
			dataList.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};



// 切换日期
const selectDay = (dayIndex: number) => {
	selectedDay.value = dayIndex;
};

// 导航按钮：上一个月
const handleDatePrev = () => {
	if (month.value === 1) {
		year.value -= 1;
		month.value = 12;
	} else {
		month.value -= 1;
	}
	loadData();
};

// 导航按钮：下一个月
const handleDateNext = () => {
	if (month.value === 12) {
		year.value += 1;
		month.value = 1;
	} else {
		month.value += 1;
	}

	loadData();
};

const onEditCard = (data: any) => {
	console.log('编辑单天', data);
	chooseMealRef.value.openDialog(data);
};


onMounted(() => {
	loadData();
});
</script>

<style lang="scss" scoped>
.layout-padding {
	padding: 20px;
}

.date-box {
	display: flex;
	align-items: center;
	margin-bottom: 20px;

	.date-title {
		font-size: 16px;
		font-weight: bold;
		margin: 0 10px;
	}

	.btn {
		cursor: pointer;
		font-size: 20px;
	}
}

.content {
	padding: 20px;
}

.main-flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.calendar-item {
	width: calc(100% / 7);
	.item-header {
		padding: 8px 0;
		text-align: center;
	}

	.item-card {
		position: relative;
		height: 200px;
		padding: 10px;
		// border: solid 1px #ebeef5;
		border-radius: 5px;
		&:hover {
			border-color: #409eff;
		}

		&.active {
			border-color: #409eff;
			box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
		}
		.btn-icon-edit {
			position: absolute;
			right: 10px;
			top: 10px;
			cursor: pointer;
		}
		.meal-list {
			margin-top: 20px;
		}
	}
}
</style>
