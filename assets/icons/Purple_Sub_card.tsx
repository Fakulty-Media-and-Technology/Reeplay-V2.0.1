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
      d="M2.57129 7.71423L21.4284 7.71423"
      stroke="#6D31ED"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M2.57129 11.1428L21.4284 11.1428"
      stroke="#6D31ED"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M19.7141 19.7143L4.28557 19.7143C3.33843 19.7143 2.57129 18.9472 2.57129 18.0001L2.57129 6.00005C2.57129 5.05291 3.33843 4.28577 4.28557 4.28577L15.4284 4.28577L19.7141 4.28577C20.6613 4.28577 21.4284 5.05291 21.4284 6.00005L21.4284 18.0001C21.4284 18.9472 20.6613 19.7143 19.7141 19.7143Z"
      stroke="#6D31ED"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M6 15.4286L10.2857 15.4286"
      stroke="#6D31ED"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M17.1426 15.4286H17.9997"
      stroke="#6D31ED"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
