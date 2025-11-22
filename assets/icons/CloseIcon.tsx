import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M6.5 0C2.87857 0 0 2.87857 0 6.5C0 10.1214 2.87857 13 6.5 13C10.1214 13 13 10.1214 13 6.5C13 2.87857 10.1214 0 6.5 0ZM9.00714 9.75L6.5 7.24286L3.99286 9.75L3.25 9.00714L5.75714 6.5L3.25 3.99286L3.99286 3.25L6.5 5.75714L9.00714 3.25L9.75 3.99286L7.24286 6.5L9.75 9.00714L9.00714 9.75Z"
      fill="black"
    />
  </Svg>
);
export default SVGComponent;
