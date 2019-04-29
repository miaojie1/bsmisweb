// 提交 mutations是更改Vuex状态的唯一合法方法
export const setOperation = (state, val) => {
  // state.operation = val
  localStorage.setItem('operation', JSON.stringify(val))
}
