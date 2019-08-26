<template>
  <section class="container">
    <busqueda/>
    <el-row v-loading="loading" align="bottom" type="flex">
      <div v-if="lista.lista.length > 0">
        <el-col  :xs="12" :sm="8" :md="3" v-for="(list, index) in lista.lista" :key="index"  class="pelis"    >
          <el-card :body-style="{ padding: '0px' }">
            <div class="triangulo" @click="infopage(list[1], list[0])"><i class="el-icon-info"></i></div>
            <img v-if="list[3] === 'http://www.newpct.com/images/no_imagen.jpg'" src="~/assets/img/nophoto.jpg" class="image">
            <img v-else :src="list[3]" class="image">
            <div style="padding: 14px;" class="bodycard">
              <span v-html="list[0]" style="color: black !important"></span>

            </div>
          </el-card>
          <div class="bottom">
            <div v-if="list[2] === -1">
              <el-button class="botonelement" @click="addtorrent(list[1])" type="success">Descargar</el-button>
            </div>
            <div v-else-if="list[2] != -1">
              <el-button class="botonelement"  @click="searchserie(list[1])" type="warning">Ver</el-button>
            </div>
          </div>
        </el-col>
      </div>
      <div v-else>No encontrado</div>
    </el-row>
    <el-row>
    <div class="divpagina" v-if="!this.$store.state.serie">
      <div v-for="(list, index) in lista.paginacion" :key="index" class="paginacion">
        <div class="number" :class="list" v-if="list != '...'" @click="searchpage(list)">{{list}}</div>
        <div class="nonumber" v-else >{{list}}</div>
      </div>
    </div>
    <div class="divpagina" v-else>
      <div v-for="(list, index) in lista.paginacion" :key="index" class="paginacion">
        <div class="number" :class="list" v-if="list != '...'" @click="searchpageserie(list[0])">{{list}}</div>
        <div class="nonumber" v-else >{{list}}</div>
      </div>
    </div>
    </el-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import axios from '~/plugins/axios'
import busqueda from '~/components/busqueda.vue'

export default {
  components: {
    busqueda
  },
  computed: mapState([
    'counter', 'lista', 'loading', 'calidad', 'input', 'serie', 'lastserie'
  ]),
  head () {
    return {
      title: 'NewPct Total'
    }
  },
  async created () {
    this.$store.commit('validateuser')
    this.$store.state.loading = true
    let data = await axios.get('/api/listado', { params: {
      busqueda: '',
      calidad: ''
    }
    })
    this.$store.state.loading = false
    // this.$store.loading = false
    this.$store.state.lista = data.data
    // return { lista: data.data }
  },
  methods: {
    async addtorrent (page) {
      var respuesta = await axios.post('/api/addtorrent', { params: {
        url: page
      }
      })
        .then(function (response) {
          return response
        })
      if (respuesta.data.error === 'NO') {
        this.$notify({
          title: 'Añadido',
          message: 'Añadido con exito',
          type: 'success'
        })
      } else {
        this.$notify({
          title: 'Error',
          message: respuesta.data.error,
          type: 'warning'
        })
      }
    },
    async searchpage (page) {
      this.$store.state.loading = true
      let data = await axios.get('/api/listado', { params: {
        busqueda: this.$store.state.input,
        calidad: this.$store.state.calidad,
        page: page
      }
      })
      this.$store.state.loading = false
      this.$store.state.lista = data.data
    },
    async searchpageserie (page) {
      this.$store.state.loading = true
      var seriebuscar = this.$store.state.lastserie
      console.log(this.$store.state.lastserie)
      console.log('--')
      console.log(seriebuscar)
      let data = await axios.get('/api/listadoserie', { params: {
        busquedalista: seriebuscar + '/pg/' + page
      }
      })
      this.$store.state.loading = false
      this.$store.state.lista = data.data
    },
    async searchserie (serie) {
      this.$store.state.loading = true
      this.$store.state.lastserie = serie
      this.$store.state.serie = true
      let data = await axios.get('/api/listadoserie', { params: {
        busquedalista: serie
      }
      })
      this.$store.state.loading = false
      this.$store.state.lista = data.data
    },
    async infopage (page, titulo) {
      titulo = strip(titulo)
      let data = await axios.get('/api/info', { params: {
        page: page
      }
      })
      this.$alert('<iframe width="100%" height="400" src="' + data.data.video + '" frameborder="0" allowfullscreen=""></iframe><br><pre style="white-space: pre-wrap;">' + data.data.descripcion + '</pre>', titulo, {
        confirmButtonText: 'Cerrar',
        dangerouslyUseHTMLString: true,
        callback: action => {
          stopvideo()
        }
      })
    }
  }
}

function strip (html) {
  var tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function stopvideo () {
  var iframe = document.querySelector('iframe')
  var video = document.querySelector('video')
  if (video) {
    video.pause()
  }
  if (iframe) {
    var iframeSrc = iframe.src
    iframe.src = iframeSrc
  }
}
</script>

<style scoped>
.image {
  width: auto;
  display: block;
  min-height: 259px;
  max-height: 259px;
}
.clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  .pelis {
    padding-right: 10px;
    padding-bottom: 20px;

  }
  .bodycard {
    min-height: 150px;
    height: 150px;
  }

  .el-card {
    position: relative;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .container {
    padding: 0% 10%;
  }

  .paginacion .number, .paginacion .nonumber {
    float: left;
    width: 35px;
    height: 35px;
    line-height: 35px;
    color: white;
    background:black;
    text-align:center;
    border-radius: 3px;
    margin-right: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  .paginacion .number.current {
    background: green;
  }

  .paginacion .nonumber {
    background: white;
    color: black;
    cursor: initial;
  }

  .divpagina {
    display: flex;
    justify-content: center;
  }
  .botonelement {
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  }
  .triangulo {
    float: right;
    position: absolute;
    right: 0px;
    cursor: pointer;
    border-right: 20px solid #409eff;
    border-top: 20px solid #409eff;
    border-left: 20px solid transparent;
    border-bottom: 20px solid transparent;
  }
  .triangulo .el-icon-info {
    position: absolute;
    float: right;
    top: -15px;
    right: -15px;
    background: none;
    color: white;
  }

  @media (max-width: 767px) {
  .container {
    padding: 0px;
  }
  .divpagina {
    display:block;
    -webkit-box-pack: initial;
    justify-content: initial;
  }
  .divpagina .paginacion {
    display: inline-block;
  }

  }

</style>
