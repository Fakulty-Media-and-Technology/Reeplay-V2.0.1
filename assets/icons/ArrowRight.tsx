import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={13}
    height={22}
    viewBox="0 0 13 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0.166992 19.6227L2.04426 21.5L12.5442 11L2.04426 0.5L0.166992 2.37727L8.78966 11L0.166992 19.6227Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
