import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M14 25C20.0751 25 25 20.0751 25 14C25 7.92487 20.0751 3 14 3C7.92487 3 3 7.92487 3 14C3 20.0751 7.92487 25 14 25Z"
      stroke="#E5E5E5"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M14 13L14 19"
      stroke="#E5E5E5"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M14 10C14.5523 10 15 9.55228 15 9C15 8.44772 14.5523 8 14 8C13.4477 8 13 8.44772 13 9C13 9.55228 13.4477 10 14 10Z"
      fill="#E5E5E5"
    />
  </Svg>
);
export default SVGComponent;
