import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={22}
    height={23}
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M21.2973 11.314C21.2973 16.9207 16.7521 21.4659 11.1454 21.4659C5.53868 21.4659 0.99353 16.9207 0.99353 11.314C0.99353 5.70726 5.53868 1.16211 11.1454 1.16211C16.7521 1.16211 21.2973 5.70726 21.2973 11.314Z"
      fill="#1A1A1A"
      fillOpacity={0.85}
    />
    <Rect
      x={13.8912}
      y={14.9722}
      width={9.08918}
      height={1.70422}
      rx={0.85211}
      transform="rotate(-137 13.8912 14.9722)"
      fill="white"
    />
    <Rect
      x={7.24084}
      y={14.0571}
      width={9.08918}
      height={1.70422}
      rx={0.85211}
      transform="rotate(-47 7.24084 14.0571)"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
