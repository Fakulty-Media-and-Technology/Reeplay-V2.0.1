import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={9}
    height={9}
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M1.36917 7.96375L5.45625 5.08083C5.85292 4.7975 5.85292 4.2025 5.45625 3.92625L1.36917 1.03625C0.894583 0.710417 0.25 1.04333 0.25 1.61708V7.38292C0.25 7.95667 0.894583 8.28958 1.36917 7.96375ZM7.33333 0.958333V8.04167C7.33333 8.43125 7.65208 8.75 8.04167 8.75C8.43125 8.75 8.75 8.43125 8.75 8.04167V0.958333C8.75 0.56875 8.43125 0.25 8.04167 0.25C7.65208 0.25 7.33333 0.56875 7.33333 0.958333Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
