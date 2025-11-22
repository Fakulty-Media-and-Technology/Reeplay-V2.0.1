import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={35}
    height={35}
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9.625 21.875H14.875"
      stroke="black"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M23.625 21.875H25.375"
      stroke="black"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M30.625 14.875L4.375 14.875"
      stroke="black"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M28.875 27.125L6.125 27.125C5.159 27.125 4.375 26.341 4.375 25.375L4.375 9.625C4.375 8.659 5.159 7.875 6.125 7.875L28.875 7.875C29.841 7.875 30.625 8.659 30.625 9.625L30.625 25.375C30.625 26.341 29.841 27.125 28.875 27.125Z"
      stroke="black"
      strokeWidth={0.8}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
