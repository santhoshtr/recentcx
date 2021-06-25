import vue from "@vitejs/plugin-vue";
module.exports = {
  build: {
    // generate manifest.json in outDir
    manifest: true,
  },
  plugins: [vue()],
};
