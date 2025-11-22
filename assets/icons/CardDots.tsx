import * as React from 'react';
import Svg, {Circle} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={100}
    height={6}
    viewBox="0 0 100 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={3} cy={3} r={3} fill="white" />
    <Circle cx={11} cy={3} r={3} fill="white" />
    <Circle cx={19} cy={3} r={3} fill="white" />
    <Circle cx={27} cy={3} r={3} fill="white" />
    <Circle cx={43} cy={3} r={3} fill="white" />
    <Circle cx={51} cy={3} r={3} fill="white" />
    <Circle cx={59} cy={3} r={3} fill="white" />
    <Circle cx={81} cy={3} r={3} fill="white" />
    <Circle cx={89} cy={3} r={3} fill="white" />
    <Circle cx={97} cy={3} r={3} fill="white" />
    <Circle cx={67} cy={3} r={3} fill="white" />
  </Svg>
);
export default SVGComponent;
