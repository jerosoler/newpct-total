import Vuex from 'vuex'
import axios from '~/plugins/axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      counter: 0,
      input: '',
      calidad: '',
      serie: false,
      lastserie: '',
      loading: true,
      streaming: false,
      lista: {
        lista: {}
      },
      listapelis: {
        lista: {}
      },
      authUser: false
    },
    mutations: {
      increment (state, number) {
        state.counter += number
        state.counter++
      },
      nuevabusqueda (state, lista) {
        state.loading = false
        state.lista = lista
        state.serie = false
      },
      changesearch (state, search) {
        state.input = search
      },
      changecalidad (state, calidad) {
        state.calidad = calidad
      },
      changestreaming (state, streaming) {
        state.streaming = streaming
      },
      async validateuser (state, user) {
        var respuesta = await axios.get('/api/loginvalido')
          .then(function (response) {
            return response
          })
        if (respuesta.data.error === 'activado') {
          if (state.authUser !== true) {
            this.$router.replace({ path: '/login' })
          }
        } else {
          // this.$router.replace({ path: '/' })
        }
      },
      SET_USER: function (state, user) {
        state.authUser = user
        if (user === true) {
          this.$router.replace({ path: '/' })
        } else {
          this.$router.replace({ path: '/login' })
        }
      }
    }
  })
}

export default createStore
