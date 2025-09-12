const config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeUnknownsAndDefaults: false,
        },
      },
    },
    'prefixIds',
  ],
}

export default config
