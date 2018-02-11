<template>
  <header>
    <el-menu   mode="horizontal"  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <nuxt-link to="/"><el-menu-item index="1">NewPct Total</el-menu-item></nuxt-link>
      <nuxt-link v-if="this.$store.state.streaming" to="streaming"><el-menu-item index="2">Streaming</el-menu-item></nuxt-link>
      <!--<el-menu-item index="2"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>-->
      <el-menu-item v-if="this.$store.state.authUser"  @click="loggout" index="5" style="float:right;"><i class="el-icon-remove"></i></el-menu-item>
      <nuxt-link to="config"><el-menu-item index="4" style="float:right;"><i class="el-icon-setting"></i></el-menu-item></nuxt-link>

    </el-menu>
  </header>
</template>

<script>
import axios from '~/plugins/axios'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'streaming'
  ]),
  async created () {
    let data = await axios.get('http://' + location.hostname + ':3001/streaming')
    this.$store.commit('changestreaming', data.data.active)
  },
  methods: {
    loggout () {
      this.$store.commit('SET_USER', false)
    }
  }
}
</script>
