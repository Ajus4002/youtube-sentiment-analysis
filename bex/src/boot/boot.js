import VueCompositionAPI from '@vue/composition-api'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ( { app, router, Vue } ) => {
  Vue.use(VueCompositionAPI)
}
