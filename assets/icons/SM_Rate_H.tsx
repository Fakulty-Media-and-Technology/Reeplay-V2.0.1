import * as React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={11}
    height={10}
    viewBox="0 0 10 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M4.18885 0.708911C4.50041 -0.186056 5.7661 -0.186055 6.07766 0.708911L6.5011 1.92523C6.64101 2.32713 7.01995 2.59646 7.44551 2.59646H8.66091C9.64626 2.59646 10.0377 3.8711 9.22215 4.42411L8.36025 5.00857C7.98537 5.26278 7.82816 5.73723 7.97708 6.165L8.33381 7.18972C8.65037 8.09903 7.62506 8.88653 6.82817 8.34615L5.69449 7.5774C5.35562 7.3476 4.91089 7.3476 4.57202 7.5774L3.43834 8.34615C2.64145 8.88653 1.61614 8.09903 1.93269 7.18972L2.28943 6.165C2.43835 5.73723 2.28114 5.26278 1.90626 5.00857L1.04436 4.42411C0.228836 3.8711 0.620255 2.59646 1.6056 2.59646H2.821C3.24656 2.59646 3.6255 2.32713 3.76541 1.92523L4.18885 0.708911Z"
      fill="url(#paint0_linear_307_78)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_307_78"
        x1={-9.13326}
        y1={11.3115}
        x2={5.13326}
        y2={11.3115}
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.9999} stopColor="#FFCC00" />
        <Stop offset={1} stopColor="#C4C4C4" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
