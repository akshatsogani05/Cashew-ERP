module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        "@": require("path").resolve(__dirname, "src"),
      };
      return webpackConfig;
    },
  },
};