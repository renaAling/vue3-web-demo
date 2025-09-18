<template>
	<div class="content">
		<iframe
			id="unityiframe"
			ref="iframeRef"
			name="iframeContain"
			seamless
			scrolling="yes"
			:src="iframeUrl"
			class="iframe"
		>
		</iframe>
	</div>
</template>

<script lang="ts" name="gs-business" setup>
import { ref, nextTick } from 'vue';
import { Session } from '/@/utils/storage';
const iframeRef = ref(); // 使用 ref 直接绑定到 DOM
const handleMessage = (event: any) => {
	console.log('子页面传过值event', event.data);
	var datalist = event.data;
	if (datalist) {
		sendMessage();
	}
};
const targetDomain = computed(() => {
  return import.meta.env.VITE_IFRAME_DOMAIN;
//    return 'http://192.168.8.120:8001';
});
const token  = ref(Session.get('token'));
// const tenantId = ref(Session.getTenant());
const tenantId = computed(() => {
  return import.meta.env.VITE_TENANT_ID;
//    return 'http://192.168.8.120:8001';
});
const iframeUrl = ref(targetDomain.value + '/culture/decoration/changeTheme/index?token=' + token.value + '&tenantId=' + tenantId.value);
console.log('iframeUrl======', iframeUrl.value);
const sendMessage = () => {
	if (iframeRef.value) {
		//判断他不为空，可根据自己的页面判断
		iframeRef.value.contentWindow.postMessage(
			// 向子页面iframe传递
			'aaa', //传递的参数
			'http://10.1.0.238:88/#/workspace/formsPanel' //iframe的页面地址
		);
	}
};
nextTick(() => {
	window.addEventListener('message', handleMessage);
});
</script>
<style lang="scss" scoped>
.iframe {
	width: 100%;
	 height: calc(100vh - 70px); 
	 border: 0
}

</style>
