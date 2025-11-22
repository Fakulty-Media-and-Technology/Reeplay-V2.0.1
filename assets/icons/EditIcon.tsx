import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3.2998 19.25L18.6998 19.25"
      stroke="white"
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.7498 2.75L17.0498 6.05L7.6998 15.4L3.2998 16.5L4.3998 12.1L13.7498 2.75Z"
      stroke="white"
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.5498 4.94995L14.8498 8.24995"
      stroke="white"
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
