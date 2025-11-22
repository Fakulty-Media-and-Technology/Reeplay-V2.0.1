import * as React from 'react';
import Svg, {G, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props: any) => (
  <Svg
    width={39}
    height={46}
    viewBox="0 0 39 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G filter="url(#filter0_d_2560_306)">
      <Path
        d="M32.0672 14.637C34.9374 16.6254 34.9374 20.8687 32.0672 22.8571L12.7199 36.2604C9.40387 38.5576 4.87256 36.1843 4.87256 32.1503L4.87256 5.34387C4.87256 1.30985 9.40387 -1.06345 12.7199 1.23379L32.0672 14.637Z"
        fill="white"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SVGComponent;
