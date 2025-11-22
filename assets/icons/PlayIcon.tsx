import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={29}
    height={35}
    viewBox="0 0 29 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M26.3754 13.4328C29.2588 15.4201 29.2588 19.6793 26.3754 21.6666L8.81851 33.7672C5.50149 36.0534 0.981059 33.6789 0.981059 29.6504L0.98106 5.44912C0.98106 1.42056 5.50149 -0.953958 8.81852 1.33222L26.3754 13.4328Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
