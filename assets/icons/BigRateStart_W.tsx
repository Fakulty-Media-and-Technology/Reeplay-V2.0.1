import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={32}
    height={31}
    viewBox="0 0 32 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M14.8553 1.30024C15.279 0.281422 16.7223 0.281437 17.1461 1.30025L20.6315 9.68014C20.8102 10.1096 21.2141 10.4031 21.6777 10.4403L30.7246 11.1656C31.8245 11.2537 32.2705 12.6264 31.4324 13.3442L24.5398 19.2486C24.1865 19.5512 24.0321 20.0261 24.1401 20.4785L26.246 29.3066C26.502 30.38 25.3343 31.2282 24.3927 30.6531L16.6474 25.9223C16.2505 25.6799 15.7511 25.6799 15.3542 25.9223L7.6088 30.6531C6.66714 31.2282 5.49951 30.38 5.75553 29.3066L7.86137 20.4785C7.96931 20.0261 7.81502 19.5512 7.46174 19.2486L0.569029 13.3442C-0.268976 12.6264 0.177019 11.2537 1.27692 11.1656L10.3237 10.4403C10.7874 10.4031 11.1913 10.1096 11.37 9.68014L14.8553 1.30024Z"
      fill="url(#paint0_linear_3532_8126)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_3532_8126"
        x1={0.133789}
        y1={0.536133}
        x2={31.8677}
        y2={0.536133}
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.4999} stopColor="#DEE1E6" />
        <Stop offset={0.5} stopColor="#DEE1E6" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
