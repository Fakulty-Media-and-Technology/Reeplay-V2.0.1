import * as React from 'react';
import Svg, {Circle, Mask, G} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={9} cy={9} r={9} fill="white" />
    <Mask
      id="mask0_3529_4843"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={1}
      y={1}
      width={16}
      height={16}>
      <Circle cx={8.99977} cy={9.00026} r={7.94118} fill="#E5E5E5" />
    </Mask>
    <G mask="url(#mask0_3529_4843)">
      <Circle cx={8.99943} cy={16.412} r={6.35294} fill="black" />
      <Circle cx={8.9996} cy={6.35311} r={2.64706} fill="black" />
    </G>
  </Svg>
);
export default SVGComponent;
