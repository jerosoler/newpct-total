export default function ({ route, store, error }) {
  console.log('auth')
  if (!store.state.authUser) {
    if (route.name !== 'login') {
      store.commit('validateuser')
    }
  }
}
