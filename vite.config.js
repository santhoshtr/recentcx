const vue2 = require("vite-plugin-vue2");

module.exports = {
  build: {
    // generate manifest.json in outDir
    manifest: true,
  },
  plugins: [vue2.createVuePlugin()],
};
