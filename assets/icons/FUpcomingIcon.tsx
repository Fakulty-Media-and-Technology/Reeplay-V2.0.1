import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10.8516 0C5.33052 0 0.851562 4.47896 0.851562 10C0.851562 15.521 5.33052 20 10.8516 20C16.3726 20 20.8516 15.521 20.8516 10C20.8516 4.47896 16.3726 0 10.8516 0ZM10.3305 18.016V11.7435H6.84355L11.8536 1.98397V8.25651H15.2103L10.3305 18.016Z"
      fill="#FF1313"
    />
  </Svg>
);
export default SVGComponent;
