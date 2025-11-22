import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.5 12.5H8.5"
      stroke="#06D097"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.5 12.5H14.5"
      stroke="#06D097"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.5 8.5L2.5 8.5"
      stroke="#06D097"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.5 15.5L3.5 15.5C2.948 15.5 2.5 15.052 2.5 14.5L2.5 5.5C2.5 4.948 2.948 4.5 3.5 4.5L16.5 4.5C17.052 4.5 17.5 4.948 17.5 5.5V14.5C17.5 15.052 17.052 15.5 16.5 15.5Z"
      stroke="#06D097"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
