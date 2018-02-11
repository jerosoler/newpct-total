<template>
  <section class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Login NewPct Total</span>
      </div>
      <el-input  placeholder="Usuario"  v-model="usuario"></el-input>
      <br><br>
      <el-input  placeholder="*******"  v-model="pass" type="password" ></el-input>
      <br><br>
      <el-button type="success" @click="login" style="width: 100%;">Guardar</el-button>
    </el-card>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  layout: 'login',
  head () {
    return {
      title: 'Login NewPct Total'
    }
  },
  async asyncData () {
    return { usuario: '', pass: '' }
  },
  methods: {
    async login () {
      var respuesta = await axios.post('/api/login', { params: {
        user: this.usuario,
        pass: this.pass
      }
      })
        .then(function (response) {
          return response
        })
      if (respuesta.data.error === 'ERROR') {
        this.$notify({
          title: 'ERROR',
          message: 'Error al authentificar',
          type: 'warning'
        })
      } else {
        this.$store.commit('SET_USER', true)
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 300px;
   height: 260px;
   position: absolute;
   top:0;
   bottom: 0;
   left: 0;
   right: 0;
   margin: auto;
}
</style>
