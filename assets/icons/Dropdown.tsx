import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={12}
    height={12}
    viewBox="0 0 9 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M6.21 6.08654C5.44234 6.98435 4.06792 7.02477 3.24883 6.17364L1.20531 4.0502C0.00200617 2.79983 0.853002 0.715254 2.58759 0.664234L6.54627 0.547794C8.28085 0.496773 9.2529 2.52772 8.12517 3.84666L6.21 6.08654Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
