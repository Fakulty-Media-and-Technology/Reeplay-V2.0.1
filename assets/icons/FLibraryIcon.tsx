import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={8.93401} height={8.93401} rx={3.5} fill="#FF1313" />
    <Rect
      x={11.0664}
      width={8.93401}
      height={8.93401}
      rx={3.5}
      fill="#FF1313"
    />
    <Rect
      y={11.0664}
      width={8.93401}
      height={8.93401}
      rx={3.5}
      fill="#FF1313"
    />
    <Rect
      x={11.0664}
      y={11.0664}
      width={8.93401}
      height={8.93401}
      rx={3.5}
      fill="#FF1313"
    />
  </Svg>
);
export default SVGComponent;
