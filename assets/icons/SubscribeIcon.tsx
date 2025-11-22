import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M6.875 15.625L10.625 15.625"
      stroke="#FFCC00"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.875 15.625H18.125"
      stroke="#FFCC00"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21.875 10.625L3.125 10.625"
      stroke="#FFCC00"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.625 19.375L4.375 19.375C3.685 19.375 3.125 18.815 3.125 18.125L3.125 6.875C3.125 6.185 3.685 5.625 4.375 5.625L20.625 5.625C21.315 5.625 21.875 6.185 21.875 6.875L21.875 18.125C21.875 18.815 21.315 19.375 20.625 19.375Z"
      stroke="#FFCC00"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
