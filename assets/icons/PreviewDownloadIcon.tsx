import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const SVGComponent = (props: any) => (
  <Svg
    width={14}
    height={17}
    viewBox="0 0 14 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      width={9.61655}
      height={3.00517}
      rx={1.50259}
      transform="matrix(0.707229 -0.706985 0.707229 0.706985 4.69397 14.3916)"
      fill="#E5E5E5"
    />
    <Rect
      x={5.39185}
      y={13.0664}
      width={12.3384}
      height={3.00338}
      rx={1.50169}
      transform="rotate(-90 5.39185 13.0664)"
      fill="#E5E5E5"
    />
    <Rect
      width={9.61566}
      height={3.00517}
      rx={1.50259}
      transform="matrix(0.707229 0.706985 -0.707229 0.706985 2.12537 7.58301)"
      fill="#E5E5E5"
    />
  </Svg>
);
export default SVGComponent;
