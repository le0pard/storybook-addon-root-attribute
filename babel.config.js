module.exports = function (api) {
  var validEnv = ['development', 'test', 'production'];
  var currentEnv = api.env();
  var isDevelopmentEnv = api.env('development');
  var isTestEnv = api.env('test');

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(currentEnv) +
      '.'
    );
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: [
              '>0.25%',
              'not ie 11',
              'not op_mini all'
            ]
          },
          forceAllTransforms: true,
          modules: isTestEnv ? 'commonjs' : false,
          useBuiltIns: 'usage',
          corejs: 3
        }
      ],
      [
        '@babel/preset-react',
        {
          development: isDevelopmentEnv || isTestEnv,
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ],
    plugins: [
      [
        '@babel/plugin-transform-regenerator',
        {
          async: false
        }
      ]
    ]
  }
}
