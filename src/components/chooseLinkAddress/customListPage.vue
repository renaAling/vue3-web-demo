<template>
	<div class="custom-page-selector">
		<div>
			<!-- 搜索框 -->
			<div class="search-bar">
				<el-input placeholder="搜索页面名称" style="width: 40%" v-model="keyword" class="input-with-select">
					<template #append>
						<el-button icon="el-icon-search" @click="onSearch" />
					</template>
				</el-input>
			</div>

			<!-- 页面列表 -->
			<div class="list-box">
				<ul>
					<li v-for="(item, index) in dataList" :key="index" class="li-item">
						<el-radio-group v-model="selectPageId">
							<el-radio :label="item.id" />
						</el-radio-group>
						<div class="li-item-title">{{ item.name }}</div>
					</li>
				</ul>
			</div>

			<!-- 分页器 -->
			<div class="pagination-box">
				<el-pagination
					layout="total, sizes, prev, pager, next"
					:current-page="current"
					:page-size="pageSize"
					:total="total"
					background
					@current-change="handlePageChange"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadPageDiyListApi } from '/@/api/culture/devise';

// 响应式数据声明
const keyword = ref<string>('');
const defaultSelectedId = ref<number | null>(null);
const selectPageId = ref<number | null>(null);
const dataList = ref<Array<{ id: number; name: string }>>([]);
const total = ref<number>(0);
const pageSize = ref<number>(10);
const current = ref<number>(1);

// 加载数据方法
const loadData = async () => {
	const params = {
		name: keyword.value,
		current: current.value,
		size: pageSize.value,
		businessType: 3, // 文创类型
	};
	const data = await loadPageDiyListApi(params);
	dataList.value = data.records || [];
	total.value = data.total || 0;

	// 重置选择，如果有默认值再设回去
	selectPageId.value = null;
	if (defaultSelectedId.value) {
		selectPageId.value = defaultSelectedId.value;
	}
};

// 搜索事件
const onSearch = () => {
	current.value = 1; // 回到第一页
	loadData();
};

// 分页切换
const handlePageChange = (page: number) => {
	current.value = page;
	loadData();
};

// 被父组件调用：获取选中值
const getSelectedVal = (): number | null => {
	return selectPageId.value;
};

// 被父组件调用：设置选中值
const setSelectedVal = (val: string | null): void => {
	if (!val) {
		selectPageId.value = null;
		return;
	}
	try {
		const paramStr = val.split('?');
		const idSplitArr = paramStr[1].split('=');
		const id = Number(idSplitArr[1]);
		defaultSelectedId.value = id;
		selectPageId.value = id;
	} catch (e) {
		console.warn('无效的链接格式:', val);
	}
};

// 初始化加载数据
onMounted(() => {
	loadData();
});

// 将方法暴露给父组件调用
defineExpose({ getSelectedVal, setSelectedVal });
</script>

<style scoped>
.custom-page-selector {
	width: 100%;
	height: auto;
}

.list-box {
	width: 100%;
	padding: 10px;
}
.list-box .li-item {
	width: 100%;
	height: 40px;
	line-height: 40px;
	border-bottom: solid 1px #f2f2f2;
}
.list-box .li-item-title {
	display: inline-block;
	margin-left: 10px;
}

.pagination-box {
	margin-top: 10px;
	text-align: center;
}
</style>

<!-- <template>
  <div class="custom-page-selector">
    <div>
      <div class="search-bar">
        <el-input placeholder="搜索页面名称" style="width: 40%" v-model="keyword" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="onSearch()"></el-button>
        </el-input>
      </div>
      <div class="list-box">
        <ul>
          <li v-for="(item, index) in dataList" :key="index" class="li-item">
            <el-radio-group v-model="selectPageId">
              <el-radio :label="item.id" />
            </el-radio-group>
            <div class="li-item-title">{{ item.name }}</div>
          </li>
        </ul>
      </div>
      <div class="pagination-box">
        <el-pagination layout="total, sizes, prev, pager, next" :currentPage="current" :total="total" background @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { loadPageDiyListApi } from '@/api/devise';

export default {
  data() {
    return {
      // 页面数据
      keyword: '',
      defaultSelectedId: null,
      selectPageId: null,
      dataList: [],
      // 分页相关
      total: 0,
      pageSize: 10,
      current: 1,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    onSearch() {
      this.loadData();
    },
    async loadData() {
      let params = {
        name: this.keyword,
        current: this.current,
        size: this.pageSize,
        name: this.keyword,
        businessType: 3, // 文创 3
      };
      let data = await loadPageDiyListApi(params);
      this.dataList = data.records;
      this.total = data.total;
      this.selectPageId = null;  // 列表数据重新赋值后清除所选项
      if(this.defaultSelectedId) {
        this.selectPageId = this.defaultSelectedId;
      }
      console.log('表格数据加载完成', this.seletcPageId);
    },
    // 处理分页切换
    handlePageChange(page) {
      this.current = page;
      this.loadData();
    },
    // 获取选中值-用于父组件调用获取
    getSelectedVal() {
      console.log('getSelectedVal', this.selectPageId);
      return this.selectPageId;
    },
    // 设置选中值，用于父组件调用后默认回显
    setSelectedVal(val) {
      console.log('setSelectedVal', val);
      if (!val) {
        this.selectPageId = null;
        return;
      }
      const paramStr = val.split('?');
      const idSplitArr = paramStr[1].split('=');
      const id = Number(idSplitArr[1]);
      this.defaultSelectedId = id;
    },
  },
};
</script>

<style scoped>
.custom-page-selector {
  width: 100%;
  height: auto;
}

.list-box {
  width: 100%;
  padding: 10px;
  .li-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #f2f2f2;
    .li-item-title {
      display: inline-block;
      margin-left: 10px;
      /* font-size: 14px; */
    }
  }
}

.pagination-box {
  margin-top: 10px;
  text-align: center;
}
</style> -->
