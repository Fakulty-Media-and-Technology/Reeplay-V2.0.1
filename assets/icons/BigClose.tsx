import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M18 6L6 18"
      stroke="white"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M18 18L6 6"
      stroke="white"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
