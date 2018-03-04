<template>
  <section class="container">
    <el-row>
      <el-col :span="24" style="display: flex;  justify-content: center;  align-items: center;">
        <video width="auto" height="auto" controls style="max-width: 100%">
          <source :src="primera" type="video/mp4">
        </video>
      </el-col>
      <el-col :span="24">
        <el-table class="tablastreaming"
          :data="listapelis"
          style="width: 100%; color: gray">
          <el-table-column class="columna"
            prop="peli"
            label="Video"
            style="width: 100%; " sortable>
          </el-table-column>
          <el-table-column
           label="ver">
           <template slot-scope="scope">
               <el-button
                 size="mini"
                 type="success"
                 :data-link="peli"
                @click="ponervideo(scope.row.peli)" >Ver</el-button>
           </template>
         </el-table-column>
         <el-table-column
          label="Copiar">
          <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                :data-link="peli"
                @click="copiar(scope.row.peli)"
                >Copia</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import { mapState } from 'vuex'

export default {
  layout: 'streaming',
  computed: mapState([
    'listapelis'
  ]),
  head () {
    return {
      title: 'Streaming'
    }
  },
  created () {
    this.$store.commit('validateuser')
  },
  async asyncData () {
    let { data } = await axios.get('/api/filesstreaming')

    return { listapelis: data, primera: '/api/video/' + data[0].peli, textocopiar: '' }
  },
  methods: {
    ponervideo (peli) {
      this.primera = '/api/video/' + peli
      var video = document.getElementsByTagName('video')[0]
      video.load()
    },
    copiar (peli) {
      this.textocopiar = encodeURI('http://' + location.host + '/api/video/' + peli)
      var copiado = this.$copyText(this.textocopiar).then(function (e) {
        return true
      }, function (e) {
        return false
      })
      if (copiado) {
        this.$notify({
          title: 'Copiado',
          message: 'Copiado enlace con exito',
          type: 'success'
        })
      } else {
        this.$notify({
          title: 'Error',
          message: 'Error al copiar',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
video::-internal-media-controls-download-button {
    display:none;
}

video::-webkit-media-controls-enclosure {
    overflow:hidden;
}

video::-webkit-media-controls-panel {
    width: calc(100% + 30px); /* Adjust as needed */
}
</style>
