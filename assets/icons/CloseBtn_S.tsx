import * as React from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={9} cy={9} r={9} fill="#C4C4C4" />
    <Rect
      width={10.4972}
      height={2.72151}
      rx={1.36075}
      transform="matrix(0.707107 0.707107 0.707107 -0.707107 4.65283 6.57715)"
      fill="black"
    />
    <Rect
      width={10.4972}
      height={2.72151}
      rx={1.36075}
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.0754 4.65283)"
      fill="black"
    />
  </Svg>
);
export default SVGComponent;
