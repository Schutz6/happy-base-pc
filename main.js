import App from './App'
import messages from './locale/index'
import VueI18n from 'vue-i18n'
import Api from './api/index'
import store from './store/index'

let i18nConfig = {
	silentFallbackWarn: true,
	locale: uni.getLocale(),// 获取已设置的语言
	fallbackLocale: 'zh-Hans',
	messages
}

import Vue from 'vue'

Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
Vue.prototype.$api = Api

App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
