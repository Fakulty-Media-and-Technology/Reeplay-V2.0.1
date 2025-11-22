import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={9}
    height={6}
    viewBox="0 0 9 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={3.20953}
      y={4.65137}
      width={6.35936}
      height={1.9873}
      rx={0.99365}
      transform="rotate(-47 3.20953 4.65137)"
      fill="#C4C4C4"
    />
    <Rect
      x={1.35535}
      y={0.208984}
      width={6.35877}
      height={1.9873}
      rx={0.99365}
      transform="rotate(43 1.35535 0.208984)"
      fill="#C4C4C4"
    />
  </Svg>
);
export default SVGComponent;
