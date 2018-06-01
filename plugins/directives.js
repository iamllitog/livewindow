import Vue from 'vue'

// 点击指定元素外部时触发
Vue.directive('click-outside', {
  bind: function (el, { value }) {
    let onClickOutside = value
    el.handler = function (e) {
      if (el && !el.contains(e.target)) {
        onClickOutside(e)
      }
    }
    document.addEventListener('click', el.handler, true)
  },
  unbind: function (el) {
    document.removeEventListener('click', el.handler, true)
    el.handler = null
  }
})
