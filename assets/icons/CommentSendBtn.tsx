import * as React from 'react';
import Svg, {Rect, Defs, Pattern, Use, Image} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <Rect width={17} height={17} fill="url(#pattern0_4365_5)" />
    <Defs>
      <Pattern
        id="pattern0_4365_5"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}>
        <Use xlinkHref="#image0_4365_5" transform="scale(0.0111111)" />
      </Pattern>
      <Image
        id="image0_4365_5"
        width={90}
        height={90}
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADhklEQVR4nO2dv2sUQRTHx9/aqKCgYCOKlgraWIi/GitL7RQV/BFQW/8FFQIWWvgv2FoGFVQ0RoNiIVpoYSw0OW5v3nc24EHyZLiVDeESk8vNvtm594HX73723dt5szNzxiiKoiiKoiiKoqQGM28AcAvAKAAHIAPwmoiuMfMm6etLgjzPdxHRRwDcLYjoJxFdYea10tda60xeTPK8+ArgHDOvkr7u2lGUi6VInpvh486509LXXisAvF2uaJTCn1trj0jfQy1Ah55EoxQ+4pw7KH0vUbNSyShlzwB43Gq19krfU9KiUQpvA3jknNspfW9Ji0YZfix+p9lsbpG+x9RFcxENIro98E1PBaK5KCkTRHR1YJueqkSjjC8Azg5c0yMgmosMH7PWnjGDgpRolPGKiI6a1IlANBcZPgLggEkVacHo3vTsMakhLRfdhf/xTQ+AHSYVpKVi8UAyTU8EMnkZTc9GU1cikMjLKCk/iqZnjakb0vLQW3yuXdMTgTReQfiPFqdMHYhAFvdjDJ7n+WETM9KS0D/Zs34Mbq3db2LEv9GlJSFA05Nl2W4TEwBeSMtBGOHTAO5Za7eZGLDWXpKWggqankajsVlUtJ+I91OWEQjhwBn+C8ANZl4vJtv/vIjonbQMVBPfnXPnmXm1iGzfbVlrLwJ4U3xYTT3DP0Xx4SHLsq1+bOqcu+BrHIAnAL5JC0L/w6+ePWliI9UHQJ3VVodM7GQJPIA5Tc8+Uzds50V7nIiuE9EDInpGRL8jF94movuiI5R+QUTbAZwgoiEAD/0DADAZmfBhkyrU/QFMCcmeMqlCcWX6pKk7tqzdQ/9qd2ylA8BdUzOhx+a8DJ/W5GU4zMzrTGxkOrxToYi5YVkoQ4tBPScU1bbgxaSSn5seJaI8AgGc3KRS8cJ6L33zSHmatJj4T34umqQn/q21l6UlYBA+ZQF4mWgGT0f1cVaXG1REQhk8G/sCmhQkj+iSMASVrIscEVawLttF2BKhC9ERNoN1awXCCtbNQghbInT7W2DBM7qhM2yJYN2iHFgwdNN98Awei2I1Z1VUkLE8L/RglMAZPKFH/YTN4IYeXqXHsVVHgBLR1gMGA4omPTLzvxmth8BWgR5rXBEAbvZQJsb1oO7ejp7/sETJevR8H/5MYUHZ+mcKfcQvlfJLpoqds55mMeHjzzDSvwdRFEVRFEVRFEUxNeEvxZWQp0uzpFIAAAAASUVORK5CYII="
      />
    </Defs>
  </Svg>
);
export default SVGComponent;
