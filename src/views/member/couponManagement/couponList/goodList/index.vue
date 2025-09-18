<template>
  <div>
    <el-row class="justify-between">
      <el-form :inline="true" :model="state.tableFrom" @keyup.enter="getList(1)" ref="queryRef">
        <el-form-item label="商品搜索">
          <el-input v-model.trim="state.tableFrom.name" placeholder="请输入商品名称"  style="width: 180px;">
            <template #append>
              <el-button icon="Search" @click="getList(1)" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader v-model="state.tableFrom.categoryId" style="width: 180px;"  :options="state.categoryList"
            :props="state.props" filterable clearable @change="getList(1)" />
        </el-form-item>
        <el-form-item label="商户选择">
          <el-cascader v-model="state.tableFrom.merIds" style="width: 180px;" :show-all-levels="false"
            :options="state.merSelect" :props="state.merProps" filterable clearable @change="getList(1)" />
        </el-form-item>
        <el-form-item label="商品状态:">
          <el-select clearable v-model="state.tableFrom.isShow" placeholder="请选择商品状态" style="width: 180px;"
            @change="getList(1)">
            <el-option label="上架" value="1" />
            <el-option label="下架" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table border ref="multipleTable" :data="state.tableData.data" v-loading="state.listLoading" :row-key="getRowKeys"
      :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle" @selection-change="handleSelectionChange">
      <!-- <el-table-column align="center" type="selection" width="40" /> -->
      <!-- <el-table-column key="2" v-if="props.handleNum === 'many'" width="55">
        <template #header>
          <el-checkbox  :value="state.isChecked && state.checkedPage.indexOf(state.tableFrom.page) > -1"
            @change="changeType" />
        </template>
        <template #default="scope">
          <el-checkbox :value="state.checkedIds.indexOf(scope.row.id) > -1" @change="(v) => changeOne(v, scope.row)" />
        </template>
      </el-table-column> -->
      <el-table-column :reserve-selection="true"  type="selection" width="55" v-if="props.handleNum === 'many'"/>
      <el-table-column width="55" key="1" v-if="props.handleNum !== 'many'">
        <template #default="scope">
          <el-radio :label="scope.row.id" v-model="templateRadio"
            @change.native="getTemplateRow(scope.row)">&nbsp</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column label="商品图" width="80">
        <template #default="scope">
          <div class="demo-image__preview line-heightOne">
            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="180" />
      <el-table-column prop="categoryName" label="商品分类" min-width="100" />
      <el-table-column label="商品状态" width="100">
        <template #default="scope">
          <span>{{ scope.row.isShow ? '上架' : '下架' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="state.tableFrom.limit"
      :current-page="state.tableFrom.page" layout="total, sizes, prev, pager, next, jumper"
      :total="state.tableData.total" @size-change="handleSizeChange" @current-change="pageChange" />
    <div v-if="props.handleNum === 'many'" class="flex justify-center mt-5">
      <el-button @click="close" class="mr-2">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="goodListModal">
import { productActivityListApi } from '/@/api/culture/product';
import { merCategoryListApi } from '/@/api/culture/merchant';
import { ElTable } from 'element-plus'
import { useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import {
  productCategoryApi
} from '/@/api/culture/commodity/commodityList';
const props = defineProps({
  handleNum: {
    type: String,
    default: '',
  },
  checked: {
    type: Array,
    default: () => [],
  },
  goodsType: {
    type: String,
    default: '',
  }
});
const state = reactive({
  templateRadio: 0,
  props: {
    value: 'id',
    label: 'name',
    children: 'childList',
    expandTrigger: 'hover',
    checkStrictly: false,
    emitPath: false,
    multiple: false,
  },
  merProps: {
    value: 'id',
    label: 'name',
    children: 'merchantList',
    expandTrigger: 'hover',
    //checkStrictly: true,
    emitPath: false,
    multiple: true,
  },
  listLoading: true,
  tableData: {
    data: [],
    total: 0,
  },
  tableFrom: {
    page: 1,
    limit: 10,
    categoryId: '',
    name: '',
    isShow: '',
    merIds: '',
    merStars: '',
  },
  merIds: [],
  name: '',
  categoryList: [],
  imgList: [],
  multipleSelection: [],
  checkedPage: [],
  isChecked: false,
  isIndex: 0,
  checkBox: [],
  merSelect: [],
  checkedIds: [], // 订单当前页选中的数据
})

const { tableStyle } = useTable(state);


const adminProductClassify = ref<any[]>([]);

onMounted(() => {
  if (props.checked.length) {
    let [...arr2] = props.checked;
    state.checkBox = arr2;
    state.checkedIds = arr2.map((item) => {
      return item.id;
    });
  }
  getAdminProductClassify()
  // nextTick(() => {
  //   state.categoryList = store.getters.adminProductClassify;
  // });
  getMerchantList();
  getList();
  
})
/** 平台商品分类 **/
const getAdminProductClassify = async () => {
  try {
    const { code, data, msg } = await productCategoryApi();
    if (code === 0) {
      console.log('data', data);
      adminProductClassify.value = data;
      state.categoryList = data
    } else {
      useMessage().error(msg);
    }
  } catch (error: any) {
    useMessage().error(error.msg);
  }
};
const emit = defineEmits(['closeDialog', 'getStoreItem']);
const close = () => {
  emit('closeDialog', null);
};
// 商户列表
const getMerchantList = () => {
  merCategoryListApi().then((res) => {
    state.merSelect = res.data;
  });
};
const getRowKeys = (row) =>{
  return row.id;
};
const changeType = (v) => {
  state.isChecked = v;
  const index = state.checkedPage.indexOf(state.tableFrom.page);
  state.isIndex = index;
  state.checkedPage.push(state.tableFrom.page);
  if (index > -1) {
    state.checkedPage.splice(index, 1);
  }
  syncCheckedId(v);
};
const changeOne = (v, order) => {
  if (v) {
    const index = state.checkedIds.indexOf(order.id);
    if (index === -1) {
      state.checkedIds.push(order.id);
      state.checkBox.push(order);
    }
  } else {
    const index = state.checkedIds.indexOf(order.id);
    if (index > -1) {
      state.checkedIds.splice(index, 1);
      state.checkBox.splice(index, 1);
    }
  }
};
const syncCheckedId = (o) => {
  const ids = state.tableData.data.map((v) => v.id);
  if (o) {
    state.tableData.data.forEach((item) => {
      const index = state.checkedIds.indexOf(item.id);
      if (index === -1) {
        state.checkedIds.push(item.id);
        state.checkBox.push(item);
      }
    });
  } else {
    state.tableData.data.forEach((item) => {
      const index = state.checkedIds.indexOf(item.id);
      if (index > -1) {
        state.checkedIds.splice(index, 1);
        state.checkBox.splice(index, 1);
      }
    });
  }
};
const handleSelectionChange = (val) => {
  state.checkedIds = val.map(e => e.id)
  state.checkBox = val;
  // const tables = [];
  // val.map((item) => {
  //   tables.push({ src: item.image, id: item.id });
  // });
  // state.multipleSelection = tables;
};
const handleSubmit = () => {
  if (state.checkBox.length > 100) return useMessage().warning('最多可选择100个商品');
  emit('getStoreItem', state.checkBox);
};
const getTemplateRow = (row) => {
  emit('getStoreItem', row);
};
const multipleTable = ref<InstanceType<typeof ElTable>>();
const getList = (num?: number) => {
  state.listLoading = true;
  state.tableFrom.page = num ? num : state.tableFrom.page;
  // state.tableFrom.name = encodeURIComponent(state.name);
  // state.tableFrom.merIds = state.merIds.toString();
  let params = {
    goodsType: props.goodsType,
    ...state.tableFrom,
  };
  productActivityListApi(params)
    .then((data) => {
      const res = data.data
      state.tableData.data = res.records;
      state.tableData.total = res.total;
      // res.records.map((item) => {
      //   state.imgList.push(item.image)
      // })
      state.tableData.data.forEach((item) => {
       state.checkBox.forEach((element) => {
          if (Number(item.id) === Number(element.id)) {
            nextTick(() => {
              multipleTable.value.toggleRowSelection(item, true);
            });
          }
        });
      });
      state.listLoading = false;
    })
    .catch((res) => {
      state.listLoading = false;
      useMessage().error(res.message);
    });
};
const pageChange = (page) => {
  state.tableFrom.page = page;
  getList();
};
const handleSizeChange = (val) => {
  state.tableFrom.limit = val;
  getList();
};
</script>

<style scoped lang="scss">
.seachTiele {
  line-height: 35px;
}

.fr {
  float: right;
}
.demo-image__preview {
  display: inline-block;
  .el-image {
    width: 50px;
    height: 50px;
  }
}

.line-heightOne {
  line-height: 1;
}
</style>
