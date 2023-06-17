<script>
	import { getUser, getParams } from '@/utils/auth'
	import datas from '@/utils/datas'
	export default {
		onLaunch: async function(){
			console.log('App Launch')
			//初始化静态数据
			this.$store.commit('setDatas', datas)
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setParams', getParams())
			
			//异步请求参数
			let resParam = await this.$api.getAsync("/param/getList/")
			if(resParam && resParam.code == 20000){
				this.$store.commit('setParams', resParam.data)
			}
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('comm.css');

	page {
		background-color: #151A2F;
	}
	
</style>
