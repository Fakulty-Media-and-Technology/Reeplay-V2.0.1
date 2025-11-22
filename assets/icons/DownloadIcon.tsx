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
      x={7.65234}
      y={12.7043}
      width={6.30119}
      height={1.96912}
      rx={0.984561}
      transform="rotate(-45 7.65234 12.7043)"
      fill="white"
    />
    <Rect
      x={8.10938}
      y={11.8357}
      width={8.08606}
      height={1.96761}
      rx={0.983805}
      transform="rotate(-90 8.10938 11.8357)"
      fill="white"
    />
    <Rect
      x={5.96973}
      y={8.24146}
      width={6.3006}
      height={1.96912}
      rx={0.984561}
      transform="rotate(45 5.96973 8.24146)"
      fill="white"
    />
    <Rect
      x={17}
      y={1}
      width={16}
      height={16}
      rx={4}
      transform="rotate(90 17 1)"
      stroke="white"
      strokeWidth={2}
    />
  </Svg>
);
export default SVGComponent;
