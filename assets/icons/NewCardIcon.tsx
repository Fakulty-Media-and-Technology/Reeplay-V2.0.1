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
      d="M2.57129 7.71436L21.4284 7.71436"
      stroke="#FFCC00"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M2.57129 11.1428L21.4284 11.1428"
      stroke="#FFCC00"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M19.7141 19.7142L4.28557 19.7142C3.33843 19.7142 2.57129 18.9471 2.57129 17.9999L2.57129 5.99993C2.57129 5.05279 3.33843 4.28564 4.28557 4.28564L15.4284 4.28564L19.7141 4.28564C20.6613 4.28564 21.4284 5.05279 21.4284 5.99993L21.4284 17.9999C21.4284 18.9471 20.6613 19.7142 19.7141 19.7142Z"
      stroke="#FFCC00"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M6 15.4285L10.2857 15.4285"
      stroke="#FFCC00"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M17.1426 15.4285H17.9997"
      stroke="#FFCC00"
      strokeWidth={2.05714}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
