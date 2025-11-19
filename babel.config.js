module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Your other plugins (if any)
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
