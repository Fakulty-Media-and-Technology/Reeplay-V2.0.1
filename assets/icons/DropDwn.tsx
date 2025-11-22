import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M3.45682 5.25003L2.25 6.45685L9 13.2068L15.75 6.45685L14.5432 5.25003L9 10.7932L3.45682 5.25003Z"
      fill="#BCC1CA"
    />
  </Svg>
);
export default SVGComponent;
