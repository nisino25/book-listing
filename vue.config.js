const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: "Book library",
    themeColor: "#4A90E2",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    manifestOptions: {
      short_name: "VuePWA",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      icons: [
        {
          src: "/img/icons/favicon.png",
          type: "image/png"
        },
        {
          src: "/img/icons/favicon.png",
          type: "image/png"
        }
      ]
    }
  }
});


