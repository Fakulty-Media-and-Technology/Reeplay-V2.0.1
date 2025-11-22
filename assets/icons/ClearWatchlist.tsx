import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={1}
      y={17}
      width={16}
      height={16}
      rx={4}
      transform="rotate(-90 1 17)"
      stroke="white"
      strokeWidth={2}
    />
    <Rect
      width={8.18182}
      height={2.45455}
      rx={1.22727}
      transform="matrix(0.707107 0.707107 0.707107 -0.707107 5.18164 7.36035)"
      fill="white"
    />
    <Rect
      width={8.83636}
      height={2.29091}
      rx={1.14545}
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 11.3945 5.47363)"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
