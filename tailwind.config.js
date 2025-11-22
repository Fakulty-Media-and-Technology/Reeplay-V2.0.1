/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  presets: [require("nativewind/preset")],
  content: [
    './App.{js,jsx,ts,tsx}',
    './Screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './navigator/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        _black: '#000',
        red: '#FF1313',
        grey_100: '#E5E5E5',
        grey_200: '#C4C4C4',
        grey_600: '#565D6D',
        grey_700: '#9095A1',
        grey_white: '#C4C4C4',
        dark_grey: '#757474',
        light_blue: '#565D6D',
        grey_white_90: '#C4C4C4E5',
        dark_gold: '#7B6114',
        green: '#00E3A3',
        yellow: '#FFCC00',
        grey_900: '#383838',
        grey_800: '#848282',
        white: '#FFFFFF',
      },
      fontFamily: {
        LEXEND_400: 'Lexend-Regular',
        LEXEND_500: 'Lexend-Medium',
        LEXEND_600: 'Lexend-SemiBold',
        LEXEND_700: 'Lexend-Bold',
        MANROPE_400: 'Manrope-Regular',
        MANROPE_500: 'Manrope-Medium',
        MANROPE_600: 'Manrope-SemiBold',
        MANROPE_700: 'Manrope-Bold',
        ROBOTO_400: 'Roboto-Regular',
        ROBOTO_500: 'Roboto-Medium',
        ROBOTO_700: 'Roboto-Bold',
        OUTFIT_500: 'Outfit-Medium',
      },
    },
  },
  plugins: [],
}