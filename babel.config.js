module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': '.',
        },
      },
    ],
    ['nativewind/babel'],
    'react-native-reanimated/plugin',
    'module:react-native-dotenv',
  ],
};
