import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={26}
    height={25}
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M13 3.48999L16.09 9.74999L23 10.754L18 15.628L19.18 22.51L13 19.262L6.82 22.51L8 15.628L3 10.754L9.91 9.74999L13 3.48999Z"
      stroke="#E5E5E5"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
