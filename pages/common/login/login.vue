<template>
	<view class="overflow-hidden width-max height-max">
		<view class="height-max">
			<view class="login-box">
				<view class="logo">
					<image :src="params.logo"></image>
				</view>
				<view class="title">欢迎来到{{params.siteName}}</view>
				<uni-forms ref="form" label-position="top" :border="false" :modelValue="loginForm" :rules="loginRules">
					<uni-forms-item name="username">
						<template v-slot:label>
							<view class="label">账号</view>
						</template>
						<view class="item d-flex">
							<view class="area-code d-flex">
								<picker v-if="arrayAreaCode.length>0" @change="changeAreaCode" :value="indexAreaCode" :range="arrayAreaCode" range-key="text">
									<view class="d-flex">
										{{arrayAreaCode[indexAreaCode].text}}
										<image src="@/static/login/icon-down.png"></image>
									</view>
								</picker>
							</view>
							<view style="width: 1px;height: 16px;background-color: #999;margin: 0 10px;"></view>
							<uni-easyinput type="text" trim="both" :styles="styles" :placeholderStyle="placeholderStyle" v-model="loginForm.username" :inputBorder="false" placeholder="请输入手机号" />
						</view>
					</uni-forms-item>
					<view class="divider"></view>
					<uni-forms-item name="password">
						<template v-slot:label>
							<view class="label">密码</view>
						</template>
						<view class="item d-flex">
							<uni-easyinput type="password" trim="both" :styles="styles" :placeholderStyle="placeholderStyle" v-model="loginForm.password" :inputBorder="false" placeholder="请输入密码" />
						</view>
					</uni-forms-item>
					<view class="divider"></view>
				</uni-forms>
				<view class="btns">
					<view class="d-flex-center btn btn1" @click="handleLogin">登录</view>
					<navigator url="/pages/common/register/register" open-type="redirect">
						<view class="d-flex-center btn btn2">注册</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { setToken, removeToken } from '@/utils/auth'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				loading: false,
				loginForm: {
					area: '86',
					username: '',
					password: '',
					invite_code: ''
				},
				loginRules: {
					username: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
				styles: {
					color: '#fff',
					backgroundColor: 'transparent'
				},
				placeholderStyle: "font-size:16px;color: #999;",
				indexAreaCode: 0,
				arrayAreaCode: [{"text": "+86", "value": "86"}]
			}
		},
		computed: {
			...mapGetters(['params'])
		},
		async onLoad() {
			let username = uni.getStorageSync("UserName")
			if(username){
				//初始化账号
				this.loginForm.username = username
			}
			//获取参数设置
			let res = await this.$api.getAsync("/param/getList/")
			if(res.code == 20000){
				this.$store.commit('setParams', res.data)
			}
			//获取区号列表
			this.$api.post("/dict/getList/", {"name": "Areacode"}).then(res => {
				if(res.data.length > 0){
					this.arrayAreaCode = res.data
					this.loginForm.area = this.arrayAreaCode[0].value
				}
			})
		},
		methods: {
			//变更区号
			changeAreaCode(e){
				this.indexAreaCode = e.detail.value
				this.loginForm.area = this.arrayAreaCode[this.indexAreaCode].value
			},
			//登录
			handleLogin() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						//保存账号
						uni.setStorageSync("UserName", this.loginForm.username)
						this.loading = true
						uni.showLoading({
							title: '正在登录'
						})
						this.$api.post("/login/", this.loginForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								//令牌token
								setToken(res.data.token)
								uni.showToast({
									title: "登录成功",
									icon: 'success'
								})
								//获取用户信息
								this.$store.dispatch('getUserInfo').then(res => {
									//跳转首页
									setTimeout(()=>{
										uni.reLaunch({
											url: '/pages/index/index'
										});
									}, 1000)
								})
							} else if (res.code == 10005) {
								uni.showToast({
									title: "账号错误",
									icon: 'error'
								})
							} else if (res.code == 10006) {
								uni.showToast({
									title: "密码错误",
									icon: 'error'
								})
							} else if (res.code == 100061) {
								uni.showToast({
									title: "账号已锁定",
									icon: 'error'
								})
							} else {
								uni.showToast({
									title: "登录失败",
									icon: 'error'
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.login-box{
		padding: 114px 48px 0 48px;
		
		.logo{
			image{
				width: 147px;
				height: 28px;
			}
		}
		
		.title{
			color: #fff;
			font-size: 24px;
			padding-top: 8px;
			padding-bottom: 48px;
		}
		
		.divider{
			width: 100%;
			height: 1px;
			background: rgba(255,255,255,0.2);
		}
		
		.label{
			font-size: 20px;
			font-weight: 600;
			color: #FFFFFF;
			padding: 20px 0 10px 0;
		}
		
		.item{
			.area-code{
				color: #fff;
				font-size: 16px;
				
				image{
					width: 24px;
					height: 24px;
				}
			}
		}
		
		.btns{
			padding-top: 50px;
			
			.btn{
				height: 44px;
				border-radius: 10px;
				color: #fff;
				font-size: 16px;
				margin-bottom: 20px;
			}
			.btn1{
				background: linear-gradient(256deg, #007FFF 0%, #00E0FF 100%);
			}
			.btn2{
				background: rgba(255,255,255,0.2);
			}
		}
	}
</style>
