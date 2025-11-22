import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={20}
    height={14}
    viewBox="0 0 20 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      width={20}
      height={3}
      rx={1.5}
      transform="matrix(1 0 0 -1 0 8.5)"
      fill="white"
    />
    <Rect
      width={20}
      height={3}
      rx={1.5}
      transform="matrix(1 0 0 -1 0 3)"
      fill="white"
    />
    <Rect
      width={20}
      height={3}
      rx={1.5}
      transform="matrix(1 0 0 -1 0 14)"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
