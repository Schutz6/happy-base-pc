<template>
	<view class="page">
		
		<scroll-view class="scroll-page-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				首页
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.init()
		},
		computed: {
			...mapGetters(['user'])
		},
		methods: {
			init() {
				
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
