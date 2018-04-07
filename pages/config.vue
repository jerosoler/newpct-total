<template>
  <section class="container">
  <el-card class="box-card">
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <h2 style="float:left;">Configuración Series/Pelis</h2>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <el-button type="success" style="float:right;" @click="dialogFormVisible = true"><i class="el-icon-plus"></i> New</el-button>
      </div></el-col>
    </el-row>



    <el-dialog title="Nuevo serie/peli" :visible.sync="dialogFormVisible">
      <el-form @submit.native.prevent>
        <el-form-item label="Titulo" >
          <el-input v-model="newtitle" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="Filtros" >
          <el-tag
            :key="tag"
            v-for="tag in newtags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="success" @click="saveNew">Confirm</el-button>
      </span>
    </el-dialog>


    <el-table
      :data="lista"
      style="width: 100%">
      <el-table-column
        prop="titulo"
        label="Tiulo"
        width="180" sortable>
      </el-table-column>

      <el-table-column
        label="Filtros"
        >
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" v-for="(filtro, index) in scope.row.filtro" :key="index">{{ filtro }}</el-tag>
            </div>
        </template>
      </el-table-column>
      <el-table-column
       label="Eliminar">
       <template slot-scope="scope">
           <el-button
             size="mini"
             type="danger"
            @click="handleDelete(scope.$index, scope.row.id)" >Eliminar</el-button>
       </template>
     </el-table-column>
    </el-table>
  </el-card>

  <br><br>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple">
        <h2 style="float:left;">Última busqueda</h2>

      </div></el-col>
    </el-row>
    Última busqueda encontrada: <b>{{ ultimabusqueda.fecha }}</b>
  </el-card>

  <br><br>
  <el-card class="box-card">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple">
        <h2 style="float:left;">Configurar otra URL</h2>

      </div></el-col>
    </el-row>
    <el-select v-model="value" @change="selectfeed(value)" placeholder="Select">
    <el-option
      v-for="item in options"
      :label="item.label"
      :value="{url: item.url, feed: item.feed, value: item.label}">
    </el-option>
    </el-select>
    <br><br>
    Url busquedas: <el-input  v-model="urlsearch.url" placeholder="Please input"  ></el-input>
    <br><br>
    Url Feed: <el-input  v-model="urlsearch.feed" placeholder="Please input" ></el-input>
    <br><br>
    <br><br>
    <el-button @click="saveurlsearch" type="success">Guardar</el-button>
  </el-card>

    <br><br>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple">
          <h2 style="float:left;">Telegram</h2>

        </div></el-col>
      </el-row>
      Telegram API Token: <el-input  v-model="telegram.api" placeholder="Please input"  ></el-input>
      <br><br>
      Telegram User: <el-input  v-model="telegram.user" placeholder="Please input" ></el-input>
      <br><br>
      Activo:
      <el-switch v-model="telegram.active"></el-switch>
      <br><br>
      <el-button @click="savetelegram" type="success">Guardar</el-button>
    </el-card>

    <br><br>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple">
          <h2 style="float:left;">Transmission</h2>

        </div></el-col>
      </el-row>
      Transmission Usuario: <el-input  v-model="transmission.user" placeholder="Please input"  ></el-input>
      <br><br>
      Transmission Password: <el-input  v-model="transmission.pass" placeholder="Please input" ></el-input>
      <br><br>
      Activo:
      <el-switch v-model="transmission.active"></el-switch>
      <br><br>
      <el-button @click="savetransmission" type="success">Guardar</el-button>
    </el-card>

    <br><br>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple">
          <h2 style="float:left;">Streaming dir</h2>

        </div></el-col>
      </el-row>
      Directorio streaming: <el-input  v-model="streaming.dir" placeholder="/var/media/directorio/"  ></el-input>
      <br><br>
      Activo:
      <el-switch v-model="streaming.active"></el-switch>
      <br><br>
      <el-button @click="savestreaming" type="success">Guardar</el-button>
    </el-card>

    <br><br>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple">
          <h2 style="float:left;">Private</h2>

        </div></el-col>
      </el-row>
      Usuario privado: <el-input  v-model="privateapp.user" placeholder="Please input"  ></el-input>
      <br><br>
      Password: <el-input  v-model="privateapp.pass" placeholder="Please input" ></el-input>
      <br><br>
      Activo:
      <el-switch v-model="privateapp.active"></el-switch>
      <br><br>
      <el-button @click="saveprivate" type="success">Guardar</el-button>
    </el-card>
    <br><br>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple">
          <h2 style="float:left;">Backup</h2>

        </div></el-col>
      </el-row>
      <el-button @click="backup" type="success">Backup</el-button>
    </el-card>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    let { data } = await axios.get('http://' + location.hostname + ':3001/lista')
    let data2 = await axios.get('http://' + location.hostname + ':3001/telegram')
    let data3 = await axios.get('http://' + location.hostname + ':3001/transmission')
    let data4 = await axios.get('http://' + location.hostname + ':3001/streaming')
    let data5 = await axios.get('http://' + location.hostname + ':3001/privateapp')
    let data6 = await axios.get('http://' + location.hostname + ':3001/ultimabusqueda')
    let data7 = await axios.get('http://' + location.hostname + ':3001/urlsearch')
    return { lista: data, inputVisible: false, inputValue: '', dialogFormVisible: false, newtitle: '', newtags: [], telegram: data2.data, transmission: data3.data, streaming: data4.data, privateapp: data5.data, ultimabusqueda: data6.data, urlsearch: data7.data }
  },
  data () {
    return {
      options: [{
        value: 'Option1',
        label: 'Tv sin pagar',
        url: 'http://tvsinpagar.com/',
        feed: 'http://tvsinpagar.com/feed'
      }, {
        value: 'Option2',
        label: 'Descargas2020',
        url: 'http://descargas2020.com/',
        feed: 'http://descargas2020.com/feed'
      }, {
        value: 'Option3',
        label: 'Tu mejor torrent',
        url: 'http://tumejortorrent.com/',
        feed: 'http://tumejortorrent.com/feed'
      }, {
        value: 'Option4',
        label: 'Torrentrapid',
        url: 'http://torrentrapid.com/',
        feed: 'http://torrentrapid.com/feed'
      }],
      value: ''
    }
  },
  head () {
    return {
      title: 'Configuración'
    }
  },
  created () {
    this.$store.commit('validateuser')
  },
  methods: {
    saved () {
      this.$notify({
        title: 'Salvado',
        message: 'Guardado con exito',
        type: 'success'
      })
    },
    removed () {
      this.$notify({
        title: 'Borrado',
        message: 'Borrado con exito',
        type: 'warning'
      })
    },
    handleClose (tag) {
      this.newtags.splice(this.newtags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.newtags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    saveNew: async function () {
      this.dialogFormVisible = false

      var respuesta = await axios.post('http://' + location.hostname + ':3001/lista', {
        titulo: this.newtitle,
        filtro: this.newtags
      }).then(function (response) {
        return true
      })
      if (respuesta) {
        this.newtitle = ''
        this.newtags = []
        this.refreshlist()
        this.saved()
      }
    },
    refreshlist () {
      this.newtitle = ''
      this.tags = []
      axios.get('http://' + location.hostname + ':3001/lista')
        .then(response => {
          this.lista = response.data
          // this.lista = data
        })
    },
    selectfeed: function (value) {
      this.urlsearch.url = value.url
      this.urlsearch.feed = value.feed
      this.value = value.value
    },
    handleDelete: async function (index, row) {
      var respuesta = await axios.delete('http://' + location.hostname + ':3001/lista/' + row)
        .then(function (response) {
          return true
        })
      if (respuesta) {
        this.refreshlist()
        this.removed()
      }
    },
    saveurlsearch: async function () {
      this.dialogFormVisible = false

      var respuesta = await axios.post('http://' + location.hostname + ':3001/urlsearch', {
        url: this.urlsearch.url,
        feed: this.urlsearch.feed
      }).then(function (response) {
        return true
      })
      if (respuesta) {
        this.saved()
      }
    },
    savetelegram: async function () {
      this.dialogFormVisible = false

      var respuesta = await axios.put('http://' + location.hostname + ':3001/telegram', {
        api: this.telegram.api,
        user: this.telegram.user,
        active: this.telegram.active
      }).then(function (response) {
        return true
      })
      if (respuesta) {
        this.saved()
      }
    },
    savetransmission: async function () {
      this.dialogFormVisible = false

      var respuesta = await axios.put('http://' + location.hostname + ':3001/transmission', {
        user: this.transmission.user,
        pass: this.transmission.pass,
        active: this.transmission.active
      }).then(function (response) {
        return true
      })
      if (respuesta) {
        this.saved()
      }
    },
    saveprivate: async function () {
      this.dialogFormVisible = false

      var respuesta = await axios.put('http://' + location.hostname + ':3001/privateapp', {
        user: this.privateapp.user,
        pass: this.privateapp.pass,
        active: this.privateapp.active
      }).then(function (response) {
        return true
      })
      if (respuesta) {
        this.saved()
        if (this.privateapp.active === false) {
          this.$store.state.authUser = false
        } else {
          this.$store.commit('SET_USER', false)
        }
      }
    },
    savestreaming: async function () {
      this.dialogFormVisible = false
      this.$store.commit('changestreaming', this.streaming.active)
      var respuesta = await axios.put('http://' + location.hostname + ':3001/streaming', {
        dir: this.streaming.dir,
        active: this.streaming.active
      }).then(function (response) {
        return true
      })
      if (respuesta) {
        this.saved()
      }
    },
    backup: function () {
      window.open('/api/backup')
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag, .el-button {
    margin-left: 10px;
  }
  .input-new-tag {
    width: 100px;
      margin-left: 10px;
  }

</style>
