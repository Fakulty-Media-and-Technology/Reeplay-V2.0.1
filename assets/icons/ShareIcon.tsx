import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={21}
    height={21}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M15.1549 12.7207V16.2921C15.1549 16.671 15.0044 17.0344 14.7365 17.3023C14.4686 17.5702 14.1052 17.7207 13.7263 17.7207H5.15489C4.77601 17.7207 4.41265 17.5702 4.14474 17.3023C3.87683 17.0344 3.72632 16.671 3.72632 16.2921V9.14927C3.72632 8.77039 3.87683 8.40703 4.14474 8.13912C4.41265 7.87121 4.77601 7.7207 5.15489 7.7207H7.29775"
      stroke="white"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M8.72632 13.4348C8.72632 11.5404 9.47887 9.72363 10.8184 8.38409C12.158 7.04454 13.9748 6.29199 15.8692 6.29199H18.012"
      stroke="white"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
    />
    <Path
      d="M15.1549 9.14983L18.0121 6.29269L15.1549 3.43555"
      stroke="white"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
