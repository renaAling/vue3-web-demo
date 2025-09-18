<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="queryForm" ref="queryRef">
					<el-form-item label="订单类型" prop="type">
						<el-select v-model="queryForm.type" clearable placeholder="请选择订单类型" @change="handleSearchList" class="selWidth">
							<el-option v-for="(item, i) in fromType" :key="i" :label="item.text" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间" prop="orderTime">
						<el-date-picker
							v-model="orderTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							@change="changeOrderTime"
						/>
					</el-form-item>
					<el-form-item label="订单编号" prop="orderNo">
						<el-input
							class="selWidth"
							v-model.trim="queryForm.orderNo"
							placeholder="请输入订单编号"
							clearable
							@keyup.enter.native="handleSearchList"
						/>
					</el-form-item>
					<el-form-item label="供应商名称" prop="merId" v-if="!isMerchant">
						<el-select v-model="queryForm.merId" clearable placeholder="请选择商户名称" class="selWidth" @change="handleSearchList">
							<el-option v-for="(item, index) in selectMerId" :key="index" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="下单手机号" prop="mobile">
						<el-input
							v-model.trim="queryForm.mobile"
							placeholder="请输入下单手机号"
							class="selWidth"
							clearable
							@keyup.enter.native="handleSearchList"
						/>
					</el-form-item> -->
					<el-form-item label="收货方式" prop="shippingType">
						<el-select v-model="queryForm.shippingType" clearable placeholder="请选择收货方式" class="selWidth" @change="handleSearchList">
							<el-option label="快递发货" :value="1" />
							<el-option label="同城商品" :value="5" />
							<el-option label="订单核销" :value="2" />
							<el-option label="线上卡密" :value="3" />
							<!-- <el-option label="邮寄" :value="1" />
							<el-option label="自提" :value="2" />
							<el-option label="虚拟发货" :value="3" /> -->
						</el-select>
					</el-form-item>
					<el-form-item label="下单身份" prop="isStaff">
						<el-select v-model="queryForm.isStaff" clearable placeholder="请选择下单身份" class="selWidth" @change="handleSearchList">
							<el-option label="员工" :value="true" />
							<el-option label="非员工" :value="false" />
						</el-select>
					</el-form-item>
					<el-form-item label="支付时间" prop="paymentTime">
						<el-date-picker
							v-model="paymentTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							@change="changePaymentTime"
						/>
					</el-form-item>
					<el-form-item label="用户昵称" prop="nickname">
						<el-input class="selWidth" v-model.trim="queryForm.nickname" placeholder="请输入用户昵称" clearable />
					</el-form-item>
					<el-form-item label="用户手机号" prop="mobile">
						<el-input class="selWidth" v-model.trim="queryForm.mobile" placeholder="请输入用户手机号" clearable />
					</el-form-item>
					<el-form-item label="收货人电话" prop="mobile">
						<el-input class="selWidth" v-model.trim="queryForm.userPhone" placeholder="请输入收货人电话" clearable />
					</el-form-item>
					<el-form-item>
						<el-button @click="handleSearchList" icon="search" type="primary">查询</el-button>
						<el-button @click="handleReset" icon="Refresh">重置</el-button>
					</el-form-item>
					<el-tabs type="card" class="demo-tabs" v-model="queryForm.shippingType" @tab-click="handleClickTabs">
						<el-tab-pane label="快递发货" :name="1"></el-tab-pane>
						<el-tab-pane label="同城商品" :name="5"></el-tab-pane>
						<el-tab-pane label="订单核销" :name="2"></el-tab-pane>
						<el-tab-pane label="线上卡密" :name="3"></el-tab-pane>
					</el-tabs>
					<el-tabs
						class="list-tabs mt14"
						v-if="queryForm.shippingType == 1"
						v-model="queryForm.status"
						@tab-click="handleClick"
					>
						<el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="unPaid" :label="`待支付(${orderChartType.unPaid || 0})`"></el-tab-pane> -->
						<el-tab-pane name="notShipped" :label="`待发货(${orderChartType.notShipped || 0})`"></el-tab-pane>
						<el-tab-pane name="inStock" :label="`部分发货(${orderChartType.inStock || 0})`"></el-tab-pane>
						<el-tab-pane name="spike" :label="`待收货(${orderChartType.spike || 0})`"></el-tab-pane>
						<el-tab-pane name="receiving" :label="`已收货(${orderChartType.receiving || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane> -->
						<el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="canceled" :label="`已取消(${orderChartType.canceled || 0})`"></el-tab-pane>
						<el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="deleted" :label="`已删除(${orderChartType.deleted || 0})`"></el-tab-pane> -->
					</el-tabs>
					<el-tabs class="list-tabs mt14" v-if="queryForm.shippingType === 2" v-model="queryForm.status" @tab-click="handleClick">
						<el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="unPaid" :label="`待支付(${orderChartType.unPaid || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="notShipped" :label="`待备货(${orderChartType.notShipped || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="inStock" :label="`备货中(${orderChartType.inStock || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="spike" :label="`待收货(${orderChartType.spike || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="receiving" :label="`已收货(${orderChartType.receiving || 0})`"></el-tab-pane> -->
						<el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane>
						<el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="canceled" :label="`已取消(${orderChartType.canceled || 0})`"></el-tab-pane>
						<el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane> -->
					</el-tabs>
					<el-tabs class="list-tabs mt14" v-if="queryForm.shippingType === 3" v-model="queryForm.status" @tab-click="handleClick">
						<el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="unPaid" :label="`待支付(${orderChartType.unPaid || 0})`"></el-tab-pane> -->
						<el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="canceled" :label="`已取消(${orderChartType.canceled || 0})`"></el-tab-pane>
						<el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane> -->
					</el-tabs>
					<el-tabs
						class="list-tabs mt14"
						v-if="queryForm.shippingType == 5"
						v-model="queryForm.status"
						@tab-click="handleClick"
					>
						<el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="unPaid" :label="`待支付(${orderChartType.unPaid || 0})`"></el-tab-pane> -->
						<el-tab-pane name="notShipped" :label="`待取件(${orderChartType.notShipped || 0})`"></el-tab-pane>
						<el-tab-pane name="inStock" :label="`部分发货(${orderChartType.inStock || 0})`"></el-tab-pane>
						<el-tab-pane name="spike" :label="`配送中(${orderChartType.spike || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="receiving" :label="`已收货(${orderChartType.receiving || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane> -->
						<el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="canceled" :label="`已取消(${orderChartType.canceled || 0})`"></el-tab-pane>
						<el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane> -->
						<!-- <el-tab-pane name="deleted" :label="`已删除(${orderChartType.deleted || 0})`"></el-tab-pane> -->
					</el-tabs>
				</el-form>
			</el-row>
			<el-row>
				<div class="mt5" style="width: 100%">
					<!-- <el-button type="primary" :disabled="!selectionList.length" @click="outCancelAll">批量取消</el-button> -->
					<!-- @click="outBoundAll" -->
					<!-- <el-button type="primary" plain @click="writeOffRef.show()" v-if="isMerchant">订单核销</el-button>
					<el-button @click="exports">导出</el-button>
					<el-button type="primary" plain @click="excelUploadRef.show()">批量发货</el-button>
					 -->
					<el-button @click="exports">导出</el-button>
					<el-button type="primary" plain @click="excelUploadRef.show()">批量发货</el-button>
					<el-button
						type="primary"
						v-if="tenantId == '1815608904948617218' || tenantId == '1925082852790239233'"
						:disabled="!selectionList.length"
						@click="outBoundAll"
						>批量出库</el-button
					>
				</div>
			</el-row>
			<el-table
				:data="tableData.data"
				v-loading="listLoading"
				row-key="orderNo"
				border
				@selection-change="handleSelectionChange"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				class="mt20"
			>
				<el-table-column type="selection" width="50" />
				<el-table-column label="订单编号" min-width="200" v-if="checkedCities.includes('订单编号')">
					<template #default="{ row }">
						<div class="acea-row">
							<span v-show="row.type === 1" class="mr5 format_color">[视频号]</span>
							<span v-show="row.type === 2" class="mr5 format_color">[秒杀]</span>
							<span v-show="row.type === 5" class="mr5 format_color">[云盘]</span>
							<span v-show="row.type === 6" class="mr5 format_color">[卡密]</span>
							<span style="display: block" :class="parseInt(row.refundStatus) > 0 ? 'colorPrompt' : ''" v-text="row.orderNo" />
						</div>
						<span class="colorPrompt text_left" v-show="parseInt(row.refundStatus) > 0">
							{{ orderRefundStatusFilter[row.refundStatus] }}
						</span>
						<span v-show="row.isUserDel" class="colorPrompt text_left">用户已删除</span>
					</template>
				</el-table-column>
				<el-table-column prop="merName" label="供应商名称" v-if="checkedCities.includes('商户名称')" />
				<el-table-column prop="nickname" label="用户昵称" v-if="checkedCities.includes('用户昵称')">
					<template #default="{ row }">
						<span :class="row.isLogoff == true ? 'colorPrompt' : ''">{{ row.nickname }}</span>
						<span :class="row.isLogoff == true ? 'colorPrompt' : ''" v-if="row.isLogoff == true">|</span>
						<span v-if="row.isLogoff == true" class="colorPrompt">(已注销)</span>
					</template>
				</el-table-column>
				<el-table-column label="支付现金" prop="payPrice" />
				<el-table-column label="使用积分" prop="scorePrice">
					<template #default="{ row }">
						<span>{{ row.scorePrice || 0 }}</span>
						<span v-if="row.scorePrice != null">（{{ (row.scorePrice / 100).toFixed(2) }}元）</span>
					</template>
				</el-table-column>
				<el-table-column label="运费" prop="payPostage" />
				<el-table-column label="支付方式" prop="payType" v-if="checkedCities.includes('支付方式')" />
				<el-table-column label="订单状态">
					<template #default="{ row }">
						<div v-if="row.shippingType === 1">
							<!-- 快递发货 -->
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<el-tag v-if="row.status === 1">待发货</el-tag>
							<el-tag v-if="row.status === 2">部分发货</el-tag>
							<el-tag v-if="row.status === 4">待收货</el-tag>
							<el-tag v-if="row.status === 5">已收货</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
						</div>
						<div v-if="row.shippingType === 2">
							<!-- 订单自提核销  -->
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<el-tag v-if="row.status === 3 || row.status ===1 || row.status === 2">待核销</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
						</div>
						<div v-if="row.shippingType === 3">
							<!-- 线上卡密 -->
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<!-- <el-tag v-if="row.status === 1">待发放</el-tag> -->
							<el-tag v-if="row.status === 2">发放中</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
						</div>
						<div v-if="row.shippingType === 5">
							<!-- 同城配送 -->
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<el-tag v-if="row.status === 1">待取件</el-tag>
							<el-tag v-if="row.status === 2">部分发货</el-tag>
							<el-tag v-if="row.status === 4">配送中</el-tag>
							<el-tag v-if="row.status === 5">已收货</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
						</div>
						<!-- <div v-if="queryForm.logistics == 3">
							<span class="tag-background doingTag" v-if="row.status === 0">待支付</span>
							<span class="tag-background doingTag" v-if="row.status === 1">待取件</span>
							<span class="tag-background doingTag" v-if="row.status === 2">配送中</span>
							<span class="tag-background doingTag" v-if="row.status === 3">已完成</span>
						</div>
						<div v-if="queryForm.logistics == 4">
							<span class="tag-background doingTag" v-if="row.status === 0">待支付</span>
							<span class="tag-background doingTag" v-if="row.status === 1">待发放</span>
							<span class="tag-background doingTag" v-if="row.status === 2">已发放</span>
							<span class="tag-background doingTag" v-if="row.status === 6">已完成</span>
							<span class="tag-background doingTag" v-if="row.status === 9">已取消</span>
							<span class="tag-background doingTag" v-if="row.status === 10">已退款</span>
						</div>
						<div>
							<span class="tag-background doingTag" v-if="row.status === 0">待支付</span>
							<span class="tag-background doingTag" v-if="row.status === 1">待支付</span>
						</div>
						<span class="notStartTag tag-background" v-if="row.refundStatus === 3">已退款</span>
						<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 1">待发货</span>
						<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 2">待核销</span>
						<span class="tag-background" :class="row.status < 5 ? 'doingTag' : 'endTag'" v-else>{{ orderStatusFilters[row.status] }}</span> -->
					</template>
				</el-table-column>
				<el-table-column label="发货状态">
					<template #default="{ row }">
						<el-tag v-if="row.shippingStatus === 1">待出库</el-tag>
						<el-tag v-else-if="row.shippingStatus === 2">已出库</el-tag>
						<el-tag v-else-if="row.shippingStatus === 3">已发货</el-tag>
						<el-tag v-else-if="row.shippingStatus === 4">部分发货</el-tag>
						<!-- <span class="tag-background doingTag" v-if="row.shippingStatus == 1">待出库</span>
						<span class="tag-background doingTag" v-else-if="row.shippingStatus == 2">已出库</span>
						<span class="tag-background doingTag" v-else-if="row.shippingStatus == 3">已发货</span>
						<span class="tag-background doingTag" v-else-if="row.shippingStatus == 4">部分发货</span> -->
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="下单时间" min-width="140" v-if="checkedCities.includes('下单时间')" />
				<!-- <el-table-column prop="mobile" label="收货人电话" min-width="140" /> -->
				<el-table-column label="操作" width="220" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)"> 详情 </el-button>
						<!-- v-if="tenantId == '1815608904948617218' && (queryForm.logistics == 2 || queryForm.logistics == 1)" -->
						<el-button
							type="primary"
							v-if="
								(tenantId == '1815608904948617218' || tenantId == '1925082852790239233') &&
								(queryForm.logistics == 2 || queryForm.logistics == 1) &&
								queryForm.shippingType !== 2
							"
							link
							@click="handleCommand('outBound', row)"
						>
							出库
						</el-button>
						<el-button
							v-if="
								(row.status === 1 || row.status === 2) && parseFloat(row.refundStatus) < 3 && (row.shippingType == 5 || row.shippingType == 1)
							"
							type="primary"
							link
							@click="handleCommand('sendOrder', row)"
						>
							发货
						</el-button>
						<!-- <el-button type="primary" v-if="queryForm.logistics == 2 || queryForm.logistics == 1" link @click="handleCommand('shipment', row)">
							发货
						</el-button> -->
						<!-- <el-button type="primary" link @click="handleCommand('shipment', row)"> 发货 </el-button> -->
						 <el-button type="primary" link @click="writeOffRef.show(row)" v-if="queryForm.shippingType && row.status === 3"> 核销 </el-button>
						<el-button type="primary" v-if="queryForm.logistics == 3" link @click="handleCommand('detail', row)"> 核验 </el-button>
						<!-- <el-button type="primary" link @click="handleCommand('detail', row)"> 备注 </el-button> -->
						<!-- <el-button type="primary" link @click="handleCommand('cancel', row)" v-if="row.shippingStatus == 1"> 取消 </el-button>
						<el-button type="primary" link @click="handleCommand('revamp', row)" v-if="row.shippingStatus == 1"> 修改发货地址 </el-button> -->
						<!-- <el-button
							v-if="(row.status === 1 || row.status === 2) && parseFloat(row.refundStatus) < 3 && row.shippingType == '1'"
							type="primary"
							link
							@click="handleCommand('sendOrder', row)"
						>
							发货
						</el-button> -->
						<!-- <el-button v-if="row.afterSalesIsShow" type="primary" link @click="handleCommand('afterSales', row)"> 售后 </el-button> -->
						<el-button type="primary" link @click="handleCommand('orderMark', row)"> 备注 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination
					background
					:page-sizes="[20, 40, 60, 80]"
					:page-size="queryForm.size"
					:current-page="queryForm.current"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total"
					@size-change="handleSizeChange"
					@current-change="pageChange"
				/>
			</div>
		</div>
		<!-- 批量发货 -->
		<el-dialog
			title="批量发货"
			width="600px"
			v-loading="loadingShipmentBatchSales"
			:show-close="false"
			@close="closeBatchShipment"
			v-model="shipmentBatchDialog"
		>
			<el-form ref="shipmentBatchRef" label-width="0px" @submit.native.prevent>
				<el-form-item label="" prop="contractUrls">
					<el-upload
						v-model:file-list="contractList"
						class="upload-box"
						drag
						:headers="headers"
						:action="baseURL + other.adaptationUrl('/admin/sys-file/upload')"
						:before-upload="beforeUploadContract"
						:on-exceed="handleExceed"
						:on-change="handleChange"
						:on-success="handleSuccess"
						:limit="1"
						style="width: 100%"
					>
						<!-- 			:on-progress="handleFileUploadProgress" -->
						<div class="uploader-text">
							<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
							<span>点击或拖拽文件上传</span>
						</div>
						<!-- 		uploadContrac.value = false; -->
						<template #tip>
							<div class="el-upload__tip">仅允许导入xls、xlsx格式分拣。<span>下载模板</span></div>
						</template>
					</el-upload>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeBatchShipment">取 消</el-button>
					<el-button type="primary" @click="onShipmentBatchSales(shipmentBatchRef)">确 定</el-button>
				</div>
			</template>
		</el-dialog>
		<!--详情-->
		<DetailsForm ref="orderDetailRef" :orderNo="orderNo" />

		<!-- 批量发货 -->
		<UploadExcel ref="excelUploadRef" @refreshDataList="handleSearchList"></UploadExcel>

		<!-- 发送货 -->
		<OrderSend ref="orderSendRef" :orderNo="orderNo" @submitFail="handleSearchList"></OrderSend>

		<!-- 导入 -->
		<upload-excel
			title="批量发货"
			@refreshDataList="handleSearchList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/rls/批量发货模板.xlsx'"
			url="/tracomps-admin/api/admin/platform/order/import"
			:fileType="['xlsx', 'xls']"
		/>
		<!-- 订单核销 -->
		<WriteOffForm ref="writeOffRef" @onRefresh="handleSearchList"></WriteOffForm>
	</div>
</template>

<script lang="ts" setup name="orderManage-orderList">
import other from '/@/utils/other';
import { ElNotification } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';
import type { TabsPaneContext, FormRules, FormInstance, UploadRequestOptions, UploadProps } from 'element-plus';
// import type { FormInstance, FormRules, UploadUserFile, UploadProps, UploadRequestOptions, UploadFile, UploadFiles } from 'element-plus';
// import { getAllMallPlateApi } from '/@/api/culture/merchant';
import { orderListApi, orderStatusNumApi } from '/@/api/culture/order';

import { applyAfterSaleApi, reasonApi, merchantListApi, orderMarkApi, orderOutBound, orderSendApi } from '/@/api/culture/cultureOrder';
import { showRemarkPrompt } from '/@/utils/promptUtils';

interface OrderChartType {
	all?: number;
	unPaid?: number;
	notShipped?: number;
	inStock?: number;
	spike?: number;
	receiving?: number;
	complete?: number;
	canceled?: number;
	refunded?: number;
	verification?: number;
}
interface Merchant {
	id: number | string;
	name: string;
}
const tenantId = ref(Session.getTenant());
const UploadExcel = defineAsyncComponent(() => import('./UploadExcel.vue'));
const DetailsForm = defineAsyncComponent(() => import('./components/orderDetail.vue'));
const OrderSend = defineAsyncComponent(() => import('./components/orderSend.vue'));
const WriteOffForm = defineAsyncComponent(() => import('./components/writeOff.vue'));
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);

const router = useRouter();
const excelUploadRef = ref();
const writeOffRef = ref();
const orderDetailRef = ref();
const orderSendRef = ref();
const afterSalesRef = ref();
const shipmentRef = ref();
const shipmentBatchRef = ref();
const modificationAddressRef = ref();
const contractList = ref([]) as any;
const orderRefundStatusFilter = {
	0: '未退款',
	1: '申请中',
	2: '部分退款',
	3: '已退款',
} as any;
const orderStatusFilters = {
	0: '待支付',
	1: '待发货',
	2: '部分发货',
	4: '待收货',
	5: '已收货',
	6: '已完成',
	9: '已取消',
	10: '已退款',
} as any;
// 搜索变量
const queryRef = ref();
const paymentTime = ref([]);
const orderTime = ref([]);
const plateList = ref<{ name: string; type: string | number }[]>([]);
const selectMerId = ref<Merchant[]>([]);
const reasonList = ref([]);
const orderChartType = ref<OrderChartType>({});
const listLoading = ref(false);
const loadingAfterSales = ref(false);
const loadingShipmentSales = ref(false);
const loadingShipmentBatchSales = ref(false);
const loadingModificationAddress = ref(false);
const afterSalesDialog = ref(false);
const shipmentDialog = ref(false);
const shipmentBatchDialog = ref(false);
const modificationAddressDialog = ref(false);
const checkedCities = ref(['订单编号', '商户名称', '用户昵称', '实际支付', '支付方式', '订单状态', '发货状态', '下单时间']);
const selectionList = ref([]);
const isEditChangeFileList = ref(false);
const orderNo = ref('');
const fromType = ref([
	{ value: '0', text: '普通' },
	{ value: '1', text: '视频号' },
	{ value: '2', text: '秒杀' },
]);
const tableData = ref({
	data: [],
	total: 0,
});
const isMerchant = computed(() => {
	return import.meta.env.VITE_IS_MERCHANT;
});
const queryForm = ref({
	status: 'all' as any,
	dateLimit: '',
	orderNo: '',
	current: 1,
	size: 20,
	merId: null,
	type: '',
	orderBy: 1,
	paymentTimeStart: '',
	paymentTimeEnd: '',
	createTimeEnd: '',
	createTimeStart: '',
	mobile: '',
	isStaff: '',
	goodsType: '',
	shippingType: 1,
	logistics: 1 as any,
	userPhone: '',
	nickname: '',
});
const afterForm = ref({
	refundReasonWap: '',
	refundReasonWapExplain: '',
});

const modificationAddressForm = ref({
	address: '',
	addressDetail: '',
	deliveryName: '',
	deliveryPhone: '',
});

const afterRules = reactive<FormRules<any>>({
	refundReasonWap: [{ required: true, message: '选择售后类型', trigger: ['blur', 'change'] }],
	refundReasonWapExplain: [{ required: true, message: '输入原因说明', trigger: ['blur', 'change'] }],
});
const modificationAddressRules = reactive<FormRules<any>>({
	refundReasonWap: [{ required: true, message: '输入收货人', trigger: ['blur', 'change'] }],
	// refundReasonWap: [{ required: true, message: '输入收货电话', trigger: ['blur', 'change'] }],
	refundReasonWapExplain: [{ required: true, message: '输入收货地址', trigger: ['blur', 'change'] }],
});
const state: BasicTableProps = reactive<BasicTableProps>({});
//  table hook
const { tableStyle, downBlobFile } = useTable(state);

onMounted(() => {
	!isMerchant.value && getMerIDList();
	getOrderStatusNum();
	getReason();
	getList();
});

const pageChange = (page: number) => {
	queryForm.value.current = page;
	getList();
};
const handleSizeChange = (val: number) => {
	queryForm.value.size = val;
	getList();
};

const handleSearchList = () => {
	queryForm.value.current = 1;
	getList();
	getOrderStatusNum();
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
	queryForm.value.status = tab?.paneName;
	queryForm.value.current = 1;
	getList();
	getOrderStatusNum();
};
const handleClickTabs = (tab: TabsPaneContext, event: Event) => {
	queryForm.value.shippingType = tab?.paneName;
	queryForm.value.status = 'all';
	queryForm.value.current = 1;
	getList();
	getOrderStatusNum();
};
const handleSelectionChange = (val: any) => {
	selectionList.value = val;
	console.log('selectionList', selectionList.value);
};

const closeModificationAddress = () => {
	modificationAddressRef.value.resetFields();
	modificationAddressDialog.value = false;
};

// 点击批量发货
const shipmentBatch = () => {
	shipmentBatchDialog.value = true;
}; // 关闭批量发货弹窗
const closeBatchShipment = () => {
	contractList.value = [];
	shipmentBatchDialog.value = false;
	shipmentBatchRef.value.resetFields();
};
// 确定批量发货
const onShipmentBatchSales = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			(async () => {
				try {
					loadingShipmentBatchSales.value = true;
					// const params = {
					// 	orderNo: orderNo.value,
					// 	...shipmentForm.value,
					// };
					// console.log('params', params);
					// const { code, msg } = await applyAfterSaleApi(params);
					// if (code === 0) {
					// 	useMessage().success(`申请售后成功`);
					// 	closeAfter();
					// 	handleSearchList();
					// } else {
					// 	useMessage().error(msg);
					// }
				} catch (err: any) {
					useMessage().error(err.msg);
				} finally {
					loadingShipmentBatchSales.value = false;
				}
			})();
		}
	});
};
// 确定发起售后
const onAfterSales = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			(async () => {
				try {
					loadingAfterSales.value = true;
					const params = {
						orderNo: orderNo.value,
						...afterForm.value,
					};
					const { code, msg } = await applyAfterSaleApi(params);
					if (code === 0) {
						useMessage().success(`申请售后成功`);
						closeAfter();
						handleSearchList();
					} else {
						useMessage().error(msg);
					}
				} catch (err: any) {
					useMessage().error(err.msg);
				} finally {
					loadingAfterSales.value = false;
				}
			})();
		}
	});
};
// 修改收货地址
const onModificationAddress = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			(async () => {
				// try {
				// 	loadingAfterSales.value = true;
				// 	const params = {
				// 		orderNo: orderNo.value,
				// 		...afterForm.value,
				// 	};
				// 	const { code, msg } = await applyAfterSaleApi(params);
				// 	if (code === 0) {
				// 		useMessage().success(`申请售后成功`);
				// 		closeModificationAddress();
				// 		handleSearchList();
				// 	} else {
				// 		useMessage().error(msg);
				// 	}
				// } catch (err: any) {
				// 	useMessage().error(err.msg);
				// } finally {
				// 	modificationAddressDialog.value = false;
				// }
			})();
		}
	});
};
const handleReset = () => {
	queryForm.value.dateLimit = '';
	queryForm.value.orderNo = '';
	queryForm.value.merId = null;
	queryForm.value.type = '';
	queryForm.value.paymentTimeStart = '';
	queryForm.value.paymentTimeEnd = '';
	queryForm.value.createTimeStart = '';
	queryForm.value.createTimeEnd = '';
	queryForm.value.mobile = '';
	queryForm.value.isStaff = '';
	queryForm.value.shippingType = '';
	paymentTime.value = [];
	orderTime.value = [];
	handleSearchList();
};
const getMerIDList = () => {
	const data = {
		current: 1,
		size: 1000,
	};
	merchantListApi(data).then((res) => {
		selectMerId.value = res.data.records;
	});
};

const getOrderStatusNum = () => {
	const { status, ...data } = queryForm.value;
	orderStatusNumApi(data).then((res: any) => {
		orderChartType.value = res.data;
	});
};
const getReason = () => {
	reasonApi().then((res) => {
		console.log('售后', res);
		reasonList.value = res.data;
	});
};

// 列表
const getList = () => {
	listLoading.value = true;
	const obj = {
		all: '',
		unPaid: 0, // 未支付
		notShipped: 1, // 待备货
		inStock: 2, // 备货中
		spike: 4, // 待收货
		receiving: 5, // 已收货
		awaitVerification: 3, // 待核销
		complete: 6, // 已完成
		canceled: 9, // 已取消
		refunded: 10, // 已退款
		deleted: -1, // 已删除
	};

	console.log('queryForm.value', queryForm.value);
	const statusKey = queryForm.value.status as keyof typeof obj;
	const params = {
		...queryForm.value,
		status: obj[statusKey],
	};
	console.log('params', params);
	orderListApi(params)
		.then((res: any) => {
			tableData.value.data = res.data.records;
			tableData.value.total = res.data.total;
			listLoading.value = false;
			const storedValue = localStorage.getItem('order_stroge');
			checkedCities.value = storedValue ? JSON.parse(storedValue) : checkedCities.value;
		})
		.catch(() => {
			listLoading.value = false;
		});
};

watch(
	() => orderTime.value,
	(val) => {
		if (val) {
			queryForm.value.createTimeStart = val[0];
			queryForm.value.createTimeEnd = val[1];
		} else {
			queryForm.value.createTimeStart = '';
			queryForm.value.createTimeEnd = '';
		}
	}
);

watch(
	() => paymentTime.value,
	(val) => {
		if (val) {
			queryForm.value.paymentTimeStart = val[0];
			queryForm.value.paymentTimeEnd = val[1];
		} else {
			queryForm.value.paymentTimeStart = '';
			queryForm.value.paymentTimeEnd = '';
		}
	}
);
const changeOrderTime = (val: any) => {
	if (!val) {
		queryForm.value.createTimeStart = '';
		queryForm.value.createTimeEnd = '';
	}
	handleSearchList();
};
const changePaymentTime = (val: any) => {
	if (!val) {
		queryForm.value.paymentTimeStart = '';
		queryForm.value.paymentTimeEnd = '';
	}
	handleSearchList();
};

// 点击批量出库
const outBoundAll = () => {
	useMessageBox()
		.confirm('请确认是否批量出库', '批量出库')
		.then(() => {
			orderOutBound({ orderCodes: selectionList.value })
				.then(() => {
					useMessage().success('操作成功');
					getList();
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		})
		.catch(() => {});
};

// 关闭发货弹窗
const closeShipment = () => {
	shipmentDialog.value = false;
	shipmentRef.value.resetFields();
};

// 关闭售后弹窗
const closeAfter = () => {
	afterSalesDialog.value = false;
	afterSalesRef.value.resetFields();
};
const outCancelAll = () => {
	useMessageBox()
		.confirm('请确认是否批量取消', '批量取消')
		.then(() => {
			// orderOutBound({ orderCodes: selectionList.value })
			// 	.then(() => {
			// 		useMessage().success('操作成功');
			// 		getList();
			// 	})
			// 	.catch((err) => {
			// 		useMessage().error(err.msg);
			// 	});
		})
		.catch(() => {});
};
// 导出
const exports = async () => {
	const obj = {
		all: '',
		unPaid: 0, // 未支付
		notShipped: 1, // 待备货
		inStock: 2, // 备货中
		spike: 4, // 待收货
		receiving: 5, // 已收货
		awaitVerification: 3, // 待核销
		complete: 6, // 已完成
		canceled: 9, // 已取消
		4: 9, // 已取消
		refunded: 10, // 已退款
		deleted: -1, // 已删除
	};
	type OrderStatusKey = keyof typeof obj;
	const statusKey = queryForm.value.status as OrderStatusKey;
	let data = {
		...queryForm.value,
		orderStatus: obj[statusKey],
		payTimeStart: queryForm.value.paymentTimeStart ? queryForm.value.paymentTimeStart + ' 00:00:00' : null,
		payTimeEnd: queryForm.value.paymentTimeEnd ? queryForm.value.paymentTimeEnd + ' 23:59:59' : null,
		createTimeStart: queryForm.value.createTimeStart ? queryForm.value.createTimeStart + ' 00:00:00' : null,
		createTimeEnd: queryForm.value.createTimeEnd ? queryForm.value.createTimeEnd + ' 23:59:59' : null,
	};
	const requestUrl = isMerchant.value
		? 'tracomps-admin/api/admin/merchant/export/ownMallExport'
		: '/tracomps-admin/api/admin/platform/export/ownMallExport';
	downBlobFile(requestUrl, Object.assign(data), '订单列表.xlsx');
};

const handleCommand = (command: Table.Command, row: any) => {
	orderNo.value = row.orderNo;
	switch (command) {
		case 'detail':
			const detailRef = orderDetailRef.value;
			if (detailRef) {
				detailRef.getDetail(row.orderNo);
				detailRef.getOrderInvoiceList(row.orderNo);
				detailRef.dialogVisible = true;
			}
			break;
		case 'sendOrder':
			const sendRef = orderSendRef.value;
			if (sendRef) {
				sendRef.getList();
				sendRef.orderProDetail(row.orderNo, row.merId);
				sendRef.modals = true;
			}
			break;
		case 'orderMark':
			showRemarkPrompt().then((res) => {
				orderMarkApi({ remark: res, orderNo: orderNo.value }).then(() => {
					useMessage().success('操作成功');
					getList();
				});
			});
			break;
		case 'cancel':
			useMessageBox()
				.confirm('请确认是否取消当前订单', '取消订单')
				.then(() => {
					// orderOutBound({ orderCodes: selectionList.value })
					// 	.then(() => {
					// 		useMessage().success('操作成功');
					// 		getList();
					// 	})
					// 	.catch((err) => {
					// 		useMessage().error(err.msg);
					// 	});
				})
				.catch(() => {});
			// afterSalesDialog.value = true;
			break;
		case 'revamp':
			modificationAddressDialog.value = true;
			break;
		// 出库
		case 'outBound':
			useMessageBox()
				.confirm('请确认是否出库当前订单', '出库订单')
				.then(() => {
					orderOutBound({ orderCodes: [row.orderNo] })
						.then(() => {
							useMessage().success('操作成功');
							getList();
						})
						.catch((err) => {
							useMessage().error(err.msg);
						});
				})
				.catch(() => {});
			// modificationAddressDialog.value = true;
			break;
			'';
	}
};

// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});
const handleChange: UploadProps['onChange'] = () => {
	// if (type.value === 'edit') isEditChangeFileList.value = true;
};
const handleSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '文件上传成功！',
		type: 'success',
	});
};
const beforeUploadContract: UploadProps['beforeUpload'] = (file) => {
	console.log('beforeUpload', file);
	// xls、xlsx格式
	const fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
	const imgSize = file.size / 1024 / 1024 < 50;
	const imgType = fileType.includes(file.type);
	if (!imgType) {
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: '上传文件不符合所需的格式！',
				type: 'warning',
			});
		}, 0);
	}
	if (!imgSize) {
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 50M！`,
				type: 'warning',
			});
		}, 0);
	}
	return imgType && imgSize;
};
const handleExceed: UploadProps['onExceed'] = (uploadFile) => {
	console.log('uploadFile', uploadFile);
	useMessage().error('上传附件最多1个文件！');
};
</script>
<style lang="scss" scoped>
.selWidth {
	width: 260px !important;
}
.colorPrompt {
	color: #f56464;
}
.notStartTag {
	color: #f56464;
	border: 1px solid #f56464;
}
.tag-background {
	border-radius: 2px !important;
	background-color: #fff !important;
	padding: 2px 6px;
}
.doingTag {
	color: #ff7d00 !important;
	border: 1px solid #ff7d00 !important;
}
.endTag {
	color: #666666 !important;
	border: 1px solid #cccccc !important;
}
.acea-row {
	display: flex;
	flex-wrap: wrap;
	.format_color {
		color: #4785ea;
	}
}
.text_left {
	text-align: left;
	display: block;
}
</style>
