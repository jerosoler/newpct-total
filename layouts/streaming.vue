<template>
  <div>
    <el-container>
      <el-header><my-header/></el-header>
      <nuxt/>
      <el-footer><my-footer/></el-footer>
    </el-container>
  </div>
</template>

<script>
import MyHeader from '~/components/Header.vue'
import MyFooter from '~/components/Footer.vue'

export default {
  components: {
    MyHeader, MyFooter
  }
}
</script>

<style scoped>
.el-container, .el-header, .el-footer {
  padding: 0px;
  background: black;
}


</style>
