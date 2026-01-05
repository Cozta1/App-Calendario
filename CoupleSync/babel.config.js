module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Habilita o uso de decorators (ex: @field, @date) usados nos Models
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  };
};