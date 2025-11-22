import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M4.40039 10H6.80039"
      stroke="#171A1F"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.7998 10H11.5998"
      stroke="#171A1F"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 6.80005L2 6.80005"
      stroke="#171A1F"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.2 12.4001L2.8 12.4001C2.3584 12.4001 2 12.0417 2 11.6001L2 4.4001C2 3.9585 2.3584 3.6001 2.8 3.6001L13.2 3.6001C13.6416 3.6001 14 3.9585 14 4.4001L14 11.6001C14 12.0417 13.6416 12.4001 13.2 12.4001Z"
      stroke="#171A1F"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
