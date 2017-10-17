import Vue from 'vue'
import App from './App'
import 'vue-awesome/icons'
import navigation from './components/Navigation.vue'
Vue.component('navigation', navigation)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
