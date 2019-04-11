import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters' // 导入响应的模块，*相当于引入了这个组件下所有导出的事例
import * as actions from './actions'
import * as mutations from './mutations'
Vue.use(Vuex)
const state = {
  // 用户权限按钮
  operation: []
}
// 注册上面引入的各大模块
const store = new Vuex.Store({
  // 共同维护的一个状态，state里面可以是很多个全局状态
  state,
  // 获取数据并渲染
  getters,
  // 数据的异步操作
  actions,
  // 处理数据的唯一途径，state的改变或赋值只能在这里
  mutations
})
export default store
