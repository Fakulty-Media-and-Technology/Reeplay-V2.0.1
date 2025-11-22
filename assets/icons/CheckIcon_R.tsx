import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={10}
    height={8}
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0.799805 4L3.4998 6.7L9.19981 1"
      stroke="#FF1313"
      strokeWidth={0.72}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
