export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'users-search-nuxt',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/stylelint-module'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/search/:keyword',
        components: {
          default: resolve(__dirname, 'pages/index'),
        },
      });
    },
  },
};
