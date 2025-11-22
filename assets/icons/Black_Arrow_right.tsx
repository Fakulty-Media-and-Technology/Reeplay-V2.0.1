import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10.7147 6L1.28613 6"
      stroke="#171A1F"
      strokeWidth={0.857143}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.28613 2.57141L10.7147 5.99998L7.28613 9.42855"
      stroke="#171A1F"
      strokeWidth={0.857143}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
