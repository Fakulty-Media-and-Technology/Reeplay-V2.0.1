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
      d="M3 25C3 19.477 7.477 15 13 15L15 15C20.523 15 25 19.477 25 25"
      stroke="#E5E5E5"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <Path
      d="M14 15C17.3137 15 20 12.3137 20 9C20 5.68629 17.3137 3 14 3C10.6863 3 8 5.68629 8 9C8 12.3137 10.6863 15 14 15Z"
      stroke="#E5E5E5"
      strokeWidth={2.4}
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
  </Svg>
);
export default SVGComponent;
