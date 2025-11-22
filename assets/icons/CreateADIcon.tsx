import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={21}
    height={15}
    viewBox="0 0 21 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect x={5} width={11} height={15} rx={1.5} fill="white" />
    <Rect y={2} width={4} height={11} rx={1} fill="white" />
    <Rect x={17} y={2} width={4} height={11} rx={1} fill="white" />
  </Svg>
);
export default SVGComponent;
