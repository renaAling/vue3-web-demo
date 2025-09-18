<template>
	<div>
		<!-- <el-card class="header">
			<div>
				<span @click="route.back()"
					><el-icon><ArrowLeft /></el-icon>返回</span
				>
				<el-divider direction="vertical"></el-divider>
				<span class="headerTitle">添加商品</span>
			</div>
		</el-card> -->

		<div class="header">
			<el-card>
				<el-tabs v-model="activeName" class="demo-tabs">
					<el-tab-pane label="商品信息" :name="0"></el-tab-pane>
					<el-tab-pane label="规格库存" :name="1"></el-tab-pane>
					<el-tab-pane label="商品详情" :name="2"></el-tab-pane>
					<el-tab-pane label="其他设置" :name="3"></el-tab-pane>
				</el-tabs>
			</el-card>
			<div class="body">
				<el-form
					v-loading="loadingFrom"
					ref="ruleFormRef"
					:model="dataForm"
					label-width="160px"
					:rules="rules"
					style="width: 80%; margin: 0 auto"
					label-position="top"
					@submit.prevent
				>
					<div v-show="activeName == 0">
						<el-card>
							<div class="card-form">
								<div class="card-title">基础信息</div>
								<el-form-item label="全境商品ID" prop="spuId" v-if="tenantId == '1963773220574330882'">
									<div class="flex" style="width: 100%">
										<el-input
											:disabled="dataForm.id"
											v-model.trim="dataForm.spuId"
											maxlength="249"
											placeholder="请输入全境商品ID"
											@blur="getSpuInfo(dataForm)"
											:popper-append-to-body="false"
										/>
										<el-button v-if="tenantId == '1963773220574330882' && !dataForm.id" class="ml-5" type="primary" @click="getSpuInfo(dataForm)"
											>查询</el-button
										>
									</div>
								</el-form-item>
								<el-form-item label="全境商品名称" prop="spuName" v-if="tenantId == '1963773220574330882' && dataForm.spuName">
									<div class="flex" style="width: 100%">
										<el-input
											v-model.trim="dataForm.spuName"
											maxlength="249"
											placeholder="请输入全境商品ID"
											:popper-append-to-body="false"
											disabled
										/>
									</div>
								</el-form-item>
								<el-form-item label="所属商城" prop="goodsType">
									<!-- {{ goodsTypeName }} -->
									<el-select v-model="tenantId" placeholder="请选择所属商城" disabled="true">
										<el-option :label="item.label" :value="item.value" v-for="item in goodsTypeOption" :key="'goodsType' + item.value" />
									</el-select>
								</el-form-item>
								<el-form-item label="所属运营机构" prop="businessCode">
									<el-select v-model="dataForm.businessCode" placeholder="请选择所属运营机构" :disabled="isDisabled">
										<el-option :label="item.label" :value="item.value" v-for="item in merchantOption" :key="'businessCode' + item.value" />
									</el-select>
								</el-form-item>
								<el-form-item label="商品名称" prop="name">
									<el-input
										v-model.trim="dataForm.name"
										maxlength="249"
										placeholder="请输入商品名称"
										:popper-append-to-body="false"
										:disabled="isDisabled"
									/>
								</el-form-item>
								<el-form-item label="商品分类" prop="categoryId">
									<el-cascader
										class="from-ipt-width"
										popper-class="custom-popper"
										v-model="dataForm.categoryId"
										:options="productClassify"
										:append-to-body="false"
										:props="categoryProps"
										filterable
										clearable
										:show-all-levels="false"
										:disabled="isDisabled"
										placeholder="请选择商品分类"
										style="width: 100%"
									/>
								</el-form-item>
								<el-form-item label="所属供应商" prop="merId" v-if="isMerchant != 'true'">
									<merchantName
										ref="merchantNameRef"
										@getMerId="getMerId"
										:merIdChecked="dataForm.merId"
										:platId="dataForm.goodsType"
										:disabled="isDisabled"
										style="width: 100%"
									/>
								</el-form-item>
							</div>
						</el-card>
						<el-card style="margin-top: 20px">
							<div class="card-form">
								<div class="card-title">商品属性</div>
								<el-form-item label="可见对象" prop="identityTypeList">
									<el-checkbox-group v-model="dataForm.identityTypeList" :disabled="isDisabled">
										<el-checkbox :value="item.value" v-for="item in visibleObject" :key="'visible' + item.value">{{ item.label }}</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="物流方式" prop="shippingTypeList" v-if="productType == '0' && tenantId != '1963773220574330882'">
									<el-checkbox-group
										v-model="dataForm.shippingTypeList"
										:disabled="
											isDisabled ||
											tenantId == '1922165158034145281' ||
											tenantId == '1922166211546841089' ||
											tenantId == '1963773220574330882'
										"
									>
										<el-checkbox :value="item.value" v-for="item in logisticsObject" :disabled="item.disabled" :key="'logistics' + item.value">{{
											item.label
										}}</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item
									label="运费模板"
									prop="tempId"
									v-if="productType == '0' && tenantId != '1922165158034145281' && tenantId != '1963773220574330882'"
								>
									<el-select v-model="dataForm.tempId" placeholder="请选择运费模板" :disabled="isDisabled" clearable>
										<el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in shippingTemplatesOption" />
									</el-select>
								</el-form-item>
								<el-form-item label="商品标签" prop="tagName">
									<el-input v-model="dataForm.tagName" placeholder="请输入商品标签，多个标签用逗号分隔" :disabled="isDisabled" />
									<div class="from-tips">用于商品标签展示，最多可输入5个关键字</div>
								</el-form-item>
								<el-form-item label="商品关键字" prop="keywords">
									<el-input v-model="dataForm.keywords" placeholder="请输入商品关键字，多个关键字用逗号分隔" :disabled="isDisabled" />
									<div class="from-tips">用于商品搜索，最多可输入10个关键字</div>
								</el-form-item>
								<el-form-item label="商品简介" prop="intro">
									<el-input
										class="from-ipt-width"
										v-model.trim="dataForm.intro"
										type="textarea"
										maxlength="250"
										:rows="3"
										placeholder="请输入商品简介"
										:disabled="isDisabled"
										style="width: 100%"
									/>
								</el-form-item>
								<div class="from-tips">通过公众号分享商品详情，会展示此简介信息</div>
							</div>
						</el-card>
						<el-card style="margin-top: 20px">
							<div class="card-form">
								<div class="card-title" style="align-items: center; justify-content: space-between; display: flex; width: 100%">
									<span>图片视频</span>
									<el-button class="ml-5" link v-if="tenantId == '1963773220574330882' && dataForm.id" @click="getSpuBySpuId" type="primary">
										同步三方商品图片详情
									</el-button>
								</div>
								<el-form-item label="商品封面图" prop="image">
									<div>
										<upload-img v-model:image-url="dataForm.image" :fileType="['image/jpeg', 'image/jpg', 'image/png']" :disabled="isDisabled" />
										<div class="from-tips">建议尺寸：800*800像素，支持JPG、PNG格式</div>
									</div>
								</el-form-item>
								<el-form-item label="商品轮播图：" prop="sliderImages">
									<div>
										<div class="upload-item" style="display: flex; align-items: center; width: 100%; flex-wrap: wrap">
											<upload-img
												v-for="(item, index) in dataForm.sliderImages"
												:key="index"
												v-model:imageUrl="dataForm.sliderImages[index]"
												dir="culture"
												:fileType="['image/jpeg', 'image/jpg', 'image/png']"
												:disabled="isDisabled"
												style="margin-right: 5px"
											>
											</upload-img>
											<el-button v-if="!disabledBannerUpload && !isDisabled" @click="handleCreateUploadComponent" type="primary">
												添加上传图片
											</el-button>
										</div>
										<div class="from-tips">最多上传5张，建议尺寸：800*800像素，支持JPG、PNG格式</div>
									</div>
								</el-form-item>
								<el-form-item label="保障服务：" prop="guaranteeIdsList">
									<el-select
										class="from-ipt-width"
										popper-class="custom-popper"
										v-model="dataForm.guaranteeIdsList"
										placeholder="请选择保障服务"
										clearable
										filterable
										:multiple="true"
										:disabled="isDisabled"
										@change="changeGuarantee"
										:popper-append-to-body="false"
										style="width: 100%"
									>
										<el-option :value="item.id" v-for="(item, index) in guaranteeList" :key="index" :label="item.name"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="主图视频：" prop="video_link">
									<div class="acea-row" style="width: 100%">
										<el-upload
											class="upload-demo"
											:action="baseURL + other.adaptationUrl('/admin/sys-file/upload')"
											:http-request="handleUploadForm"
											:on-success="handleSuccess"
											:on-error="handleError"
											:on-exceed="handleExceed"
											:on-progress="handleProgress"
											:before-upload="beforeAvatarUpload"
											:headers="headers"
											:show-file-list="false"
											:disabled="isDisabled"
											multiple
											style="width: 100%"
										>
											<el-input
												v-model="videoLink"
												:disabled="isDisabled"
												class="from-ipt-width"
												placeholder="请输入MP4格式的视频链接"
												style="width: 100%"
											>
												<template #append>
													<el-button :disabled="isDisabled"> {{ videoLink ? '确认添加' : '上传视频' }}</el-button>
												</template>
											</el-input>

											<template #tip> <div class="from-tips">请上传小于20M的视频</div></template>
										</el-upload>
										<!-- </el-input> -->

										<div v-if="videoLink" class="iview-video-style">
											<video class="from-ipt-width" style="height: 100% !important; border-radius: 10px" :src="videoLink" controls="controls">
												您的浏览器不支持 video 标签。
											</video>
											<div class="mark" />
											<i class="el-icon-delete iconv" @click="delVideo" />
										</div>
									</div>
								</el-form-item>
							</div>
						</el-card>
					</div>
					<div v-show="activeName == 1">
						<el-card>
							<el-form-item label="商品规格" prop="specType">
								<el-radio-group
									v-model="dataForm.specType"
									@change="onChangeSpec(dataForm.specType)"
									:disabled="isDisabled || tenantId == '1963773220574330882'"
								>
									<el-radio :value="false">单规格</el-radio>
									<el-radio :value="true">多规格</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="员工优惠：" prop="isPaidMember">
								<el-radio-group v-model="dataForm.isPaidMember" :disabled="isDisabled">
									<el-radio :value="true">是</el-radio>
									<el-radio :value="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<div v-if="tenantId == '1963773220574330882' && dataForm.spuId">请输入全境商品ID</div>
							<!-- <el-form-item v-if="tenantId == '1922177185280557058'" label="积分商品：" prop="isPaidScore">
								<el-radio-group v-model="dataForm.isPaidScore" :disabled="isDisabled">
									<el-radio :value="true">是</el-radio>
									<el-radio :value="false">否</el-radio>
								</el-radio-group>
							</el-form-item> -->
							<!-- 多规格添加-->
							<el-col v-if="dataForm.specType && !isDisabled" :span="24" class="noForm">
								<el-form-item v-if="dataForm.attr?.length">
									<div>
										<div class="from-tips">规格值支持拖拽排序,调整默认选中的规格</div>
										<div v-for="(item, index) in dataForm.attr" :key="index">
											<div class="acea-row row-middle">
												<span class="mr5">{{ item.attrName }}</span
												><i class="el-icon-circle-close" @click="handleRemoveAttr(index)" />
											</div>
											<div class="acea-row row-middle">
												<div
													v-for="(j, indexn) in item.attrValue"
													:key="indexn"
													draggable="true"
													@dragstart="handleDragStart($event, j)"
													@dragover.prevent="handleDragOver($event, j)"
													@dragenter="handleDragEnter($event, j, index)"
													@dragend="handleDragEnd($event, j)"
												>
													<el-tag
														v-if="tenantId !== '1963773220574330882'"
														closable
														size="medium"
														:disable-transitions="false"
														class="mb5 mr10 pointer"
														@close="handleClose(item.attrValue, indexn)"
													>
														{{ j }}
													</el-tag>
													<el-tag v-if="tenantId == '1963773220574330882'" size="medium" :disable-transitions="false" class="mb5 mr10 pointer">
														{{ j }}
													</el-tag>
												</div>
												<!-- v-if="tenantId !== '1963773220574330882'" -->
												<el-input
													v-if="item.inputVisible && tenantId !== '1963773220574330882'"
													ref="saveTagInput"
													placeholder="按回车键添加"
													v-model.trim="item.attrValue.attrsVal"
													class="input-new-tag"
													size="small"
													@keyup.enter.native="createAttr(item.attrValue.attrsVal, index)"
												/>
												<el-button
													v-if="!item.inputVisible && tenantId !== '1963773220574330882'"
													class="button-new-tag"
													size="small"
													@click="showInput(item)"
													>+ 添加</el-button
												>
											</div>
										</div>
									</div>
								</el-form-item>
								<div class="acea-row">
									<!-- label-position -->
									<el-form
										v-model="formDynamic"
										label-width="auto"
										label-position="left"
										:inline="true"
										@submit.prevent
										v-if="tenantId != '1963773220574330882'"
									>
										<el-form-item label="规格：">
											<el-input
												v-model.trim="formDynamic.attrsName"
												placeholder="请输入规格"
												style="width: 255px"
												class="mr-5"
												:disabled="isDisabled"
											/>
										</el-form-item>
										<el-form-item label="规格值：" label-width="90px">
											<el-input
												v-model.trim="formDynamic.attrsVal"
												placeholder="请输入规格值"
												style="width: 254px"
												class="mr-5"
												:disabled="isDisabled"
											/>
										</el-form-item>
										<el-form-item label-width="0px">
											<el-button class="ml20" size="small" type="primary" @click="createAttrName">确定</el-button>
											<el-button size="small" @click="offAttrName">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</el-col>
							<!-- 批量设置-->
							<el-col
								v-if="dataForm.attr?.length > 0 && dataForm.specType && !isDisabled && tenantId !== '1963773220574330882'"
								:span="24"
								class="noForm"
							>
								<el-form-item label="批量设置：">
									<el-alert title="价格设置范围 0.01~999999.99" type="info"> </el-alert>
									<el-table :data="oneFormBatch" border class="tabNumWidth" size="small">
										<el-table-column label="图片" width="80" align="center">
											<template #default="{ row }">
												<div class="upLoadPicBox" @click="modalPicTap('1', 'pi')">
													<div class="pictrue tabPic">
														<upload-img
															v-model:imageUrl="row.image"
															dir="culture"
															:fileType="['image/jpeg', 'image/jpg', 'image/png']"
															height="60px"
															width="60px"
															borderRadius="4px"
															:disabled="isDisabled"
														>
														</upload-img>
													</div>
												</div>
											</template>
										</el-table-column>
										<template v-if="dataForm.isPaidScore && tenantId != '1922177185280557058'">
											<el-table-column label="支付现金" min-width="120" align="center">
												<template #default="{ row }">
													<el-input-number
														maxlength="6"
														style="width: 100%"
														:disabled="isDisabled"
														v-model.trim="row.price"
														:precision="2"
														:min="0"
													/>
												</template>
											</el-table-column>
											<el-table-column label="使用积分数" min-width="120" align="center">
												<template #default="{ row }">
													<el-input-number
														maxlength="6"
														style="width: 100%"
														:disabled="isDisabled"
														v-model.trim="row.scorePrice"
														:precision="0"
														:min="0"
													/>
													<!-- <span style="color: red">等于{{ row.scorePrice ? (row.scorePrice / 100).toFixed(2) : 0.0 }}元</span> -->
												</template>
											</el-table-column>
										</template>
										<el-table-column label="进价" min-width="120" align="center">
											<template #default="{ row }">
												<el-input-number maxlength="6" style="width: 100%" :disabled="isDisabled" v-model.trim="row.cost" :precision="2" :min="0" />
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId == '1922177185280557058'" label="支付积分" min-width="120" align="center">
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.scorePrice"
													:precision="0"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column
											v-if="tenantId == '1922177185280557058' && dataForm.isPaidMember"
											label="内购积分"
											min-width="120"
											align="center"
										>
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.vipScorePrice"
													:precision="0"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId !== '1922177185280557058'" label="原价" min-width="120" align="center">
											<template #default="{ row }">
												<div v-if="dataForm.isPaidScore">
													{{ calculatePrice(row.price, row.scorePrice) }}
												</div>
												<el-input-number
													v-else
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.price"
													:precision="2"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column
											v-if="dataForm.isPaidMember && tenantId != '1922177185280557058'"
											label="内购金额(元)"
											min-width="120"
											align="center"
										>
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.vipPrice"
													:precision="2"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column v-for="(item, iii) in attrValue" :key="iii" :label="formThead[iii].title" min-width="120" align="center">
											<template #default="{ row }">
												<el-input
													v-if="iii === 'id'"
													v-model="row[iii]"
													maxlength="40"
													type="test"
													class="priceBox"
													:readonly="true"
													:disabled="true"
												/>
												<el-input-number
													v-else
													v-model.trim="row[iii]"
													:max="999999.99"
													:step="iii === 'stock' ? 1 : 0.01"
													controls-position="right"
													step-strictly
													:disabled="isDisabled"
												></el-input-number>
											</template>
										</el-table-column>
										<el-table-column label="操作" width="70" align="center">
											<template #default>
												<el-button link type="primary" size="small" :disabled="isDisabled" @click="batchAdd">批量添加</el-button>
											</template>
										</el-table-column>
									</el-table>
								</el-form-item>
							</el-col>
							<!-- 单规格表格-->
							<el-form-item v-if="!dataForm.specType">
								<el-alert title="价格设置范围 0.01~999999.99" type="info"> </el-alert>
								<el-table :key="tableKey" :data="OneAttrValue" border class="tabNumWidth" size="small">
									<el-table-column label="图片" width="77" align="center">
										<template #default="{ row }">
											<div class="upLoadPicBox" @click="modalPicTap('1', 'dan', 'pi')">
												<div class="pictrue tabPic">
													<upload-img
														v-model:imageUrl="row.image"
														dir="culture"
														:fileType="['image/jpeg', 'image/jpg', 'image/png']"
														height="60px"
														width="60px"
														borderRadius="4px"
														:disabled="isDisabled"
													>
													</upload-img>
												</div>
											</div>
										</template>
									</el-table-column>
									<template v-if="dataForm.isPaidScore && tenantId != '1922177185280557058'">
										<el-table-column label="支付现金" min-width="120" align="center">
											<template #default="{ row }">
												<el-input-number maxlength="6" style="width: 100%" :disabled="isDisabled" v-model.trim="row.price" :precision="2" :min="0" />
											</template>
										</el-table-column>
										<el-table-column label="使用积分数" min-width="120" align="center">
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.scorePrice"
													:precision="0"
													:min="0"
												/>
												<!-- <span style="color: red">等于{{ row.scorePrice ? (row.scorePrice / 100).toFixed(2) : 0.0 }}元</span> -->
											</template>
										</el-table-column>
									</template>
									<el-table-column label="进价" min-width="120" align="center">
										<template #default="{ row }">
											<el-input-number maxlength="6" style="width: 100%" :disabled="isDisabled" v-model.trim="row.cost" :precision="2" :min="0" />
										</template>
									</el-table-column>
									<el-table-column v-if="tenantId == '1922177185280557058'" label="支付积分" min-width="120" align="center">
										<template #default="{ row }">
											<el-input-number
												maxlength="6"
												style="width: 100%"
												:disabled="isDisabled"
												v-model.trim="row.scorePrice"
												:precision="0"
												:min="0"
											/>
										</template>
									</el-table-column>
									<el-table-column v-if="tenantId == '1922177185280557058' && dataForm.isPaidMember" label="内购积分" min-width="120" align="center">
										<template #default="{ row }">
											<el-input-number
												maxlength="6"
												style="width: 100%"
												:disabled="isDisabled"
												v-model.trim="row.vipScorePrice"
												:precision="0"
												:min="0"
											/>
										</template>
									</el-table-column>
									<el-table-column v-if="tenantId !== '1922177185280557058'" label="原价" min-width="120" align="center">
										<template #default="{ row }">
											<div v-if="dataForm.isPaidScore">
												{{ calculatePrice(row.price, row.scorePrice) }}
											</div>
											<el-input-number
												v-else
												maxlength="6"
												style="width: 100%"
												:disabled="isDisabled"
												v-model.trim="row.price"
												:precision="2"
												:min="0"
											/>
										</template>
									</el-table-column>
									<el-table-column
										v-if="dataForm.isPaidMember && tenantId != '1922177185280557058'"
										label="内购金额(元)"
										min-width="120"
										align="center"
									>
										<template #default="{ row }">
											<el-input-number maxlength="6" style="width: 100%" :disabled="isDisabled" v-model.trim="row.vipPrice" :precision="2" :min="0" />
										</template>
									</el-table-column>
									<el-table-column v-for="(item, iii) in attrValue" :key="'att' + iii" :label="formThead[iii].title" min-width="120" align="center">
										<template #default="{ row }">
											<el-input
												v-if="iii === 'id'"
												:disabled="true"
												v-model="row[iii]"
												maxlength="40"
												type="test"
												class="priceBox"
												:readonly="true"
											/>
											<el-input-number
												v-else
												v-model.trim="row[iii]"
												:disabled="isDisabled"
												:min="iii === 'stock' ? 0 : 0.01"
												:max="dataForm.isPaidMember && iii === 'vipPrice' ? Number(row.price) : 999999.99"
												:step="iii === 'stock' ? 1 : 0.01"
												step-strictly
											></el-input-number>
										</template>
									</el-table-column>
									<template v-if="dataForm.type == 5">
										<el-table-column label="云盘设置" min-width="120" align="center">
											<template #default="{ row }">
												<el-button v-if="!row.expand" size="small" @click="handleAddVirtually(0, 'OneAttrValue', 1)" :disabled="isDisabled"
													>添加链接</el-button
												>
												<el-button
													v-else
													class="seeCatMy pointer"
													type="text"
													size="small"
													@click="seeVirtually(OneAttrValue[0], 'OneAttrValue', 0, 1)"
													:disabled="isDisabled"
													>已设置</el-button
												>
											</template>
										</el-table-column>
									</template>
									<template v-if="dataForm.type == 6">
										<el-table-column label="卡密设置(必填)" min-width="120" align="center">
											<template #default="{ row, $index }">
												<el-button v-if="!row.cdkeyId" size="small" @click="handleAddVirtually(0, 'OneAttrValue', 2)" :disabled="isDisabled"
													>添加卡密</el-button
												>
												<el-button
													v-else
													type="text"
													class="seeCatMy pointer"
													@click="seeVirtually(OneAttrValue[0], 'OneAttrValue', 0, 2)"
													:disabled="isDisabled"
													>{{ row.cdkeyLibraryName }}</el-button
												>
											</template>
										</el-table-column>
									</template>

									<template v-if="dataForm.type == 9">
										<el-table-column label="选择藏品" min-width="120" align="center">
											<template #default="{ row, $index }">
												<el-button size="small" @click="chooseDigitizeCollection(row, $index)" :disabled="isDisabled">选择藏品</el-button>
												<p v-if="row.bindCollection && row.bindCollection.name">
													{{ row.bindCollection.name }}
													(
													<span v-if="row.bindCollection.limitType">长期</span>
													<span v-if="!row.bindCollection.limitType"> {{ row.bindCollection.limitDay }}天 </span>
													)
												</p>
											</template>
										</el-table-column>
									</template>
									<template v-if="dataForm.type == 11 && tenantId == '1922177185280557058'">
										<el-table-column label="关联优惠券(必填)" min-width="200" align="center">
											<template #default="{ row, $index }">
												<el-select
													v-model="row.couponOriginal"
													class="mr-2"
													placeholder="请选择优惠券来源"
													style="width: 100px"
													@change="onCouponOriginalChange($index, 'OneAttrValue')"
												>
													<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
												<el-button
													v-if="!row.couponId && row.couponOriginal == 1"
													@click="handleAddVirtually($index, 'OneAttrValue', 3)"
													:disabled="isDisabled"
													>添加优惠券</el-button
												>
												<el-button
													v-if="!row.couponId && row.couponOriginal == 2"
													@click="handleAddVirtually($index, 'OneAttrValue', 4)"
													:disabled="isDisabled"
													>添加优惠券</el-button
												>
												<el-button
													v-if="row.couponOriginal == 1 && row.couponId"
													type="text"
													class="seeCatMy pointer"
													@click="handleAddVirtually($index, 'OneAttrValue', 3)"
													:disabled="isDisabled"
													>{{ row.couponName }}</el-button
												>
												<el-button
													v-if="row.couponId && row.couponOriginal == 2"
													type="text"
													class="seeCatMy pointer"
													@click="handleAddVirtually($index, 'OneAttrValue', 4, row.couponId)"
													:disabled="isDisabled"
													>{{ row.couponId }}</el-button
												>
												<!-- <span v-if="row.couponId && row.couponOriginal == 2" @click="handleAddVirtually($index, 'OneAttrValue', 4, row.couponId)">{{
													row.couponName
												}}</span> -->
											</template>
										</el-table-column>
									</template>
								</el-table>
							</el-form-item>
							<el-form-item label="全部sku：" v-if="route.query?.id && showAll">
								<el-button type="default" @click="showAllSku()" :disabled="isDisabled">{{ isAttr ? '隐藏' : '展示' }}</el-button>
							</el-form-item>
							<!-- 多规格表格-->
							<el-form-item
								v-if="dataForm.attr?.length > 0 && dataForm.specType"
								label="商品属性："
								class="labeltop"
								:class="isDisabled ? 'disLabel' : 'disLabelmoren'"
							>
								<el-alert title="价格设置范围 0.01~999999.99" type="info"> </el-alert>
								<el-table :key="tableKey" :data="ManyAttrValue" border class="tabNumWidth" size="small">
									<template v-if="manyTabDate">
										<template v-if="dataForm.isPaidScore && tenantId != '1922177185280557058'">
											<el-table-column label="支付现金" min-width="120" align="center">
												<template #default="{ row }">
													<el-input-number
														maxlength="6"
														style="width: 100%"
														:disabled="isDisabled"
														v-model.trim="row.price"
														:precision="2"
														:min="0"
													/>
												</template>
											</el-table-column>
											<el-table-column v-if="tenantId != '1922177185280557058'" label="使用积分数" min-width="120" align="center">
												<template #default="{ row }">
													<el-input-number
														maxlength="6"
														style="width: 100%"
														:disabled="isDisabled"
														v-model.trim="row.scorePrice"
														:precision="0"
														:min="0"
													/>
													<!-- <span style="color: red">等于{{ row.scorePrice ? (row.scorePrice / 100).toFixed(2) : 0.0 }}元</span> -->
												</template>
											</el-table-column>
										</template>
										<el-table-column label="进价" min-width="120" align="center">
											<template #default="{ row }">
												<el-input-number maxlength="6" style="width: 100%" :disabled="isDisabled" v-model.trim="row.cost" :precision="2" :min="0" />
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId !== '1922177185280557058'" label="原价" min-width="120" align="center">
											<template #default="{ row }">
												<div v-if="dataForm.isPaidScore">
													{{ calculatePrice(row.price, row.scorePrice) }}
												</div>
												<el-input-number
													v-else
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.price"
													:precision="2"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId == '1922177185280557058'" label="支付积分" min-width="120" align="center">
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.scorePrice"
													:precision="2"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column
											v-if="dataForm.isPaidMember && tenantId != '1922177185280557058'"
											label="内购金额(元)"
											min-width="120"
											align="center"
										>
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.vipPrice"
													:precision="2"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column
											v-if="dataForm.isPaidMember && tenantId == '1922177185280557058'"
											label="内购积分"
											min-width="120"
											align="center"
										>
											<template #default="{ row }">
												<el-input-number
													maxlength="6"
													style="width: 100%"
													:disabled="isDisabled"
													v-model.trim="row.vipScorePrice"
													:precision="2"
													:min="0"
												/>
											</template>
										</el-table-column>
										<el-table-column v-for="(item, iii) in manyTabDate" :key="iii" :label="manyTabTit[iii].title" min-width="80" align="center">
											<template #default="{ row }">
												<span class="priceBox" v-text="row[iii]" />
											</template>
										</el-table-column>
									</template>
									<el-table-column label="图片" width="80" align="center">
										<template #default="{ row, $index }">
											<div class="upLoadPicBox" @click="modalPicTap('1', 'duo', $index)">
												<div class="pictrue tabPic">
													<upload-img
														v-model:imageUrl="row.image"
														dir="culture"
														:fileType="['image/jpeg', 'image/jpg', 'image/png']"
														height="60px"
														width="60px"
														borderRadius="4px"
													>
													</upload-img>
												</div>
											</div>
										</template>
									</el-table-column>
									<el-table-column
										v-for="(item, iii) in attrValue"
										:key="'attrValue' + iii"
										:label="formThead[iii].title"
										min-width="120"
										align="center"
									>
										<template #default="{ row }">
											<el-input
												v-if="iii === 'id'"
												:disabled="true"
												v-model="row[iii]"
												maxlength="40"
												type="test"
												class="priceBox"
												:readonly="true"
											/>
											<el-input-number
												v-else
												v-model.trim="row[iii]"
												:disabled="isDisabled"
												:min="iii === 'stock' ? 0 : 0.01"
												:max="dataForm.isPaidMember && iii === 'vipPrice' ? Number(row.price) : 999999.99"
												:step="iii === 'stock' ? 1 : 0.01"
												controls-position="right"
												step-strictly
											></el-input-number>
										</template>
									</el-table-column>
									<template v-if="dataForm.type == 5">
										<el-table-column label="云盘设置" min-width="120" align="center">
											<template #default="{ row, $index }">
												<el-button v-if="!row.expand" size="small" @click="handleAddVirtually($index, 'ManyAttrValue', 1)">添加链接</el-button>
												<el-button
													v-else
													class="seeCatMy pointer"
													type="text"
													size="small"
													@click="seeVirtually(ManyAttrValue[$index], 'ManyAttrValue', $index, 1)"
													>已设置</el-button
												>
											</template>
										</el-table-column>
									</template>
									<template v-if="dataForm.type == 6">
										<el-table-column label="卡密设置(必填)" min-width="120" align="center">
											<template #default="{ row, $index }">
												<el-button v-if="!row.cdkeyId" size="small" @click="handleAddVirtually($index, 'ManyAttrValue', 2)">添加卡密</el-button>
												<el-button
													v-else
													type="text"
													class="seeCatMy pointer"
													@click="seeVirtually(ManyAttrValue[$index], 'ManyAttrValue', $index, 2)"
													>{{ row.cdkeyLibraryName }}</el-button
												>
											</template>
										</el-table-column>
									</template>
									<template v-if="dataForm.type == 9">
										<el-table-column label="选择藏品" min-width="120" align="center">
											<template #default="{ row, index }">
												<el-button size="small" @click="chooseDigitizeCollection(row, index)">{{
													row.bindCollection ? '重新选择' : '选择藏品'
												}}</el-button>
												<p v-if="row.bindCollection && row.bindCollection.name">
													{{ row.bindCollection.name }}
													(
													<span v-if="row.bindCollection.limitType">长期</span>
													<span v-if="!row.bindCollection.limitType"> {{ row.bindCollection.limitDay }}天 </span>
													)
												</p>
											</template>
										</el-table-column>
									</template>
									<template v-if="dataForm.type == 11">
										<el-table-column label="关联优惠券(必填)" min-width="200" align="center">
											<template #default="{ row, $index }">
												<el-select
													v-model="row.couponOriginal"
													class="mr-2"
													placeholder="请选择优惠券来源"
													style="width: 100px"
													@change="onCouponOriginalChange($index, 'ManyAttrValue')"
												>
													<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
												</el-select>
												<el-button
													v-if="!row.couponId && row.couponOriginal == 1"
													@click="handleAddVirtually($index, 'ManyAttrValue', 3)"
													:disabled="isDisabled"
													>添加优惠券</el-button
												>
												<el-button
													v-if="!row.couponId && row.couponOriginal == 2"
													@click="handleAddVirtually($index, 'ManyAttrValue', 4)"
													:disabled="isDisabled"
													>添加优惠券</el-button
												>
												<el-button
													v-if="row.couponId && row.couponOriginal == 1"
													type="text"
													class="seeCatMy pointer"
													@click="handleAddVirtually($index, 'ManyAttrValue', 3, row.couponId)"
													:disabled="isDisabled"
													>{{ row.couponName }}</el-button
												>
												<el-button
													v-if="row.couponId && row.couponOriginal == 2"
													type="text"
													class="seeCatMy pointer"
													@click="handleAddVirtually($index, 'ManyAttrValue', 4, row.couponId)"
													:disabled="isDisabled"
													>{{ row.couponId }}</el-button
												>
												<!-- <span v-if="row.couponId && row.couponOriginal == 2" @click="handleAddVirtually($index, 'OneAttrValue', 4, row.couponId)">{{
													row.couponName
												}}</span> -->
											</template>
										</el-table-column>
									</template>
									<el-table-column v-if="!isDisabled && tenantId != '1963773220574330882'" key="3" label="操作" width="70" align="center">
										<template #default="{ row, $index }">
											<el-button link type="primary" size="small" @click="delAttrTable($index)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
						</el-card>
					</div>
					<div v-show="activeName == 2">
						<el-card>
							<el-form-item label="商品详情" prop="rebateType">
								<editor v-model:get-html="dataForm.content" style="margin-top: 20px"></editor>
							</el-form-item>
						</el-card>
					</div>
					<div v-show="activeName == 3">
						<el-card>
							<el-form-item label="消费返利" prop="rebateType">
								<div>
									<el-radio-group v-model="dataForm.rebateType">
										<el-radio :value="1">无需返利</el-radio>
										<el-radio :value="2">返优惠券</el-radio>
									</el-radio-group>
									<div><el-button v-if="dataForm.rebateType == 2" @click="handleSelectCoupon('returned')">选择优惠券</el-button></div>
									<div v-if="dataForm.rebateType == 2" style="display: inline-block">
										<el-tag
											v-for="(tag, index) in dataForm.coupons"
											:key="index"
											class="mr10 mt10"
											:closable="!isDisabled"
											:disable-transitions="false"
											@close="handleCloseCoupon(tag)"
										>
											{{ tag.name }}
										</el-tag>
									</div>
									<div class="from-tips">用户购买商品后返利规则</div>
								</div>
							</el-form-item>
						</el-card>
						<el-card v-if="tenantId != '1922177185280557058'" class="mt-5">
							<el-form-item label="积分抵扣" prop="maxDeductionRatio">
								<div class="display-flex">
									<div class="">最高抵扣比例</div>
									<div>
										<el-input-number
											class="ratio"
											placeholder="请输入最高抵扣比例"
											v-model="dataForm.maxDeductionRatio"
											:precision="2"
											step-strictly
											:step="0.01"
											max="100"
											min="0"
											style="width: 250px"
										/>
										<span class="ml-2">%</span>
									</div>
								</div>
							</el-form-item>
							<div class="from-tips">设置积分可抵扣商品总价的最高百分比</div>
						</el-card>
					</div>
				</el-form>
			</div>

			<div style="width: 80%; display: flex; align-items: center; justify-content: space-between; margin: 0 auto">
				<el-button @click="last" v-if="activeName > 0">上一步</el-button>
				<el-button @click="next" v-if="activeName < 3">下一步</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
			</div>
		</div>
		<!-- 选择藏品弹窗 -->
		<choose-digitize-collection-dialog ref="chooseCollectionRef" @handleOk="chooseCollectionOk" />
		<!-- 选择优惠券弹窗  -->
		<choose-coupon-dialo ref="couponDialoRef" @handleReturnedSelect="chooseReturnedCoupon" @handleSelect="chooseCoupon" />
		<!-- 添加卡密 -->
		<el-dialog title="设置卡密" width="600px" v-loading="loadingDialog" :show-close="false" @close="closeDialog" v-model="cardIdDialog">
			<el-form ref="cardRef" :model="cardForm" :rules="cardRules" label-width="120px" @submit.native.prevent>
				<el-form-item label="关联卡密库" prop="cdkeyId">
					<el-select v-model="cardForm.cdkeyId" filterable style="width: 100%" placeholder="请选择关联卡密库">
						<el-option v-for="item in cardList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeDialog">取 消</el-button>
					<el-button type="primary" @click="onSubmit(cardRef)">确 定</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 微信优惠券 -->
		<el-dialog title="设置优惠券" width="600px" v-loading="loadingCouponDialog" :show-close="false" @close="closeCouponDialog" v-model="couponDialog">
			<el-form ref="couponFormDialoRef" :model="couponForm" :rules="cardRules" label-width="120px" @submit.native.prevent>
				<el-form-item label="优惠券名称" prop="couponId">
					<el-input v-model="couponForm.couponId" placeholder="请输入优惠券名称" clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeCouponDialog">取 消</el-button>
					<el-button type="primary" @click="onSubmitCoupon(couponFormDialoRef)">确 定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	productCategoryApi,
	getShippingTemplatesList,
	guaranteeListApi,
	productDetailApi,
	productUpdateApi,
	productCreateApi,
	changeNodes,
	setDomain,
	replaceImgSrcHttps,
	fileImageApi,
	cdkeListApi,
	getSpuInfoApi,
	objToRichText,
	getSpuBySpuIdApi,
} from '/@/api/culture/commodity/commodityList';
import { getBusinessPage } from '/@/api/culture/merchant/merchantManage'; //获取商户数据
import type { UploadProps, UploadUserFile } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
import { useTenantConfig } from '/@/stores/tenantConfig';
// import { canSendListApi } from '/@/api/culture/commodity/commodityList';
import request from '/@/utils/request';
// import { getToken } from '@/utils/auth';
interface attrItem {
	attrName: string;
	attrValue: string[];
}
interface AttrValue {
	image?: string;
	cdkeyId?: any;
	expand?: string;
	cdkeyLibraryName?: string;
	vipPrice?: number;
	volume?: number;
	weight?: number;
	stock?: number;
	price?: number;
	scorePrice?: number;
	id?: string;
	couponId?: string | number | null;
	couponName?: string;
	vipScorePrice?: number | string;
	cost?: number | string;
}
const tenantId = ref(Session.getTenant());
const productType = ref<any>(''); //商品类型
// const tenantId = ref('1830554619998552065');
const merchantName = defineAsyncComponent(() => import('./components/merchantName/index.vue'));
const chooseCouponDialo = defineAsyncComponent(() => import('./components/chooseCouponDialo.vue'));
const ChooseDigitizeCollectionDialog = defineAsyncComponent(() => import('./components/chooseDigitizeCollectionDialog.vue'));
const chooseCollectionRef = ref<any>();
const couponDialoRef = ref<any>();
const couponFormDialoRef = ref<any>();
const route = useRoute();
const router = useRouter();
const store = useTenantConfig();
const activeName = ref(0);
const currentActiveName = ref(0); //默认激活第一个
const loadingFrom = ref(false);
const ruleFormRef = ref<FormInstance>();
const fullscreenLoading = ref(false);
const dataForm = ref<any>({
	// type: tenantId.value == '1922165158034145281' || tenantId.value == '1922166211546841089' ? 9 : 0, //现在
	type: 0,
	sliderImages: [],
	rebateType: 1,
	specType: false,
	isPaidMember: false,
	isPaidScore: false,
	goodsType: null,
	tempId: '',
	attr: [],
	maxDeductionRatio: null, //积分抵扣比例
	spuId: '', // 供应链id
});
const isDisabled = ref(false);
const typeName = ref('');
const categoryProps = ref({
	children: 'childList',
	label: 'name',
	value: 'id',
	multiple: false,
	emitPath: false,
});
const isMerchant = computed(() => {
	return import.meta.env.VITE_IS_MERCHANT;
});
console.log('isMerchant', isMerchant.value); // 这是一个字符串'true' 平台端都没设置这个！！！！！
const tableKey = ref(new Date().getTime());
const isAttr = ref(false);
const upload = ref<any>();
const videoLink = ref<any>(); //主图视频路径
const shippingTemplatesOption = ref<any[]>([]); //运费模板
const productClassify = ref<any[]>([]); //商品分类
const guaranteeList = ref<any[]>([]); //保障服务
const disabledBannerUpload = ref(false);
const options = [
	{
		value: 1,
		label: '内部',
	},
	{
		value: 2,
		label: '微信',
	},
];
const defaultObj = reactive({
	image: '',
	sliderImages: [],
	sliderImage: '',
	name: '',
	intro: '',
	keyword: '',
	// cateIds: [], // 商品分类id
	// cateId: null, // 商品分类id传值
	isShow: false,
	tempId: '',
	merId: '',
	originalLogisticsType: [],
	logisticsType: null,
	attrValue: [
		{
			image: '',
			price: 0,
			scorePrice: 0,
			vipPrice: 0,
			stock: 0,
			id: '',
			weight: 0,
			volume: 0,
			cdkeyId: '',
			cdkeyLibraryName: '',
			expand: '',
			couponId: '',
			couponName: '',
			vipScorePrice: 0,
			cost: 0,
		},
	],
	attr: [],
	isPaidMember: false,
	isPaidScore: false,
	content: '',
	specType: false,
	id: undefined,
	couponIds: [],
	coupons: [],
	categoryId: 0,
	guaranteeIds: '',
	guaranteeIdsList: [],
	type: 0, // 商品类型
	isAutoUp: false, //是否自动上架
	rebateType: 1, // 消费返利（默认无需返利）
});
const isBtn = ref(false);
const OneAttrValue = ref([Object.assign({}, defaultObj.attrValue[0])]); // 单规格
const ManyAttrValue = ref([Object.assign({}, defaultObj.attrValue[0])]); // 多规格
const goodsType = ref<any>(null);
const labelarr = ref<string>('');
const showAll = ref<boolean>(false);
const attrInfo = ref<any>({});
const manyTabTit = ref<any>({});
const manyTabDate = ref<any>({});
const loadingBtn = ref(false);
const shippingTypeListDisabled = ref<boolean>(false); // 是否禁用配送方式
const goodsTypeName = ref<string>('');
const objTitle = ref({
	vipPrice: {
		title: '内购金额（元）',
	},
	stock: {
		title: '库存',
	},
	id: {
		title: '商品编号',
	},
	weight: {
		title: '重量（KG）',
	},
	volume: {
		title: '体积(m³)',
	},
});
const formThead = ref<any>(Object.assign({}, objTitle.value));
const goodsTypeOption = ref<any[]>([]);
const merchantOption = ref([]);
const uploading = ref<boolean>(false);
const statusMap = ref([
	{
		value: 0,
		label: '普通商品',
	},
	{
		value: 5,
		label: '云盘商品',
	},
	{
		value: 6,
		label: '卡密商品',
	},
	{
		value: 9,
		label: '数字藏品',
	},
	{
		value: 11,
		label: '优惠券商品',
	},
]);

const visibleObject = ref([
	{
		value: 1,
		label: '内部员工',
	},
	{
		value: 2,
		label: '见习员工',
	},
	{
		value: 3,
		label: '见习-其他',
	},
	{
		value: 4,
		label: '学生',
	},
	{
		value: 5,
		label: '委外员工',
	},
	{
		value: 6,
		label: '普通用户',
	},
]);

const logisticsObject = ref([
	{
		value: 1,
		disabled: false,
		label: '快递发货',
	},
	{
		value: 5,
		disabled: false,
		label: '同城配送',
	},
	{
		value: 2,
		disabled: false,
		label: '自提核销',
	},
]);
const loadingDialog = ref(false); //卡密弹窗加载
const loadingCouponDialog = ref(false);
const cardIdDialog = ref(false);
const couponDialog = ref(false);
const cardRef = ref<any>(); //卡密弹窗加载
const cardForm = ref({
	cdkeyId: '',
	state: '',
	index: 0,
});
const couponForm = ref({
	state: '',
	index: 0,
	couponId: '',
});
const cardList = ref<any[]>([
	{
		label: 'ceshi',
		value: 1,
	},
]);
const cardRules = reactive<FormRules<any>>({
	cdkeyId: [{ required: true, message: '请选择关联卡密库', trigger: 'blur' }],
});
const rules = reactive<FormRules<any>>({
	spuId: [{ required: tenantId.value == '1963773220574330882', message: '请输入全境商品ID', trigger: 'blur' }],
	// goodsType: [{ required: true, message: '请选择所属商城', trigger: 'blur' }],
	businessCode: [{ required: true, message: '请选择所属运营机构', trigger: 'blur' }],
	name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
	categoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
	merId: [{ required: true, message: '请选择所属供应商', trigger: 'blur' }],
	identityTypeList: [{ required: true, message: '请选择可见对象', trigger: 'blur' }],
	shippingTypeList: [{ required: productType.value == '0', message: '请选择物流方式', trigger: 'blur' }],
	image: [{ required: true, message: '请上传商品封面图', trigger: 'blur' }],
	isPaidMember: [{ required: true, message: '请选择是否为员工商品', trigger: 'blur' }],
	// isPaidScore: [{ required: true, message: '请选择是否为积分商品', trigger: 'blur' }],
});
watch(
	() => dataForm.value.sliderImages,
	(val) => {
		if (val.length >= 10) {
			disabledBannerUpload.value = true;
		} else {
			disabledBannerUpload.value = false;
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => dataForm.value.attr,
	(val) => {
		console.log('aaaaaa', val);
		console.log('dataForm.value.specType', dataForm.value.specType);
		console.log('isAttr.value', isAttr.value);
		if (dataForm.value.specType && isAttr.value) watCh(val); //重要！！！
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => tenantId.value,
	(val) => {
		console.log('val', val);
		console.log('store', store.tenantConfig);
		goodsTypeOption.value = Object.entries(store.tenantConfig).map(([key, value]) => ({
			value: key.toString(),
			label: value.name,
		}));

		dataForm.value.goodsType = val ? val.toString() : '';
		console.log('goodsTypeOption.value', goodsTypeOption.value);
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => dataForm.value.image,
	(val) => {
		if (val) {
			OneAttrValue.value.forEach((item: any) => {
				item.image = val;
			});
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

watch(
	() => dataForm.value.type,
	(val) => {
		console.log('val', val);
		if (val === 9) {
			dataForm.value.shippingTypeList = [3];
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => dataForm.value.sliderImages,
	(val) => {
		console.log('sliderImages', val);
		if (val.length > 1) {
			const data = val.slice(0, -1);
			const newArr = data.filter((item: string, index: number) => {
				return item !== '';
			});
			console.log('newArr', newArr);
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => dataForm.value.sliderImages,
	(val) => {
		console.log('dataForm.value.sliderImages', val);
		val.forEach((item: any, index: number) => {
			if (!item && index !== val.length - 1) {
				val.splice(index, 1);
			}
		});
	},
	{
		immediate: true,
		deep: true,
	}
);
/**
 * 计算请求头部信息
 */
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': Session.getTenant(),
	};
});
// attrValue 计算属性
const attrValue = computed(() => {
	const obj: AttrValue = Object.assign({}, defaultObj.attrValue[0]);

	delete obj.price;
	delete obj.scorePrice;
	delete obj.image;
	delete obj.cdkeyId;
	delete obj.expand;
	delete obj.cdkeyLibraryName;
	delete obj.vipPrice;
	delete obj.couponId;
	delete obj.couponName;
	delete obj.vipScorePrice;
	delete obj.cost;

	// if (!dataForm.value.isPaidMember) {
	// 	delete obj.vipPrice;
	// }

	const type = dataForm.value.type;
	if (type === 5 || type === 9 || type === 11) {
		delete obj.volume;
		delete obj.weight;
	}

	if (type === 6) {
		delete obj.stock;
		delete obj.volume;
		delete obj.weight;
	}
	console.log('attrValue 计算属性obj', obj);
	return obj;
});
// 计算属性
const oneFormBatch = computed(() => {
	return [
		{
			id: '',
			image: '',
			price: 0,
			stock: 0,
			weight: 0,
			volume: 0,
			cdkeyId: '',
			cdkeyLibraryName: '',
			expand: '',
			vipPrice: 0,
			scorePrice: 0,
			vipScorePrice: 0,
			cost: 0,
		},
	];
});
onMounted(() => {
	getShippingTemplates(); //运费模板
	// isMerchant.value && getShippingTemplates();
	console.log('tenantId', tenantId.value);
	// 判断是否为地铁ip商品
	// if (tenantId.value == '1922165158034145281' || tenantId.value == '1922166211546841089') {
	// 	dataForm.value.type = 9;
	// 	logisticsObject.value = [
	// 		{
	// 			value: 3,
	// 			disabled: false,
	// 			label: '线上卡密',
	// 		},
	// 	];
	// } else if (tenantId.value == '1925074881528070146' || tenantId.value == '1925075171367059458') {
	// 	logisticsObject.value = [
	// 		{
	// 			value: 1,
	// 			disabled: false,
	// 			label: '快递发货',
	// 		},
	// 	];
	// } else {
	// 	dataForm.value.type = 0;
	// }
	console.log('route', route);
	// dataForm.value.type = tenantId.value == '1922165158034145281' || tenantId.value == '1922166211546841089' ? 9 : 0;
	// typeName.value = statusMap.value.find((item: any) => item.value == Number(route.query.productType))?.label || '';
	if (route.query?.productType) {
		productType.value = route.query?.productType;
		dataForm.value.type = Number(productType.value);
	}

	// if (dataForm.value.type === 9) {
	// 	dataForm.value.shippingTypeList = [3];
	// } else if (tenantId.value === '1925074881528070146' || tenantId.value === '1925075171367059458') {
	// 	dataForm.value.shippingTypeList = [1];
	// }
	dataForm.value.shippingTypeList = [1];

	getProductGuarantee(); //保障服务
	getBusinessPageData(); //商户管理
	getProductCategoryApi(); //商品分类
	getCdkeList(); //卡密库
	if (route.query?.id) {
		console.log('aaaaaaaaa');
		if (tenantId.value !== '1963773220574330882') getInfo();
		else getSpuInfo(route.query);
	} else {
		if (tenantId.value == '1963773220574330882') {
			dataForm.value.specType = true;
		}
	}
});

// 获取绑定的优惠券
// const canSendList = async (id: any) => {
// 	try {
// 		const { code, data, msg } = await canSendListApi({ id });
// 		if (code === 0) {
// 			console.log('data', data);
// 		} else {
// 			useMessage().error(msg);
// 		}
// 	} catch (error: any) {
// 		useMessage().error(error.msg);
// 	}
// };
// 拿三方数据
const getSpuInfo = async (data: any) => {
	if (!data.spuId) {
		return;
	}
	loadingFrom.value = true;
	if (data.spuId) {
		const params = { id: null, spuId: data.spuId };
		if (data.id) {
			params.id = data.id;
		}
		console.log('params', params);
		console.log();
		try {
			const { code, msg, data } = await getSpuInfoApi(params);
			if (code === 0) {
				console.log('getSpuInfodata', data);
				productType.value = 0;
				getData(data);
				dataForm.value.spuId = data.spuId;
				dataForm.value.spuName = data.spuName;
			} else {
				dataForm.value = {
					type: 0,
					sliderImages: [],
					rebateType: 1,
					specType: true,
					isPaidMember: false,
					isPaidScore: false,
					goodsType: null,
					tempId: '',
					attr: [],
					shippingTypeList: [1],
					maxDeductionRatio: null, //积分抵扣比例
				};
				useMessage().error(msg);
			}
		} catch (err: any) {
			dataForm.value = {
				type: 0,
				sliderImages: [],
				rebateType: 1,
				specType: true,
				isPaidMember: false,
				isPaidScore: false,
				goodsType: null,
				tempId: '',
				attr: [],
				shippingTypeList: [1],
				maxDeductionRatio: null, //积分抵扣比例
			};
			useMessage().error(err.msg);
		} finally {
			loadingFrom.value = false;
		}
	}
};
// 同步三方图片
const getSpuBySpuId = async () => {
	if (!dataForm.value.spuId) {
		useMessage().error('请输入全境商品ID');
		return;
	} else {
		loadingFrom.value = true;
		const params = { spuId: dataForm.value.spuId };
		console.log('params', params);
		try {
			const { code, msg, data } = await getSpuBySpuIdApi(params);
			if (code === 0) {
				console.log('getSpuBySpuIdApi', data);
				dataForm.value.content = data.detailImgList ? objToRichText(data.detailImgList) : '';
				dataForm.value.image = setDomain(data.image);
				dataForm.value.sliderImage = data.sliderImage;
				dataForm.value.sliderImages = data.sliderImage?.length > 0 ? data.sliderImage.split(',') : [];
				let imgs = [];
				if (data.sliderImage.length > 0) {
					imgs = data.sliderImage.split(',');
				}
				let imgss: any[] = [];
				Object.keys(imgs).map((i) => {
					imgss.push(setDomain(imgs[i]));
				});
				dataForm.value.sliderImages = [...imgss];
				if (getFileType(dataForm.value.sliderImages[0]) == 'video') {
					//如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除
					videoLink.value = dataForm.value.sliderImages[0];
					// dataForm.value.sliderImages.splice(0, 1);
					dataForm.value.sliderImages.shift();
				}
				useMessage().success('同步成功');
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		} finally {
			loadingFrom.value = false;
		}
	}
};

// 卡密库下拉数据
const getCdkeList = async () => {
	try {
		const { code, data, msg } = await cdkeListApi();
		if (code === 0) {
			console.log('data', data);
			cardList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const getBusinessPageData = async () => {
	merchantOption.value = [];
	// getBusinessPage
	try {
		const { code, data, msg } = await getBusinessPage({ current: 1, size: 1000, limit: 1000, descs: '', ascs: '' });
		if (code === 0) {
			console.log('data', data);
			if (data.records.length) {
				data.records.forEach((item: any) => {
					merchantOption.value.push({
						label: item.name,
						value: item.code,
					});
				});
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const watCh = (val: any) => {
	console.log('watChval', val);
	const tmp: any = {};
	const tmpTab: any = {};
	dataForm.value.attr.forEach((o: any, i: index) => {
		tmp[o.attrName] = { title: o.attrName };
		tmpTab[o.attrName] = '';
	});
	ManyAttrValue.value = attrFormat(val);
	if (dataForm.value.attrValue) {
		ManyAttrValue.value.forEach((val: any, index: number) => {
			const key = Object.values(val.attrValue).sort().join('/');
			if (attrInfo.value[key]) ManyAttrValue.value[index] = attrInfo.value[key];
		});
		attrInfo.value = [];
		ManyAttrValue.value.forEach((val) => {
			attrInfo.value[Object.values(val.attrValue).sort().join('/')] = val;
		});
	}
	console.log('tmp', tmp);
	console.log('tdataForm.value.attrmp', dataForm.value.attr);
	manyTabTit.value = tmp;
	manyTabDate.value = tmpTab;
	formThead.value = Object.assign({}, formThead.value, tmp);
};
const onCouponOriginalChange = (index: number, state: string) => {
	// 	if (data[0].state == 'ManyAttrValue') {
	// 	ManyAttrValue.value[couponForm.value.index].couponId = data[0].id;
	// 	ManyAttrValue.value[couponForm.value.index].couponName = data[0].name;
	// } else {
	// 	OneAttrValue.value[couponForm.value.index].couponId = data[0].id;
	// 	OneAttrValue.value[couponForm.value.index].couponName = data[0].name;
	// }
	if (state == 'ManyAttrValue') {
		ManyAttrValue.value[index].couponId = '';
		ManyAttrValue.value[index].couponName = '';
	} else {
		OneAttrValue.value[index].couponId = '';
		OneAttrValue.value[index].couponName = '';
	}
};
const handleAddVirtually = (index: number, state: string, num: number, id?: any) => {
	if (num == 2) {
		cardForm.value = {
			state: '',
			index: 0,
			cdkeyId: '',
		};
		cardForm.value.state = state;
		cardForm.value.index = index;
		cardIdDialog.value = true;
	}
	if (num == 3) {
		console.log('3id', id);
		couponForm.value.state = state;
		couponForm.value.index = index;
		couponDialoRef.value.openDialog(state);
	}
	if (num == 4) {
		console.log('4id', id);
		couponForm.value.state = state;
		couponForm.value.state = state;
		if (id) couponForm.value.couponId = id;
		console.log('couponForm', couponForm.value);
		couponDialog.value = true;
	}
};
const seeVirtually = (value: any, state: string, index: number, num: number) => {
	console.log('value', value);
	console.log('state', state);
	cardForm.value.state = state;
	// cardForm.value.cdkeyId = value.cdkeyId;
	cardForm.value.index = index;
	cardIdDialog.value = true;
};
const getData = (res: any) => {
	console.log('res', res);
	let info = res;
	goodsType.value = info.goodsType ? info.goodsType : null;
	// getShippingTemplates();
	console.log('shippingTemplatesOption', shippingTemplatesOption.value);
	console.log('info.tempId', info.tempId);
	// console.log(
	// 	'shippingTemplatesOption.value.find((item) => item.id == info.tempId)',
	// 	shippingTemplatesOption.value.find((item) => item.id == info.tempId)
	// );
	// dataForm.tempId
	dataForm.value = {
		image: setDomain(info.image),
		sliderImage: info.sliderImage,
		sliderImages: info.sliderImage
			? tenantId.value == '1963773220574330882' && !info.id
				? info.sliderImage.split(',') || []
				: JSON.parse(info.sliderImage)
			: [],
		name: info.name,
		intro: info.intro,
		keyword: info.keyword,
		keywords: info.keyword,
		tagName: info.tagName ? info.tagName : '',
		// cateIds: info.cateId ? info.cateId.split(',') : [], // 商品分类id
		// cateId: info.cateId, // 商品分类id传值
		isShow: info.isShow ? info.isShow : false,
		tempId: info.tempId ? (Number(info.tempId) ? Number(info.tempId) : 1) : 1,
		merId: info.merId,
		goodsType: info.goodsType ? info.goodsType : null,
		businessCode: info.businessCode ? info.businessCode : '',
		identityTypeList: info.identityTypeList || [],
		shippingTypeList: info.shippingTypeList ? info.shippingTypeList : [1],
		attr: info.attr || [],
		attrValue: info.attrValue ? info.attrValue : [],
		// 全境新增数据时拿detailImgList，编辑是走数据库拿的
		content:
			tenantId.value == '1963773220574330882' && !info.id
				? info.detailImgList
					? objToRichText(info.detailImgList)
					: []
				: info.content
				? replaceImgSrcHttps(info.content)
				: '',
		specType: tenantId.value == '1963773220574330882' ? true : info.specType,
		originalLogisticsType: info.logisticsType ? (info.logisticsType === 3 ? [1, 2] : [info.logisticsType]) : [],
		id: info.id ? info.id : 0,
		categoryId: info.categoryId || null,
		guaranteeIds: info.guaranteeIds ? info.guaranteeIds : '', //保障服务传值
		// type: tenantId.value == '1922165158034145281' || tenantId.value === '1922166211546841089' ? 9 : 0,
		type: info.type ? info.type : 0,
		guaranteeIdsList: info.guaranteeIds && info.guaranteeIds !== '0' ? info.guaranteeIds.split(',').map(Number) : [], //保障服务
		isPaidMember: info.isPaidMember ? info.isPaidMember : false,
		isPaidScore: info.isPaidScore ? info.isPaidScore : false,
		auditStatus: info.auditStatus ? info.auditStatus : 0,
		coupons: info.couponList ? info.couponList : [],
		couponIds: info.couponIds ? info.couponIds : [],
		rebateType: info.rebateType ? info.rebateType : 1,
		maxDeductionRatio: info.maxDeductionRatio ? info.maxDeductionRatio : null,
		spuId: tenantId.value == '1963773220574330882' ? info.spuId : null,
	};

	// 获取商户分类 和 运费模板选项列表数据
	if (tenantId.value == '1963773220574330882' && !info.id) {
		dataForm.value.merId = null;
	} else getMerId(info.merId);
	console.log('HHHHHHHHHHHHHHHHHHHHHHdataForm', dataForm.value);
	labelarr.value = info.keyword;
	let imgs = null;

	if (tenantId.value == '1963773220574330882' && !info.id) {
		if (info.sliderImage?.length > 0) {
			imgs = info.sliderImage.split(',');
		} else {
			imgs = [];
		}
	} else imgs = JSON.parse(info.sliderImage);
	let imgss: any[] = [];
	Object.keys(imgs).map((i) => {
		imgss.push(setDomain(imgs[i]));
	});
	dataForm.value.sliderImages = [...imgss];
	console.log('dataForm.value.sliderImages = [...imgss];');
	if (getFileType(dataForm.value.sliderImages[0]) == 'video') {
		//如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除
		videoLink.value = dataForm.value.sliderImages[0];
		// dataForm.value.sliderImages.splice(0, 1);
		dataForm.value.sliderImages.shift();
	}
	console.log('如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除');
	if (info.specType) {
		console.log('info.specTypeinfo.specType');
		if (info.attrValue) {
			dataForm.value.attr = info.attr.map((item: any) => {
				return {
					attrName: item.attrName,
					attrValue: item.attrValues.split(','),
				};
			});
			ManyAttrValue.value = info.attrValue;
			ManyAttrValue.value.forEach((val: any) => {
				val.image = setDomain(val.image);
				val.attrValue = JSON.parse(val.attrValue);
				attrInfo.value[Object.values(val.attrValue).sort().join('/')] = val;
				val.vipPrice = val.vipPrice || '';
				val.vipScorePrice = val.vipScorePrice || '';
				// 若数字藏品，绑定藏品数据
				if (dataForm.value.type == 9) {
					const v = val;
					val.bindCollection = {
						id: null,
						name: v.skinName,
						code: v.skinCode,
						limitType: v.isLimitation,
						limitDay: v.limitDay,
					};
				}
			});
			/***多规格商品如果被删除过sku，优先展示api返回的数据,否则会有没有删除的错觉***/
			let manyAttr = attrFormat(dataForm.value.attr);
			if (manyAttr.length !== ManyAttrValue.value.length) {
				// this.$set(this, 'showAll', true);
				showAll.value = true;
				isAttr.value = false;
			} else {
				isAttr.value = true;
			}
			/*******/
			const tmp: any = {};
			const tmpTab: any = {};
			dataForm.value.attr.forEach((o, i) => {
				tmp[o.attrName] = { title: o.attrName };
				tmpTab[o.attrName] = '';
			});
			// 此处手动实现后台原本value0 value1的逻辑
			dataForm.value.attrValue.forEach((item: any) => {
				for (let attrValueKey in item.attrValue) {
					item[attrValueKey] = item.attrValue[attrValueKey];
				}
			});
			manyTabTit.value = tmp;
			manyTabDate.value = tmpTab;
			formThead.value = Object.assign({}, formThead.value, tmp);
		} else {
			if (dataForm.value.attr.length) {
				oneFormBatch.value[0].image = setDomain(info.image);
				dataForm.value.attr = info.attr.map((item: any) => {
					return {
						attrName: item.attrName,
						attrValue: JSON.parse(item.attrValues),
					};
				});
			}
		}
	} else {
		OneAttrValue.value = info.attrValue.map((val: any) => {
			// 若数字藏品，绑定藏品数据
			if (dataForm.value.type == 9) {
				const v = val;
				val.bindCollection = {
					id: new Date().getTime(),
					name: v.skinName,
					code: v.skinCode,
					limitType: v.isLimitation,
					limitDay: v.limitDay,
				};
			}
			return val;
		});
		console.log('单规格商品数据', OneAttrValue.value);
	}
	if (dataForm.value.tempId && shippingTemplatesOption.value?.length) {
		dataForm.value.tempId = !shippingTemplatesOption.value.find((item) => item.id == info.tempId) ? null : dataForm.value.tempId;
	}
	if (dataForm.value.tempId == 0) {
		dataForm.value.tempId = null;
	}
};

//点击展示所有多规格属性
const showAllSku = () => {
	if (isAttr.value == false) {
		isAttr.value = true;
		if (dataForm.value.specType && isAttr.value) watCh(dataForm.value.attr); //重要！！！
	} else if (isAttr.value == true) {
		isAttr.value = false;
		getInfo();
	}
};
// 详情
const getInfo = async () => {
	loadingFrom.value = true;
	console.log('route.query.id', route.query.id);
	try {
		const { code, data, msg } = await productDetailApi(Number(route.query.id));
		if (code === 0) {
			productType.value = data.type;
			getData(data);

			loadingFrom.value = false;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		loadingFrom.value = false;
		useMessage().error(error.msg);
	}
};
const attrFormat = (arr: any) => {
	let data: any = [];
	const res: any = [];

	const format = (arr: any) => {
		if (arr.length > 1) {
			arr.forEach((v: any, i: number) => {
				if (i === 0) data = arr[i]['attrValue'];
				const tmp: any = [];
				if (!data) return;
				data.forEach((vv: any) => {
					if (arr[i + 1] && arr[i + 1]['attrValue']) {
						arr[i + 1]['attrValue'].forEach((g: any) => {
							const rep2 = (i !== 0 ? '' : arr[i]['attrName'] + '_') + vv + '$&' + arr[i + 1]['attrName'] + '_' + g;
							tmp.push(rep2);
							if (i === arr.length - 2) {
								const rep4 = {
									image: '',
									price: tenantId.value == '1922177185280557058' ? 0.0 : 0.01,
									id: '',
									stock: 0,
									weight: 0,
									volume: 0,
									cdkeyId: '',
									cdkeyLibraryName: '',
									expand: '',
									vipPrice: '',
									attrValue: {},
								};
								rep2.split('$&').forEach((h) => {
									const rep3 = h.split('_');
									const key = rep3[0];
									const value = rep3.length > 1 ? rep3[1] : '';
									rep4.attrValue[key] = value;
									rep4[key] = value;
								});
								res.push(rep4);
							}
						});
					}
				});
				data = tmp.length ? tmp : [];
			});
		} else {
			const dataArr: any = [];
			arr.forEach((v: any) => {
				v['attrValue'].forEach((vv: any, kk: number) => {
					dataArr[kk] = v['attrName'] + '_' + vv;
					res[kk] = {
						image: '',
						price: tenantId.value == '1922177185280557058' ? 0.0 : 0.01,
						stock: 0,
						id: '',
						weight: 0,
						volume: 0,
						cdkeyId: '',
						cdkeyLibraryName: '',
						expand: '',
						vipPrice: '',
						attrValue: { [v['attrName']]: vv },
					};
					for (let key in res[kk].attrValue) {
						res[kk][key] = res[kk].attrValue[key];
					}
				});
			});
			data.push(dataArr.join('$&'));
		}

		console.log('格式化数据结果和传入源数据', res, arr);
		return res;
	};

	return format(arr);
};
// 添加详情上传按钮
const handleCreateUploadComponent = () => {
	if (dataForm.value.sliderImages.includes('')) {
		useMessage().error('请先上传上一张图片');
		return;
	}
	dataForm.value.sliderImages.push('');
};
// 上一步
const last = () => {
	activeName.value -= 1;
};
// 下一步
const next = async () => {
	switch (activeName.value) {
		case 0: {
			if (uploading.value) {
				useMessage().error('视频上传中，请稍后');
				break;
			} else {
				activeName.value = 1;
				break;
			}
		}
		case 1: {
			// 若数字藏品，检验是否已绑定
			let isValid = true;
			if (dataForm.value.type == 9) {
				// console.log('判断是否有藏品', dataForm.value.specType, this.OneattrValue, this.ManyAttrValue);
				const specType = dataForm.value.specType;
				// 单规格 且 藏品绑定判断
				if (specType == false) {
					if (!OneAttrValue.value[0]?.bindCollection) {
						useMessage().error('请先绑定藏品');
						isValid = false;
					}
				}
				if (specType == true) {
					// 多规格 且 藏品绑定判断
					ManyAttrValue.value.forEach((item: any) => {
						if (!item.bindCollection) {
							useMessage().error('请先绑定藏品');
							isValid = false;
						}
					});
				}
			}
			if (dataForm.value.type == 11) {
				const specType = dataForm.value.specType;
				// 单规格
				if (specType == false) {
					if (!OneAttrValue.value[0]?.couponId) {
						useMessage().error('请先绑定优惠券');
						isValid = false;
					}
				}
				if (specType == true) {
					// 多规格
					ManyAttrValue.value.forEach((item: any) => {
						if (!item.couponId) {
							useMessage().error('请先绑定优惠券');
							isValid = false;
						}
					});
				}
			}
			if (isValid === true) {
				activeName.value = 2;
				break;
			}
			break;
		}
		case 2: {
			activeName.value = 3;
			break;
		}
		case 3: {
			activeName.value = 4;
			break;
		}
	}
};
// 保存
const submitForm = async (formEl: FormInstance | undefined) => {
	console.log('uploading.value', uploading.value);
	if (uploading.value) {
		useMessage().error('视频上传中，请稍后!');
		return;
	}
	// if (dataForm.value.attrValue?.length > 0 && dataForm.value.type == 6) {
	// 	const missingCdkey = dataForm.value.attrValue.some((item: any) => !item.cdkeyId);
	// 	if (missingCdkey) {
	// 		useMessage().error('请选择卡密商品规格属性对应的卡密库!');
	// 		return;
	// 	}
	// }
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			console.log('submit!', dataForm.value);
			// dataForm.value.
			// if (tenantId.value == '1922165158034145281' || tenantId.value === '1922166211546841089') dataForm.value.goodsType = 9;
			// else dataForm.value.type = 0;
			// if (tenantId.value == '1922165158034145281' || tenantId.value === '1922166211546841089') dataForm.value.goodsType = 9;
			// else dataForm.value.type = 0;
			dataForm.value.type = productType.value;
			dataForm.value.goodsType = '';
			console.log('submit!', dataForm.value);
			console.log('表单数据和商城板块', dataForm.value);
			dataForm.value.isAutoUp = false;
			dataForm.value.isAutoSubmitAudit = false;
			automaticListing();
		} else {
			console.log('error submit!', dataForm.value);
			useMessage().error('请填写完整商品信息!');
		}
	});
};

//保存接口数据更新
const getFromData = () => {
	// 将取货方式转换为数字，全选为3，否则为1或者2
	dataForm.value.logisticsType = dataForm.value.originalLogisticsType?.length === 2 ? 3 : Number(dataForm.value.originalLogisticsType?.join(''));
	// 如果是“数字藏品”，取货方式固定传值 3（1和2的二进制和）
	if (dataForm.value.type == 9) {
		dataForm.value.logisticsType = 3;
	}

	if (dataForm.value.specType && dataForm.value.attr.length < 1) return useMessage().error('请填写多规格属性！');
	// dataForm.value.cateId = dataForm.value.cateIds.join(',');
	// dataForm.value.keyword = labelarr.value.join(',');
	if (dataForm.value.keywords) {
		if (dataForm.value.keywords.includes(',')) {
			dataForm.value.keywords = dataForm.value.keywords.replace(/,/g, '，');
		}
		// dataForm.value.keyword = dataForm.value.keywords;
	}
	if (dataForm.value.tagName) {
		if (dataForm.value.tagName.includes(',')) {
			dataForm.value.tagName = dataForm.value.tagName.replace(/,/g, '，');
		}
		// dataForm.value.tagName = dataForm.value.tagName;
	}
	// dataForm.value.keyword =dataForm.value.keywords ? dataForm.value.keywords. : labelarr.value;
	console.log('videoLink.value', videoLink.value);
	if (videoLink.value) {
		//如果有视频主图，将视频链接插入到轮播图第一的位置
		// dataForm.value.sliderImages.unshift(videoLink.value.response.data.url);
		dataForm.value.sliderImages.unshift(videoLink.value);
	}
	dataForm.value.sliderImage = JSON.stringify(dataForm.value.sliderImages);
	if (dataForm.value.guaranteeIdsList?.length > 0) dataForm.value.guaranteeIds = dataForm.value.guaranteeIdsList.join(',');
	console.log('dataForm.value.specType', dataForm.value.specType);
	if (dataForm.value.specType) {
		dataForm.value.attrValue = ManyAttrValue.value.map((item: any) => {
			// 字段未定以，但在表格中有的列。其字段在这里加，否则最终表单收集数据该字段值若为空时会变成undefined
			for (let k in item) {
				if (item[k] === undefined) {
					item[k] = null;
				}
			}
			return item;
		});
		dataForm.value.attr = dataForm.value.attr.map((item: any) => {
			return {
				attrName: item.attrName,
				id: item.id,
				attrValue: item.attrValue,
				attrValues: item.attrValue.join(','),
			};
		});
		for (var i = 0; i < dataForm.value.attrValue.length; i++) {
			dataForm.value.attrValue[i].id = 0;
			dataForm.value.attrValue[i].productId = 0;
			// 多规格保存转换藏品数据
			const item = dataForm.value.attrValue[i];
			if (item.bindCollection) {
				dataForm.value.attrValue[i].skinCode = item.bindCollection.code;
				dataForm.value.attrValue[i].isLimitation = item.bindCollection.limitType;
				dataForm.value.attrValue[i].limitDay = item.bindCollection.limitDay;
			}
			let attrValues = dataForm.value.attrValue[i].attrValue;
			dataForm.value.attrValue[i].attrValue = JSON.stringify(attrValues);
			delete dataForm.value.attrValue[i].value0;
		}
	} else {
		dataForm.value.attr = [
			{
				attrName: '规格',
				attrValues: '默认',
				id: route?.query.id ? dataForm.value.attr[0].id : 0,
			},
		];
		OneAttrValue.value.map((item: any) => {
			item.attrValue = JSON.stringify({ 规格: '默认' });
			//   this.$set(item, 'attrValue', JSON.stringify({ 规格: '默认' }));
			item.productId = 0;
			//   this.$set(item, 'productId', 0);
			// 单规格保存转换藏品数据
			if (item.bindCollection) {
				item.skinCode = item.bindCollection.code;
				// this.$set(item, 'skinCode', item.bindCollection.code);
				item.isLimitation = item.bindCollection.limitType;
				// this.$set(item, 'isLimitation', item.bindCollection.limitType);
				item.limitDay = item.bindCollection.limitDay;
				// this.$set(item, 'limitDay', item.bindCollection.limitDay);
			}

			// 字段未定以，但在表格中有的列。其字段在这里加，否则最终表单收集数据该字段值若为空时会变成undefined
			for (let k in item) {
				if (item[k] === undefined) {
					item[k] = null;
				}
			}
		});
		// console.log('提交前从规格列表获取数据', this.OneattrValue);

		dataForm.value.attrValue = OneAttrValue.value;
	}
	if (dataForm.value.type === 5 || dataForm.value.type === 6) dataForm.value.tempId = 0;
};
// 优惠券弹窗
const handleSelectCoupon = (type: string) => {
	// chooseCouponDialo
	couponDialoRef.value.openDialog(type);
};
const handleCloseCoupon = (tag: any) => {
	console.log('handleCloseCoupon', tag);
	isAttr.value = true;
	dataForm.value.coupons.splice(dataForm.value.coupons.indexOf(tag), 1);
	dataForm.value.couponIds.splice(dataForm.value.couponIds.indexOf(tag.id), 1);
};
//是否自动上架
const automaticListing = async () => {
	try {
		const str = '审核通过之后是否自动上架？';
		await useMessageBox().confirm(str, '提示');
		dataForm.value.isAutoUp = true;
		getFromData();
		postData();
	} catch (action) {
		console.log('action', action);
		if (action === 'cancel') {
			dataForm.value.isAutoUp = false;
			getFromData();
			postData();
			// postData();
			// 调用取消按钮的方法
		} else if (action === 'close') {
			// 调用关闭按钮的方法
		}
		return;
	}
};

// 新增保存数据
const postData = async () => {
	loadingFrom.value = true;
	console.log('dataForm.value', dataForm.value);
	if (dataForm.value.attrValue.length > 0) {
		dataForm.value.attrValue.forEach((item: any) => {
			item.otPrice = item.price;
		});
	}
	if (tenantId.value == '1922177185280557058') {
		dataForm.value.isPaidScore = true;
	}
	let params = JSON.parse(JSON.stringify(dataForm.value));
	// 保存前数据合理处理
	if (!params?.isPaidScore) {
		// 非积分商品时，商品属性“使用积分数”传递值改为0
		let tmpAttrValue = params.attrValue?.slice();
		params.attrValue = tmpAttrValue.map((v: any) => {
			v.scorePrice = 0;
			return v;
		});
	}
	// 线上卡密数据的快递方式
	if (productType.value == 6 || productType.value == 11) {
		params.shippingTypeList = [3];
	}
	// 表单中没有但需要保存的额外数据
	params.goodsType = dataForm.value.goodsType;
	console.log('保存表单数据', params);
	// spuId
	try {
		console.log('route', route);

		const request = route.query.id ? productUpdateApi : productCreateApi;
		const { code, msg } = await request(params);
		console.log('msg', msg);
		console.log('codecodecodecode', code);
		if (code === 0) {
			if (route.query?.id) {
				useMessage().success('编辑成功');
				setTimeout(() => {
					router.push({ path: '/culture/commodity/commodityList/index' });
				}, 500);
				loadingBtn.value = false;
			} else {
				useMessage().success('新增成功');
				setTimeout(() => {
					router.push({ path: '/culture/commodity/commodityList/index' });
				}, 500);
				loadingBtn.value = false;
			}
		} else {
			if (route?.params.id) {
				loadingBtn.value = false;
				for (var i = 0; i < dataForm.value.attrValue.length; i++) {
					let attrValues = dataForm.value.attrValue[i].attrValue;
					dataForm.value.attrValue[i].attrValue = JSON.parse(attrValues);
					// this.$set(dataForm.value.attrValue[i], 'attrValue', JSON.parse(attrValues));
				}
				console.log('dataForm.value.attrValue', dataForm.value.attrValue);
				if (dataForm.value.specType) ManyAttrValue.value = dataForm.value.attrValue;
			} else {
				loadingBtn.value = false;
				for (var i = 0; i < dataForm.value.attrValue.length; i++) {
					let attrValues = dataForm.value.attrValue[i].attrValue;
					dataForm.value.attrValue[i].attrValue = JSON.parse(attrValues);
					// this.$set(dataForm.value.attrValue[i], 'attrValue', JSON.parse(attrValues));
				}
				console.log('dataForm.value.attrValue', dataForm.value.attrValue);
				if (dataForm.value.specType) ManyAttrValue.value = dataForm.value.attrValue;
			}
			loadingBtn.value = false;
			useMessage().error(msg);
		}
	} catch (row: any) {
		console.log('报错拉', row);
		if (route?.params.id) {
			loadingBtn.value = false;
			for (var i = 0; i < dataForm.value.attrValue.length; i++) {
				let attrValues = dataForm.value.attrValue[i].attrValue;
				dataForm.value.attrValue[i].attrValue = JSON.parse(attrValues);
				// this.$set(dataForm.value.attrValue[i], 'attrValue', JSON.parse(attrValues));
			}
			console.log('dataForm.value.attrValue', dataForm.value.attrValue);
			if (dataForm.value.specType) ManyAttrValue.value = dataForm.value.attrValue;
		} else {
			loadingBtn.value = false;
			for (var i = 0; i < dataForm.value.attrValue.length; i++) {
				let attrValues = dataForm.value.attrValue[i].attrValue;
				dataForm.value.attrValue[i].attrValue = JSON.parse(attrValues);
				// this.$set(dataForm.value.attrValue[i], 'attrValue', JSON.parse(attrValues));
			}
			console.log('dataForm.value.attrValue', dataForm.value.attrValue);
			if (dataForm.value.specType) ManyAttrValue.value = dataForm.value.attrValue;
		}
		useMessage().error(row.msg);
		loadingFrom.value = false;
		return false;
	}
};
// 获取部分选项
const getMerId = (id: any) => {
	if (!id) {
		useMessage().error('请先选择所属供应商');
		return;
	}
	// 根据所选商户id动态查询商户商品分类和商户运费模板
	if (id) {
		dataForm.value.merId = id;
		// 这里和商户不绑定了
		// getShippingTemplates();
	} else {
		dataForm.value.merId = null;
	}
};
const getFileType = (fileName: string) => {
	// 后缀获取
	let suffix = '';
	// 获取类型结果
	let result: any = '';
	try {
		const flieArr = fileName.split('.');
		suffix = flieArr[flieArr.length - 1];
	} catch (err) {
		suffix = '';
	}
	// fileName无后缀返回 false
	if (!suffix) {
		return false;
	}
	suffix = suffix.toLocaleLowerCase();
	// 图片格式
	const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
	// 进行图片匹配
	result = imglist.find((item) => item === suffix);
	if (result) {
		return 'image';
	}
	// 匹配 视频
	const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
	result = videolist.find((item) => item === suffix);
	if (result) {
		return 'video';
	}
	// 其他 文件类型
	return 'other';
};
// 上传
const handleUploadForm = async (param: any) => {
	const formData = new FormData();
	const data = {
		model: 'product',
		pid: 0,
	};
	formData.append('multipart', param.file);
	fullscreenLoading.value = true;
	console.log('formData', formData);
	try {
		let res = await fileImageApi(formData, data);
		if (res.code === 0) {
			console.log('res', res);
			videoLink.value = res.data.url;
			useMessage().success('上传成功');
			fullscreenLoading.value = false;
		} else {
			useMessage().error(res.msg);
			fullscreenLoading.value = false;
		}
	} catch (e: any) {
		useMessage().error(e.msg);
		fullscreenLoading.value = false;
	}
};
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	console.log('rawFile', rawFile);
	let type: string[] = [];
	type = rawFile.type.split('/');
	console.log('type', type);
	if (type[0] !== 'video') {
		ElNotification({
			title: '温馨提示',
			message: '请上传视频文件！',
			type: 'warning',
		});
		return false;
	} else if (rawFile.size / 1024 / 1024 > 10) {
		ElNotification({
			title: '温馨提示',
			message: '视频大小不超过10MB',
			type: 'warning',
		});
		return false;
	}
	uploading.value = true;
	return true;
};
const handleExceed: UploadProps['onExceed'] = (uploadFile) => {
	console.log('uploadFile', uploadFile);
	useMessage().error('最多上传1个视频！');
};
const handleProgress = (event: ProgressEvent, rawFile: File) => {};
const handleSuccess: UploadProps['onSuccess'] = (uploadFile, uploadFiles) => {
	uploading.value = false;
};
const handleError = (error: Error, rawFile: File) => {
	uploading.value = false;
};
// 运费模板选项
const getShippingTemplates = async () => {
	shippingTemplatesOption.value = [];
	try {
		const { code, data, msg } = await getShippingTemplatesList();
		if (code === 0) {
			console.log('运费模板选项', data);
			// localStorage.setItem('shippingTemplatesOption', JSON.stringify(data.records));
			shippingTemplatesOption.value = data.records;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 保障服务选项
const getProductGuarantee = async () => {
	try {
		const { code, data, msg } = await guaranteeListApi();
		if (code === 0) {
			const arr = changeNodes(data);
			guaranteeList.value = arr.filter((item: any) => item.isShow);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 商品分类选项
const getProductCategoryApi = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			console.log('data', data);
			data.map((item: any) => {
				if (item.childList?.length < 1) {
					item.disabled = true;
				}
			});
			productClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 选择保障服务
const changeGuarantee = (val: any) => {
	if (val) {
		dataForm.value.guaranteeIds = val.toString();
	} else {
		dataForm.value.guaranteeIds = '';
	}
};
const dragging = ref<any>();
// 多规格
const handleDragStart = (e: any, item: any) => {
	if (!isDisabled.value) dragging.value = item;
};
const handleDragEnd = (e: any, item: any) => {
	if (!isDisabled.value) dragging.value = null;
};
const handleDragOver = (e: any) => {
	if (!isDisabled.value) e.dataTransfer.dropEffect = 'move';
};
const handleDragEnter = (e: any, item: any, index: number) => {
	if (!isDisabled.value) {
		e.dataTransfer.effectAllowed = 'move';
		if (item === dragging.value) {
			return;
		}
		const newItems = index || index === 0 ? [...dataForm.value.attr[index].attrValue] : [...dataForm.value.sliderImages];
		const src = newItems.indexOf(dragging.value);
		const dst = newItems.indexOf(item);
		newItems.splice(dst, 0, ...newItems.splice(src, 1));
		if (index || index === 0) {
			dataForm.value.attr[index].attrValue = newItems;
		} else {
			dataForm.value.sliderImages = newItems;
		}
	}
};
// 删除属性
const handleClose = (item: any, index: number) => {
	item.splice(index, 1);
};
// 添加属性
const createAttr = (num: number, idx: number) => {
	if (!num) return useMessage().error('请添加属性');
	isAttr.value = true;
	if (num) {
		dataForm.value.attr[idx].attrValue.push(num);
		let hash: any = {};
		dataForm.value.attr[idx].attrValue = dataForm.value.attr[idx].attrValue.reduce(function (item, next) {
			/* eslint-disable */
			hash[next] ? '' : (hash[next] = true && item.push(next));
			return item;
		}, []);
		dataForm.value.attr[idx].inputVisible = false;
	} else {
	}
};
// 规格数据
const formDynamic = reactive({
	attrsName: '',
	attrsVal: '',
});
// const dataForm = ref(Object.assign({}, defaultObj));
const clearAttr = () => {
	isAttr.value = true;
	formDynamic.attrsName = '';
	formDynamic.attrsVal = '';
};
// 添加规则名称
const createAttrName = () => {
	isAttr.value = true;
	if (formDynamic.attrsName && formDynamic.attrsVal) {
		const data: attrItem = {
			attrName: formDynamic.attrsName,
			attrValue: [formDynamic.attrsVal],
		};
		console.log('data', data);
		dataForm.value.attr.push(data);
		console.log('dataForm.value', dataForm.value);
		let hash: any = {};
		dataForm.value.attr = dataForm.value.attr.reduce(function (item: any, next: attrItem) {
			/* eslint-disable */
			hash[next.attrName] ? '' : (hash[next.attrName] = true && item.push(next));
			return item;
		}, []);
		clearAttr();
		isBtn.value = false;
	} else {
		useMessage().error('请添加完整的规格！');
	}
};
// 添加按钮
const addBtn = () => {
	clearAttr();
	isBtn.value = true;
};
// 取消
const offAttrName = () => {
	isBtn.value = false;
};
// 选择规格
const onChangeSpec = (num: boolean) => {
	isAttr.value = true;
	if (num) {
		handleRemoveAttr(0);
	}
};

// 点击商品图
const modalPicTap = (tit: any, num: any, i?: any, status?: any) => {
	if (isDisabled.value) return;
	//   this.$modalUpload(
	//     function (img) {
	//       if (!img) return;
	//       if (tit === '1' && !num) {
	//         _this.dataForm.image = img[0].sattDir;
	//         _this.OneAttrValue[0].image = img[0].sattDir;
	//       }
	//       if (tit === '2' && !num) {
	//         if (img.length > 10) return this.$message.warning('最多选择10张图片！');
	//         if (img.length + _this.dataForm.sliderImages.length > 10)
	//           return this.$message.warning('最多选择10张图片！');
	//         img.map((item) => {
	//           _this.dataForm.sliderImages.push(item.sattDir);
	//         });
	//       }
	//       if (tit === '1' && num === 'dan') {
	//         _this.OneAttrValue[0].image = img[0].sattDir;
	//       }
	//       if (tit === '1' && num === 'duo') {
	//         _this.ManyAttrValue[i].image = img[0].sattDir;
	//       }
	//       if (tit === '1' && num === 'pi') {
	//         _this.oneFormBatch[0].image = img[0].sattDir;
	//       }
	//     },
	//     tit,
	//     'content',
	//   );
};
// 计算原价 = 价格 + 积分换算
const calculatePrice = (price: number, score: any) => {
	const p = price || 0;
	const s = score ? score / 100 : 0;
	return (p + s).toFixed(2);
};
const showInput = (item: any) => {
	item.inputVisible = true;
};

// 删除表格中的属性
const delAttrTable = (index: number) => {
	ManyAttrValue.value.splice(index, 1);
};
// 删除视频；
const delVideo = () => {
	videoLink.value = '';
};
const manyFormValidate = ref<any[]>([]);
// 删除规格
const handleRemoveAttr = (index: number) => {
	isAttr.value = true;
	dataForm.value.attr.splice(index, 1);
	manyFormValidate.value.splice(index, 1);
};
// 批量添加数据
const batchAdd = () => {
	for (const val of ManyAttrValue.value) {
		if (oneFormBatch.value[0].image) val.image = oneFormBatch.value[0].image;
		if (oneFormBatch.value[0]?.price > 0) val.price = oneFormBatch.value[0].price;
		if (oneFormBatch.value[0]?.cost > 0) val.cost = oneFormBatch.value[0].cost;
		if (oneFormBatch.value[0]?.scorePrice > 0) val.scorePrice = oneFormBatch.value[0].scorePrice;
		if (oneFormBatch.value[0].id != null) val.id = oneFormBatch.value[0].id;
		if (oneFormBatch.value[0].stock >= 0) val.stock = oneFormBatch.value[0].stock;
		if (oneFormBatch.value[0].weight > 0) val.weight = oneFormBatch.value[0].weight;
		if (oneFormBatch.value[0].volume > 0) val.volume = oneFormBatch.value[0].volume;
		if (oneFormBatch.value[0]?.vipPrice > 0) val.vipPrice = oneFormBatch.value[0].vipPrice;
		if (oneFormBatch.value[0]?.vipScorePrice > 0) val.vipScorePrice = oneFormBatch.value[0].vipScorePrice;
	}
};
// 选择数字藏品（打开弹框）
const chooseDigitizeCollection = (record: any, rowIndex: number) => {
	console.log('数字藏品', record, rowIndex);
	const obj = {
		relatedId: record.id || 'index-' + rowIndex,
		defaultData: record.bindCollection ? record.bindCollection : null,
	};
	chooseCollectionRef.value.openDialog(obj);
};
// 选择的返还的优惠券数据
const chooseReturnedCoupon = (data: any) => {
	console.log('优惠券选择', data);
	console.log('优惠券选择', data[0]);
	dataForm.value.couponIds = [];
	dataForm.value.coupons = data;
	data.map((item: any) => {
		dataForm.value.couponIds.push(item.id);
	});
};
// 选择绑定的优惠券数据
const chooseCoupon = (data: any) => {
	console.log('绑定的优惠券数据', data[0]);
	console.log('couponForm', couponForm.value);

	if (data[0].state == 'ManyAttrValue') {
		ManyAttrValue.value[couponForm.value.index].couponId = data[0].id;
		ManyAttrValue.value[couponForm.value.index].couponName = data[0].name;
	} else {
		OneAttrValue.value[couponForm.value.index].couponId = data[0].id;
		OneAttrValue.value[couponForm.value.index].couponName = data[0].name;
	}
	console.log('OneAttrValue', OneAttrValue.value);
	console.log('ManyAttrValue', ManyAttrValue.value);
	couponForm.value = { index: 0, state: '' };
	// data[0].state
	// couponId
	// seeVirtually(couponForm.value.index, 'ManyAttrValue', 0, 3);
};
// 选择数字藏品确认
const chooseCollectionOk = (data: any) => {
	console.log('选择数字藏品确认', data);
	if (!data || data.selectedRows?.length < 1) {
		return;
	}

	const selectedObj = data.selectedRows[0];
	let id = null;
	let rowIndex = 0;
	if (data.relatedId.toString().includes('index-')) {
		rowIndex = data.relatedId.match(/\d+/)[0];
	} else {
		id = data.relatedId;
	}
	// console.log('当前回调选中行和索引', id, rowIndex);

	const collectionData = {
		id: selectedObj.id,
		name: selectedObj.name,
		code: selectedObj.code,
		limitType: data.limitType,
		limitDay: data.limitDay,
	};

	if (dataForm.value.specType == false) {
		// 单规格
		console.log('回填数据', collectionData);
		OneAttrValue.value[0].bindCollection = collectionData;
	} else {
		// 多规格
		if (id) {
			// 有id时匹配id修改表格值
			ManyAttrValue.value.forEach((item: any, index: number) => {
				if (item.id == id) {
					ManyAttrValue.value[index].bindCollection = collectionData;
				}
			});
		} else {
			// 无id时根据索引匹配修改表格值
			ManyAttrValue.value[rowIndex].bindCollection = collectionData;
		}
	}
	// 修改藏品后手动刷新表格，否则某些情况下显示不是最新数据
	tableKey.value = new Date().getTime(); // 刷新表格
};
// 添加卡密
// const setCardId = (row: any, index: number) => {
// 	console.log('OneAttrValue', OneAttrValue.value);
// 	cardIdDialog.value = true;
// };

const closeDialog = () => {
	cardRef.value.resetFields();
	cardIdDialog.value = false;
};
const closeCouponDialog = () => {
	couponFormDialoRef.value.resetFields();
	couponDialog.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			console.log('cardForm', cardForm.value);
			if (cardForm.value.state == 'OneAttrValue') {
				OneAttrValue.value[cardForm.value.index].cdkeyId = cardForm.value.cdkeyId;

				cardList.value.find((item) => {
					if (item.id == cardForm.value.cdkeyId) {
						OneAttrValue.value[cardForm.value.index].cdkeyLibraryName = item.name;
					}
				});
			} else {
				ManyAttrValue.value[cardForm.value.index].cdkeyId = cardForm.value.cdkeyId;
				cardList.value.find((item) => {
					if (item.id == cardForm.value.cdkeyId) {
						ManyAttrValue.value[cardForm.value.index].cdkeyLibraryName = item.name;
					}
				});
			}
			console.log('OneAttrValue', OneAttrValue.value);
			console.log('ManyAttrValue', ManyAttrValue.value);
			cardIdDialog.value = false;
		}
	});
};
const onSubmitCoupon = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			console.log('couponForm', couponForm.value);
			if (couponForm.value.state == 'OneAttrValue') {
				OneAttrValue.value[couponForm.value.index].couponId = couponForm.value.couponId;
				OneAttrValue.value[couponForm.value.index].couponName = couponForm.value.couponId;
			} else {
				ManyAttrValue.value[couponForm.value.index].couponId = couponForm.value.couponId;
				ManyAttrValue.value[couponForm.value.index].couponName = couponForm.value.couponId;
			}
			console.log('OneAttrValue', OneAttrValue.value);
			console.log('ManyAttrValue', ManyAttrValue.value);
			couponDialog.value = false;
		}
	});
};
</script>
<style lang="scss" scoped>
.header {
	margin-bottom: 20px;
	.el-card {
		padding: 0;
	}
}
.headerTitle {
	font-size: 18px;
}
.body {
	padding: 20px 0;
}
.card-form {
	width: 50%;
	margin: 0 20px;
}
.card-title {
	font-size: 18px;
	font-weight: 600;
}
.from-tips {
	font-size: 12px;
	color: #909399;
	line-height: 12px;
	text-align: left;
	margin-top: 14px;
}
.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
.input-new-tag {
	width: 150px;
	margin-left: 10px;
	vertical-align: bottom;
}
.pictrue {
	width: 60px;
	height: 60px;
	border: 1px dotted rgba(0, 0, 0, 0.1);
	// margin-right: 10px;
	margin: auto;
	position: relative;
	cursor: pointer;
	img {
		width: 100%;
		height: 100%;
	}
	video {
		width: 100%;
		height: 100%;
	}
}
.acea-row {
	display: -webkit-box;
	display: -moz-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-lines: multiple;
	-moz-box-lines: multiple;
	-o-box-lines: multiple;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	/* 辅助类 */
}

.acea-row.row-middle {
	-webkit-box-align: center;
	-moz-box-align: center;
	-o-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
}

.acea-row.row-top {
	-webkit-box-align: start;
	-moz-box-align: start;
	-o-box-align: start;
	-ms-flex-align: start;
	-webkit-align-items: flex-start;
	align-items: flex-start;
}

.acea-row.row-bottom {
	-webkit-box-align: end;
	-moz-box-align: end;
	-o-box-align: end;
	-ms-flex-align: end;
	-webkit-align-items: flex-end;
	align-items: flex-end;
}

.acea-row.row-center {
	-webkit-box-pack: center;
	-moz-box-pack: center;
	-o-box-pack: center;
	-ms-flex-pack: center;
	-webkit-justify-content: center;
	justify-content: center;
}

.acea-row.row-right {
	-webkit-box-pack: end;
	-moz-box-pack: end;
	-o-box-pack: end;
	-ms-flex-pack: end;
	-webkit-justify-content: flex-end;
	justify-content: flex-end;
}

.acea-row.row-left {
	-webkit-box-pack: start;
	-moz-box-pack: start;
	-o-box-pack: start;
	-ms-flex-pack: start;
	-webkit-justify-content: flex-start;
	justify-content: flex-start;
}

.acea-row.row-between {
	-webkit-box-pack: justify;
	-moz-box-pack: justify;
	-o-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
}

.acea-row.row-around {
	justify-content: space-around;
	-webkit-justify-content: space-around;
}

.acea-row.row-column-around {
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	justify-content: space-around;
	-webkit-justify-content: space-around;
}

.acea-row.row-column {
	-webkit-box-orient: vertical;
	-moz-box-orient: vertical;
	-o-box-orient: vertical;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}

.acea-row.row-column-between {
	-webkit-box-orient: vertical;
	-moz-box-orient: vertical;
	-o-box-orient: vertical;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-box-pack: justify;
	-moz-box-pack: justify;
	-o-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
}

/* 上下左右垂直居中 */
.acea-row.row-center-wrapper {
	-webkit-box-align: center;
	-moz-box-align: center;
	-o-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
	-webkit-box-pack: center;
	-moz-box-pack: center;
	-o-box-pack: center;
	-ms-flex-pack: center;
	-webkit-justify-content: center;
	justify-content: center;
}

/* 上下两边居中对齐 */
.acea-row.row-between-wrapper {
	-webkit-box-align: center;
	-moz-box-align: center;
	-o-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
	-webkit-box-pack: justify;
	-moz-box-pack: justify;
	-o-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
}
//表单内输入框宽度
.from-ipt-width {
	width: 460px;
}
.upload-demo {
	display: inline-block !important;
	float: left;
}
.iview-video-style {
	width: 460px;
	height: 180px;
	border-radius: 10px;
	background-color: #707070;
	margin-top: 10px;
	position: relative;
	overflow: hidden;
}

.iview-video-style .iconv {
	color: #fff;
	line-height: 180px;
	width: 50px;
	height: 50px;
	display: inherit;
	font-size: 26px;
	position: absolute;
	top: -74px;
	left: 50%;
	margin-left: -25px;
}

.iview-video-style .mark {
	position: absolute;
	width: 100%;
	height: 30px;
	top: 0;
	background-color: rgba(0, 0, 0, 0.5);
	text-align: center;
}
::v-deep(.el-upload) {
	width: 100%;
}
:deep(.ratio .el-input-number__decrease) {
	display: none;
}
// 抵扣
:deep(.ratio .el-input-number__increase) {
	display: none;
}
</style>
<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
