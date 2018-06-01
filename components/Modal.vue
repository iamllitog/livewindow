<template>
  <div class="mask" v-show="value">
    <div class="modal-content">
      <div class="modal" v-click-outside="close">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {}
  },
  methods: {
    // 关闭模太框
    close () {
      this.$emit('change', false)
    }
  }
}
</script>
<style scoped>
.mask{
  z-index: 2;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  background-color: rgba(55,55,55,.6);;
}
.modal-content{
  position: absolute;
  right: 0;
  left: 0;
  top: 160px;
  text-align: center;
}
.modal{
  display: inline-block;
  background-color: #fff;
}
</style>


