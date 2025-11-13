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

    // ✅ Added react-native-dotenv support
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,          // set to true if you want a .env.example check
        allowUndefined: true, // allow undefined variables without breaking
      },
    ],
  ],
};
