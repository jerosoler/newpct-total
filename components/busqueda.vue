<template>
  <div>
    <div class="busqueda">
      <el-row>
        <el-col :span="18">
          <el-input class="input" placeholder="Please input" v-model="inputval"  @keyup.enter.native="searching"></el-input>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-select :value="calidad" placeholder="Select" @change="calidadchange">
            <el-option value="">Seleccione calidad del contenido</el-option>
            <el-option value="HDTV" selected="selected">HDTV</el-option>
            <el-option value="HDTV 720p AC3 5.1">HDTV 720p AC3 5.1</el-option>
            <el-option value="HDTV 1080p AC3 5.1">HDTV 1080p AC3 5.1</el-option>
            <el-option value="DVDRIP">DVDRip</el-option>
            <el-option value="DVDRIP AC3 5.1">DVDRIP AC3 5.1</el-option>
            <el-option value="BLuRayRip">BLuRayRip</el-option>
            <el-option value="BluRayRip AC3 5.1">BluRayRip AC3 5.1</el-option>
            <el-option value="BluRay 720p">BluRay 720p</el-option>
            <el-option value="BluRay 1080p">BluRay 1080p</el-option>
            <el-option value="BluRay MicroHD">BluRay MicroHD</el-option>
            <el-option value="BluRay 3D 1080p">BluRay 3D 1080p</el-option>
            <el-option value="HDTV-Screener">HDTV-Screener</el-option>
            <el-option value="TS-Screener">TS-Screener</el-option>
            <el-option value="CAMRIP">CAMRIP</el-option>
            <el-option value="DVD-Screener">DVD-Screener</el-option>
            <el-option value="BluRay-Screeener">BluRay-Screeener</el-option>
            <el-option value="DVD5">DVD5</el-option>
            <el-option value="DVD9">DVD9</el-option>
            <el-option value="ISO">ISO</el-option>
            <el-option value="MP3">MP3</el-option>
          </el-select>
        </el-col>
      </el-row>
      <br><br>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'input', 'calidad'
  ]),
  data () {
    return {
      inputval: ''
    }
  },
  methods: {
    async searching (e) {
      this.$store.commit('changesearch', e.target.value)
      this.$store.state.loading = true
      var busquedacorregida
      if (this.$store.state.input === '') {
        busquedacorregida = ''
      } else {
        busquedacorregida = this.$store.state.input
      }
      let data = await axios.get('/api/listado', { params: {
        busqueda: busquedacorregida,
        calidad: this.$store.state.calidad

      }
      })
      this.$store.commit('nuevabusqueda', data.data)
      // this.$store.state.lista = data.data
    },
    async calidadchange (e) {
      this.$store.commit('changecalidad', e)
      this.$store.state.loading = true
      var busquedacorregida
      if (this.$store.state.input === '') {
        busquedacorregida = ''
      } else {
        busquedacorregida = this.$store.state.input
      }
      let data = await axios.get('/api/listado', { params: {
        busqueda: busquedacorregida,
        calidad: this.$store.state.calidad

      }
      })
      this.$store.commit('nuevabusqueda', data.data)
      // this.$store.state.lista = data.data
    }
  }
}
</script>

<style scoped>
.busqueda {
  padding-bottom: 15px;
}
.el-input, .el-select {
  width: 100%
}
</style>
