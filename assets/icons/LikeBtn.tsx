import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={12}
    height={10}
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0 10H2.18182V4H0V10ZM12 4.5C12 3.95 11.5091 3.5 10.9091 3.5H7.46727L7.98546 1.215L8.00182 1.055C8.00182 0.85 7.90909 0.66 7.76182 0.525L7.18364 0L3.59455 3.295C3.39273 3.475 3.27273 3.725 3.27273 4V9C3.27273 9.55 3.76364 10 4.36364 10H9.27273C9.72546 10 10.1127 9.75 10.2764 9.39L11.9236 5.865C11.9727 5.75 12 5.63 12 5.5V4.5Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
